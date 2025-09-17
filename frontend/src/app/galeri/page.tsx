import { Metadata } from "next";
import {
  getGalleriesPaginated,
  getGalleriesCount,
} from "@/sanity/services/gallery";
import MasonryGallery from "@/components/MasonryGallery";

export const metadata: Metadata = {
  title: "Galeri | SMK Telkom Jakarta",
  description:
    "Kumpulan foto kegiatan, prestasi, dan fasilitas SMK Telkom Jakarta",
};

const ITEMS_PER_PAGE = 12;

export default async function GaleriPage() {
  const [galleries, totalCount] = await Promise.all([
    getGalleriesPaginated(0, ITEMS_PER_PAGE - 1),
    getGalleriesCount(),
  ]);
  console.log(galleries);

  const hasMore = totalCount > ITEMS_PER_PAGE;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Galeri SMK Telkom Jakarta
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Dokumentasi kegiatan, prestasi siswa, dan fasilitas sekolah
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <MasonryGallery
            initialGalleries={galleries}
            initialHasMore={hasMore}
          />
        </div>
      </section>
    </div>
  );
}
