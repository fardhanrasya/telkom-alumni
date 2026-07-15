export default {
  name: 'beritaMetadata',
  title: 'Berita Metadata',
  type: 'document',
  // Make this a singleton by hiding the "Create" button in the Studio if one exists
  __experimental_actions: ['update', 'publish'], // disable create and delete
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Main title for the Berita page (SEO title)',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Meta description for the Berita page',
    },
    {
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Comma-separated keywords for SEO',
    },
    // Open Graph
    {
      name: 'ogTitle',
      title: 'Open Graph Title',
      type: 'string',
      description: 'Title for social sharing (Open Graph)',
    },
    {
      name: 'ogDescription',
      title: 'Open Graph Description',
      type: 'text',
      description: 'Description for social sharing (Open Graph)',
    },
    {
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Image for social sharing (Open Graph)',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'ogImageAlt',
      title: 'Open Graph Image Alt',
      type: 'string',
      description: 'Alt text for the Open Graph image',
    },
    // Twitter
    {
      name: 'twitterTitle',
      title: 'Twitter Title',
      type: 'string',
      description: 'Title for Twitter card',
    },
    {
      name: 'twitterDescription',
      title: 'Twitter Description',
      type: 'text',
      description: 'Description for Twitter card',
    },
    {
      name: 'twitterImage',
      title: 'Twitter Image',
      type: 'image',
      description: 'Image for Twitter card',
      options: {
        hotspot: true,
      },
    },
  ],
};
