import { artFiles, renderArtFile } from "@/lib/art/files";

/**
 * Generated illustrations as cacheable static files. Rendered once at build
 * time (also in the GitHub Pages export) instead of being inlined — twice,
 * HTML + RSC payload — into every page that shows them.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return artFiles().map((file) => ({ file }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const svg = renderArtFile(file);
  if (!svg) return new Response("Not found", { status: 404 });
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
