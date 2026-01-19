// Webhook configuration untuk Sanity Studio
// File ini berisi konfigurasi webhook yang akan dipanggil saat ada perubahan konten

export const revalidateWebhook = {
  name: 'revalidate-nextjs',
  url: process.env.SANITY_STUDIO_REVALIDATE_URL || 'https://telkom-alumni-git-dev-fardhans-projects.vercel.app/',
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.SANITY_STUDIO_REVALIDATE_SECRET}`,
    'Content-Type': 'application/json',
  },
  // Trigger webhook untuk semua document types
  filter: `_type in ["gallery", "news", "alumni", "event", "jobPosting"]`,
  projection: `{
    "type": _type,
    "slug": slug.current,
    "action": select(
      _originalId in path("drafts.**") => "draft",
      !defined(_originalId) => "create",
      "update"
    )
  }`,
}

// Function untuk mengirim webhook secara manual (untuk testing)
export async function triggerRevalidation(type: string, slug?: string) {
  const webhookUrl = process.env.SANITY_STUDIO_REVALIDATE_URL
  const secret = process.env.SANITY_STUDIO_REVALIDATE_SECRET

  if (!webhookUrl || !secret) {
    console.error('Webhook URL or secret not configured')
    return
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        slug,
        action: 'manual',
      }),
    })

    if (response.ok) {
      console.log('Revalidation triggered successfully')
    } else {
      console.error('Failed to trigger revalidation:', response.statusText)
    }
  } catch (error) {
    console.error('Error triggering revalidation:', error)
  }
}
