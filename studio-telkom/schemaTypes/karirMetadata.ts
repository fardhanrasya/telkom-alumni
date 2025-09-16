export default {
  name: 'karirMetadata',
  title: 'Karir Metadata',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    { name: 'title', title: 'Title', type: 'string', description: 'Main title for the Karir page (SEO title)' },
    { name: 'description', title: 'Description', type: 'text', description: 'Meta description for the Karir page' },
    { name: 'keywords', title: 'Keywords', type: 'array', of: [{ type: 'string' }], description: 'Comma-separated keywords for SEO' },
    { name: 'ogTitle', title: 'Open Graph Title', type: 'string', description: 'Title for social sharing (Open Graph)' },
    { name: 'ogDescription', title: 'Open Graph Description', type: 'text', description: 'Description for social sharing (Open Graph)' },
    { name: 'ogImage', title: 'Open Graph Image', type: 'image', description: 'Image for social sharing (Open Graph)', options: { hotspot: true } },
    { name: 'ogImageAlt', title: 'Open Graph Image Alt', type: 'string', description: 'Alt text for the Open Graph image' },
    { name: 'twitterTitle', title: 'Twitter Title', type: 'string', description: 'Title for Twitter card' },
    { name: 'twitterDescription', title: 'Twitter Description', type: 'text', description: 'Description for Twitter card' },
    { name: 'twitterImage', title: 'Twitter Image', type: 'image', description: 'Image for Twitter card', options: { hotspot: true } },
  ],
}; 