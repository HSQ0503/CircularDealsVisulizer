import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => <h2 className="research-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="research-h3">{children}</h3>,
    p: ({ children }) => <p>{children}</p>,
    ul: ({ children }) => <ul className="research-list">{children}</ul>,
    ol: ({ children }) => <ol className="research-list">{children}</ol>,
    li: ({ children }) => <li>{children}</li>,
    em: ({ children }) => <em>{children}</em>,
    strong: ({ children }) => <strong>{children}</strong>,
    blockquote: ({ children }) => (
      <div className="research-callout">{children}</div>
    ),
    pre: ({ children }) => <div className="research-code">{children}</div>,
    code: ({ children }) => <code>{children}</code>,
    hr: () => <hr style={{ margin: "2rem 0", border: "none", borderTop: "1px solid var(--research-border)" }} />,
    ...components,
  };
}
