import {defineField, defineType} from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'Acara',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Acara',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Tanggal Mulai',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Tanggal Selesai',
      type: 'datetime',
    }),
    defineField({
      name: 'location',
      title: 'Lokasi',
      type: 'object',
      fields: [
        {name: 'name', title: 'Nama Tempat', type: 'string'},
        {name: 'address', title: 'Alamat', type: 'text'},
        {name: 'city', title: 'Kota', type: 'string'},
        {name: 'mapLink', title: 'Link Google Maps', type: 'url'},
      ],
    }),
    defineField({
      name: 'isVirtual',
      title: 'Acara Virtual?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'virtualLink',
      title: 'Link Acara Virtual',
      type: 'url',
      hidden: ({document}) => !document?.isVirtual,
    }),
    defineField({
      name: 'image',
      title: 'Gambar Acara',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'speakers',
      title: 'Pembicara',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', title: 'Nama', type: 'string'},
            {name: 'title', title: 'Jabatan', type: 'string'},
            {name: 'company', title: 'Perusahaan', type: 'string'},
            {name: 'bio', title: 'Biografi Singkat', type: 'text'},
            {name: 'image', title: 'Foto', type: 'image', options: {hotspot: true}},
          ],
        },
      ],
    }),
    defineField({
      name: 'registrationLink',
      title: 'Link Pendaftaran',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'startDate',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      const date = subtitle ? new Date(subtitle).toLocaleDateString() : ''
      return {
        title,
        subtitle: `${date}`,
        media,
      }
    },
  },
})
