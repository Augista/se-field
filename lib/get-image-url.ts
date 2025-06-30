export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "/fields/default.jpg"

  // Jika sudah URL penuh (http:// atau https://), langsung pakai
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "fields"

  return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`
}
