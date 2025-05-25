import {defineField, defineType} from 'sanity'

export const jobPostingType = defineType({
  name: 'jobPosting',
  title: 'Lowongan Kerja',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Lowongan',
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
      name: 'company',
      title: 'Perusahaan',
      type: 'object',
      fields: [
        {name: 'name', title: 'Nama Perusahaan', type: 'string'},
        {name: 'logo', title: 'Logo Perusahaan', type: 'image', options: {hotspot: true}},
        {name: 'website', title: 'Website Perusahaan', type: 'url'},
        {name: 'location', title: 'Lokasi', type: 'string'},
      ],
    }),
    defineField({
      name: 'postedBy',
      title: 'Diposting oleh',
      type: 'reference',
      to: [{type: 'alumni'}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Publikasi',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'expiresAt',
      title: 'Tanggal Kadaluarsa',
      type: 'datetime',
    }),
    defineField({
      name: 'jobType',
      title: 'Jenis Pekerjaan',
      type: 'string',
      options: {
        list: [
          {title: 'Full-time', value: 'fullTime'},
          {title: 'Part-time', value: 'partTime'},
          {title: 'Contract', value: 'contract'},
          {title: 'Freelance', value: 'freelance'},
          {title: 'Internship', value: 'internship'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'workplaceType',
      title: 'Jenis Tempat Kerja',
      type: 'string',
      options: {
        list: [
          {title: 'On-site', value: 'onsite'},
          {title: 'Remote', value: 'remote'},
          {title: 'Hybrid', value: 'hybrid'},
        ],
      },
    }),
    defineField({
      name: 'salaryRange',
      title: 'Kisaran Gaji',
      type: 'object',
      fields: [
        {name: 'min', title: 'Minimum', type: 'number'},
        {name: 'max', title: 'Maksimum', type: 'number'},
        {name: 'currency', title: 'Mata Uang', type: 'string', initialValue: 'IDR'},
        {name: 'isPublic', title: 'Tampilkan Gaji', type: 'boolean', initialValue: false},
      ],
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi Pekerjaan',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'requirements',
      title: 'Persyaratan',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'responsibilities',
      title: 'Tanggung Jawab',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'applyLink',
      title: 'Link Lamaran',
      type: 'url',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email Kontak',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      companyName: 'company.name',
      media: 'company.logo',
    },
    prepare({title, companyName, media}) {
      return {
        title,
        subtitle: companyName,
        media,
      }
    },
  },
})
