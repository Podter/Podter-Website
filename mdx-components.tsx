import type { MDXComponents } from "mdx/types";

import { mdxComponents } from "./lib/mdx";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...mdxComponents,
  };
}
