export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://nostresscv.vercel.app/sitemap.xml',
  }
}
