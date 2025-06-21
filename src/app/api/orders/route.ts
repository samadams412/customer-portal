// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma, ExtendedPrismaClient } from "@/lib/prisma"; // Import ExtendedPrismaClient
import { withAuth } from "@/lib/auth"; // Assuming withAuth middleware is available

// Interface for the payload when placing an order
interface PlaceOrderPayload {
  shippingAddressId?: string; // Optional if deliveryType is PICKUP
  deliveryType: "DELIVERY" | "PICKUP"; // Assuming these are from DeliveryTypeEnum
  discountCode?: string; // Optional discount code
}

// --- POST /api/orders (Place an Order) ---
// This endpoint converts the user's current cart into a new order.
export const POST = withAuth(async (request: NextRequest, user, context: any) => {
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
    const order = await prisma.$transaction(async (prismaTx: any) => { // Use 'any' as workaround for Accelerate typing
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

      const taxRate = 0.0825; // Example: 8.25% sales tax
      const taxAmount = subtotalAmount * taxRate;
      
      // For now, no actual discount logic. If discountCode is present, apply dummy discount.
      // In a real app, you'd validate the discountCode and fetch its value.
      const discountAmount = discountCode ? (subtotalAmount * 0.10) : 0; // 10% dummy discount
      
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
          status: 'PENDING', // Initial status
          shippingAddressId: deliveryType === 'DELIVERY' ? shippingAddressId : null,
          // Optional: You might want to associate a dummy payment ID here if integrating a payment gateway
        },
      });
      console.log(`Created new order ${newOrder.id} for user ${user.id}`);


      // 4. Create OrderItems from CartItems
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

      // If needed, delete the cart itself if it's empty, or keep it.
      // await prismaTx.cart.delete({ where: { id: userCart.id } });

      return newOrder; // Return the newly created order
    });

    // Final response
    return NextResponse.json(order, { status: 201 }); // 201 Created

  } catch (error: unknown) {
    console.error("POST /api/orders error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
});

// --- GET /api/orders (Fetch User's Orders) ---
// Fetches all orders for the authenticated user, with details.
export const GET = withAuth(async (request: NextRequest, user, context: any) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        orderItems: {
          include: {
            product: true, // Include product details for each order item
          },
        },
        shippingAddress: true, // Include shipping address details if linked
      },
      orderBy: {
        orderDate: 'desc', // Order by most recent orders first
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
});
