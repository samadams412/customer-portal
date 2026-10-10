// __tests__/validationSchemas.test.ts
import { baseSchema, registerSchema } from '@/lib/validationSchemas';

describe("Zod Auth Schemas", () => {
  describe("baseSchema (login)", () => {
    it("should pass with valid email and password", () => {
      const result = baseSchema.safeParse({
        email: "user@example.com",
        password: "pass1234",
      });
      expect(result.success).toBe(true);
    });

    it("should fail with invalid email", () => {
      const result = baseSchema.safeParse({
        email: "bademail",
        password: "pass1234",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("registerSchema (strong password)", () => {
    it("should pass with valid complex password", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        password: "StrongPass123!",
      });
      expect(result.success).toBe(true);
    });

    it("should fail with weak password (no uppercase)", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        password: "weakpass123!",
      });
      expect(result.success).toBe(false);
    });

    it("should fail with weak password (too short)", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        password: "Short1!",
      });
      expect(result.success).toBe(false);
    });
  });
});
