import {defineField, defineType} from 'sanity'

export const daftarType = defineType({
  name: 'daftar',
  title: 'Daftar',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Lengkap',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      source: 'name',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'yearGraduated',
      title: 'Tahun Lulus',
      type: 'number',
      validation: (rule) => rule.required().min(1990).max(new Date().getFullYear()),
    }),
    defineField({
      name: 'major',
      title: 'Jurusan',
      type: 'string',
      options: {
        list: [
          {title: 'Rekayasa Perangkat Lunak', value: 'rpl'},
          {title: 'Teknik Komputer dan Jaringan', value: 'tkj'},
          {title: 'Multimedia', value: 'mm'},
          {title: 'Teknik Elektronika Industri', value: 'tei'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'profileImage',
      title: 'Foto Profil',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) =>
        rule.regex(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          {
            name: 'email',
            invert: false,
          },
        ),
    }),
    defineField({
      name: 'socialMedia',
      title: 'Media Sosial',
      type: 'object',
      fields: [
        {name: 'linkedin', title: 'LinkedIn', type: 'url'},
        {name: 'instagram', title: 'Instagram', type: 'url'},
        {name: 'twitter', title: 'Twitter/X', type: 'url'},
      ],
    }),
    defineField({
      name: 'currentJob',
      title: 'Pekerjaan Saat Ini',
      type: 'object',
      fields: [
        {name: 'title', title: 'Jabatan', type: 'string'},
        {name: 'company', title: 'Perusahaan', type: 'string'},
        {name: 'startDate', title: 'Tanggal Mulai', type: 'date'},
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Biografi',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'achievements',
      title: 'Prestasi',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', title: 'Judul Prestasi', type: 'string'},
            {name: 'year', title: 'Tahun', type: 'number'},
            {name: 'description', title: 'Deskripsi', type: 'text'},
          ],
        },
      ],
    }),
    defineField({
      name: 'evidence',
      type: 'image',
      title: 'Bukti Alumni',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'agreement',
      title: 'Persetujuan Tampil',
      type: 'boolean',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'yearGraduated',
      media: 'profileImage',
    },
  },
})
