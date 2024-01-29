import { url } from "~/constants/metadata";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
      },
    ],
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
