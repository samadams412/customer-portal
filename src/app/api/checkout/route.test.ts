import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the session helper so the route treats the request as authenticated.
vi.mock("@/lib/auth-server", () => ({
  getSessionUser: vi.fn().mockResolvedValue({ id: "user-1", email: "shopper@test.com" }),
}));

// In-DB product: the only source of truth the route should use for pricing.
const dbProduct = {
  id: "prod-1",
  name: "Widget",
  price: 50,
  inStock: true,
};

const prismaMock = {
  product: {
    findMany: vi.fn().mockResolvedValue([dbProduct]),
  },
  discountCode: {
    findUnique: vi.fn().mockResolvedValue(null),
  },
  order: {
    create: vi.fn().mockResolvedValue({ id: "order-1" }),
  },
};

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

const checkoutSessionsCreate = vi.fn().mockResolvedValue({ url: "https://stripe.test/session" });
const couponsCreate = vi.fn();

vi.mock("stripe", () => ({
  default: function MockStripe() {
    return {
      coupons: { create: couponsCreate },
      checkout: { sessions: { create: checkoutSessionsCreate } },
    };
  },
}));

describe("POST /api/checkout", () => {
  beforeEach(() => {
    prismaMock.order.create.mockClear();
    checkoutSessionsCreate.mockClear();
  });

  it("prices the order and the Stripe session from the DB price, ignoring a tampered client price", async () => {
    const { POST } = await import("./route");

    // Same shape as a real client payload, but with product.price tampered
    // to $0.01 instead of the real $50 DB price.
    const tamperedCartItems = [
      {
        id: "cart-item-1",
        productId: dbProduct.id,
        quantity: 1,
        product: { ...dbProduct, price: 0.01 },
      },
    ];

    const req = {
      json: async () => ({
        cartItems: tamperedCartItems,
        deliveryType: "PICKUP",
        discountCode: null,
      }),
    } as any;

    await POST(req);

    // Order written to the DB must use the real $50 price, not the tampered $0.01.
    expect(prismaMock.order.create).toHaveBeenCalledTimes(1);
    const orderData = prismaMock.order.create.mock.calls[0][0].data;
    expect(orderData.subtotalAmount).toBe(50);
    expect(orderData.orderItems.create[0].priceAtPurchase).toBe(50);

    // The amount handed to Stripe must also be based on the real price:
    // 50 dollars -> 5000 cents, not 1 cent.
    expect(checkoutSessionsCreate).toHaveBeenCalledTimes(1);
    const stripeArgs = checkoutSessionsCreate.mock.calls[0][0];
    expect(stripeArgs.line_items[0].price_data.unit_amount).toBe(5000);
  });
});
