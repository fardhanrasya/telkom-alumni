import {defineField, defineType} from 'sanity'

// Definisi skema untuk tag berita
export const NewsTagType = defineType({
  name: 'NewsTag',
  title: 'Tag Berita',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Tag',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi',
      type: 'text',
    }),
  ],
})

// Definisi skema untuk penulis berita
export const AuthorType = defineType({
  name: 'Author',
  title: 'Penulis',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Lengkap',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Foto Profil',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'position',
      title: 'Role',
      type: 'string',
    }),
  ],
})

// Skema utama untuk berita
export const NewsPostType = defineType({
  name: 'NewsPost',
  title: 'Berita',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Berita',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Sub Judul',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Penulis',
      type: 'reference',
      to: [{type: 'Author'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Gambar Utama',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tag Berita',
      type: 'array',
      of: [{type: 'reference', to: {type: 'NewsTag'}}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Publikasi',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Tanggal Update',
      type: 'datetime',
    }),
    defineField({
      name: 'excerpt',
      title: 'Ringkasan',
      type: 'text',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'body',
      title: 'Isi Berita',
      type: 'array',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'featured',
      title: 'Berita Unggulan',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Status Publikasi',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Dipublikasikan', value: 'published'},
          {title: 'Diarsipkan', value: 'archived'},
        ],
      },
      initialValue: 'draft',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author ? `oleh ${author}` : 'Penulis tidak diketahui'}
    },
  },
})