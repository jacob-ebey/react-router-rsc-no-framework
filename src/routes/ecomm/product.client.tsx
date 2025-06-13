"use client";

// @ts-expect-error
import ClipboardCopy from "lucide-react/dist/esm/icons/clipboard-copy.js";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useLocation } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

import { addToCartAction } from "./cart/actions";

export function ProductOptions({
  defaultSelectedOptions,
  options,
}: {
  defaultSelectedOptions: Record<string, string>;
  options: {
    id: string;
    name: string;
    optionValues: { id: string; name: string }[];
  }[];
}) {
  const [selectedOptions, setSelectedOptions] = useState(
    defaultSelectedOptions
  );

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.id} className="space-y-2">
          <label className="text-sm font-medium">{option.name}</label>
          <div className="flex flex-wrap gap-2">
            {option.optionValues.map((value) => (
              <ProductValue
                key={value.id}
                name={option.name}
                value={value.name}
                selected={selectedOptions[option.name] === value.name}
                onSelectedChange={(selected) => {
                  setSelectedOptions((prev) => ({
                    ...prev,
                    [option.name]: selected ? value.name : prev[option.name],
                  }));
                }}
              >
                {value.name}
              </ProductValue>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductValue({
  children,
  selected,
  name,
  value,
  onSelectedChange,
}: {
  children: React.ReactNode;
  selected: boolean;
  name: string;
  value: string;
  onSelectedChange?: (selected: boolean) => void;
}) {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  searchParams.set(name, value);

  return (
    <div>
      <a
        data-prevent-scroll-reset
        href={`${location.pathname}?${searchParams.toString()}`}
        onClick={() => {
          if (onSelectedChange) {
            onSelectedChange(!selected);
          }
        }}
      >
        <Toggle pressed={selected}>{children}</Toggle>
      </a>
      {selected && <input type="hidden" name={name} value={value} />}
    </div>
  );
}

export function AddToCartForm({ children }: { children?: React.ReactNode }) {
  return (
    <form
      className="space-y-6"
      action={async (formData) => {
        const errors = await addToCartAction(formData);
        if (errors) {
          toast.error("Failed to add item to cart.", {
            position: "top-right",
          });
        }
      }}
    >
      {children}
    </form>
  );
}

export function AddToCartButton({
  disabled,
  ...props
}: React.ComponentProps<typeof Button>) {
  const status = useFormStatus();

  return <Button disabled={status.pending || disabled} {...props} />;
}

export function CopyPermalinkButton({ disabled }: { disabled?: boolean }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Permalink copied to clipboard!");
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleCopy}
      size="lg"
      className="w-full sm:w-auto"
      disabled={disabled}
    >
      <ClipboardCopy />
      Copy Permalink
    </Button>
  );
}
