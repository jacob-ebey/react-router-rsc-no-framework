interface MarkdownRendererProps {
  children: string;
}

export function MarkdownRenderer({ children }: MarkdownRendererProps) {
  return <pre className="whitespace-pre-wrap">{children}</pre>;
}
