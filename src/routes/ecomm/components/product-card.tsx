import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ecommHome } from "@/global-config";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

export type ProductCardProps = {
  description: string;
  featuredImage?: {
    url: string;
    altText?: string | null;
  } | null;
  handle: string;
  id: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  title: string;
};

export function ProductCard({
  description,
  featuredImage,
  handle,
  id,
  priceRange,
  title,
}: ProductCardProps) {
  return (
    <Link
      key={id}
      to={`${ecommHome}/product/${handle}`}
      className="flex flex-col"
    >
      <Card
        key={id}
        className={cn("flex-1", {
          "pt-0": !!featuredImage,
        })}
      >
        {featuredImage && (
          <img
            loading="lazy"
            src={featuredImage.url}
            alt={featuredImage.altText || ""}
            className="rounded-md object-cover w-full aspect-video"
          />
        )}
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto">
          <div>
            <span>{priceRange.minVariantPrice.amount}</span>
            &nbsp;
            <span className="text-sm">
              {priceRange.minVariantPrice.currencyCode}
            </span>
            {priceRange.minVariantPrice.amount !==
              priceRange.maxVariantPrice.amount && (
              <span>
                {" "}
                - {priceRange.maxVariantPrice.amount}{" "}
                <span className="text-sm">
                  {priceRange.maxVariantPrice.currencyCode}
                </span>
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
