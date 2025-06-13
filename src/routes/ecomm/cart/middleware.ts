import { getAuthSessionValue, setAuthSessionValue } from "@/auth/middleware";

export function getCartId() {
  return getAuthSessionValue("cartId");
}

export function setCartId(cartId: string) {
  setAuthSessionValue("cartId", cartId);
}
