import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'galleryMetadata',
  title: 'Galeri Page Metadata',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Galeri | SMK Telkom Jakarta',
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      initialValue: 'Kumpulan foto kegiatan, prestasi, dan fasilitas SMK Telkom Jakarta',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      initialValue: 'Galeri SMK Telkom Jakarta',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      initialValue: 'Dokumentasi kegiatan, prestasi siswa, dan fasilitas sekolah',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Galeri Page Metadata',
      }
    },
  },
})
