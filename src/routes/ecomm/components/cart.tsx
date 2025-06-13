// @ts-expect-error
import ShoppingCart from "lucide-react/dist/esm/icons/shopping-cart.js";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { getCartData } from "../cart/api";
import { getCartId } from "../cart/middleware";

export function CartButton() {
  const cartId = getCartId();
  const cartDataPromise = cartId ? getCartData(cartId) : null;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button type="button" size="sm">
          <ShoppingCart />
          <span className="sr-only">Your Cart</span>

          <Suspense fallback="..">
            <AwaitQuantity
              quantityPromise={cartDataPromise
                ?.then((cart) => cart.cart?.totalQuantity)
                .catch(() => undefined)}
            />
          </Suspense>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Cart</DrawerTitle>
          <DrawerDescription>Review your purchase.</DrawerDescription>
        </DrawerHeader>
        <div className="@container">
          {cartDataPromise ? (
            <CartContent cartDataPromise={cartDataPromise} />
          ) : null}
        </div>
        <DrawerFooter>
          <Button>Checkout</Button>
          <DrawerClose asChild>
            <Button variant="outline">Keep Shopping</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

async function CartContent({
  cartDataPromise,
}: {
  cartDataPromise: ReturnType<typeof getCartData>;
}) {
  const { cart } = await cartDataPromise;
  const lines = cart?.lines ?? { nodes: [] };

  return (
    <div className="grid @2xl:grid-cols-2">
      {lines.nodes.map((line) => (
        <div
          key={line.id}
          className="flex text-sm leading-tight whitespace-nowrap-b p-4"
        >
          <div className="flex flex-col items-start gap-2">
            <span className="font-medium">
              {line.merchandise.product.title}
            </span>{" "}
            <span className="line-clamp-2 text-xs whitespace-break-spaces">
              {line.merchandise.title}
            </span>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-2">
              <Button type="button" size="sm">
                -
              </Button>
              <span>
                <span className="sr-only">Quantity: </span>
                {line.quantity}
              </span>
              <Button type="button" size="sm">
                +
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function AwaitQuantity({
  quantityPromise,
}: {
  quantityPromise: Promise<number | undefined> | undefined;
}) {
  const quantity = (await quantityPromise) ?? 0;

  return <>{quantity}</>;
}
