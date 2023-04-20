import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // const users = await prisma.user.findMany({
  //   select: {
  //     id: true,
  //   },
  //   take: 1,
  // });

  return [
    {
      url: "https://ai.flashcardx.com",
      lastModified: new Date(),
    },
  ];
}
