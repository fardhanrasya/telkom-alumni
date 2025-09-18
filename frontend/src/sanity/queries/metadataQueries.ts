import { client } from "../client";

export async function getSectionMetadata(
  section:
    | "berita"
    | "karir"
    | "alumni"
    | "acara"
    | "tentang"
    | "home"
    | "galeri"
) {
  const type = section + "Metadata";
  const query = `
    *[_type == "${type}"][0]{
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      "ogImage": ogImage.asset->url,
      ogImageAlt,
      twitterTitle,
      twitterDescription,
      "twitterImage": twitterImage.asset->url
    }
  `;
  return await client.fetch(query);
}
