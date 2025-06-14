// src/lib/auth-client.ts
import { jwtDecode } from "jwt-decode";

// Define the expected structure for the decoded JWT from client side
interface DecodedToken {
  exp: number;
  // Add other properties you expect to decode on the client, e.g., userId: string; email: string;
}

class AuthService {
  getProfile(): DecodedToken | null { // Explicitly type the return
    const token = this.getToken();
    return token ? jwtDecode<DecodedToken>(token) : null; // Type the decode result
  }

  loggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
      return decoded.exp < Date.now() / 1000;
    } catch (error) { // Changed 'err' to 'error' and now used for logging
      console.error("Error decoding token or token is invalid:", error); // Log the error for debugging
      return true;
    }
  }

  getToken(): string | null {
    return localStorage.getItem("id_token");
  }

  login(idToken: string) {
    localStorage.setItem("id_token", idToken);
    window.location.assign("/");
  }

  logout() {
    localStorage.removeItem("id_token");
    window.location.assign("/auth");
  }
}

// Assign the instance to a variable before exporting as default
const authServiceInstance = new AuthService();
export default authServiceInstance;
