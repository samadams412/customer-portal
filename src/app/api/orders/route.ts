import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-server"; 

// Define the expected shape for placing an order
interface PlaceOrderPayload {
  shippingAddressId?: string; // Optional if deliveryType is PICKUP
  deliveryType: "DELIVERY" | "PICKUP"; // Assuming these are from DeliveryTypeEnum
  discountCode?: string; // Optional discount code
}

// Create User Order
// --- POST /api/orders (Place an Order) ---
export async function POST(request: NextRequest) {
  // Authenticate the user using NextAuth.js session
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { shippingAddressId, deliveryType, discountCode }: PlaceOrderPayload = await request.json();

    // Basic validation
    if (!deliveryType || (deliveryType === 'DELIVERY' && !shippingAddressId)) {
      return NextResponse.json(
        { error: "Missing delivery type or shipping address for delivery order" },
        { status: 400 }
      );
    }

    // Start a Prisma transaction to ensure atomicity for order creation and cart clearing
    const order = await prisma.$transaction(async (prismaTx) => {
      // 1. Fetch the user's cart and its items
      const userCart = await prismaTx.cart.findUnique({
        where: { userId: user.id },
        include: {
          items: {
            include: {
              product: true, // Include product details to get price and availability
            },
          },
        },
      });

      if (!userCart || userCart.items.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }

      // 2. Calculate order totals
      let subtotalAmount = 0;
      for (const item of userCart.items) {
        subtotalAmount += item.product.price * item.quantity;
      }

      const taxRate = 0.0825; // Example: 8.25% sales tax (adjust as needed)
      const taxAmount = subtotalAmount * taxRate;
      
      const discountAmount = discountCode ? (subtotalAmount * 0.10) : 0; // 10% dummy discount (replace with real logic)
      
      const totalAmount = subtotalAmount + taxAmount - discountAmount;

      // 3. Create the new Order
      const newOrder = await prismaTx.order.create({
        data: {
          userId: user.id,
          subtotalAmount: parseFloat(subtotalAmount.toFixed(2)),
          taxAmount: parseFloat(taxAmount.toFixed(2)),
          discountCode: discountCode || null,
          discountAmount: parseFloat(discountAmount.toFixed(2)),
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          deliveryType: deliveryType,
          status: 'PENDING', // Initial status (will be updated by Stripe webhook for payment confirmation)
          shippingAddressId: deliveryType === 'DELIVERY' ? shippingAddressId : null,
        },
      });
      console.log(`Created new order ${newOrder.id} for user ${user.id}`);


      // 4. Create OrderItems from CartItems (snapshot of the cart at time of order)
      const orderItemsData = userCart.items.map((item: { productId: any; quantity: any; product: { price: any; }; }) => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.product.price, // Snapshot the price at the time of purchase
      }));

      await prismaTx.orderItem.createMany({
        data: orderItemsData,
      });
      console.log(`Created ${orderItemsData.length} order items for order ${newOrder.id}`);

      // 5. Clear the user's cart (delete all CartItems for this cart)
      await prismaTx.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });
      console.log(`Cleared cart ${userCart.id} for user ${user.id}`);

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 }); // 201 Created
  } catch (error: unknown) {
    console.error("POST /api/orders error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}

// --- GET /api/orders (Fetch User's Orders) ---
export async function GET(request: NextRequest) {
  // Authenticate the user using NextAuth.js session
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        orderItems: {
          include: {
            product: true, // Include product details for each item
          },
        },
        shippingAddress: true, // Include the shipping address details if available
      },
      orderBy: {
        orderDate: 'desc', // Order by most recent first
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/orders error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
