"use client";

// @ts-expect-error
import ClipboardCopy from "lucide-react/dist/esm/icons/clipboard-copy.js";
import { useState } from "react";
import { Link, useLocation } from "react-router";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

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
