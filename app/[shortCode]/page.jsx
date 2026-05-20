import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function ShortCodePage({ params }) {
  const { shortCode } = params;

  const { data, error } = await supabase
    .from("links")
    .select("original_url")
    .eq("short_code", shortCode)
    .maybeSingle();

  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-semibold">Link not found</h1>
          <p className="mt-2 text-sm text-neutral-500">
            The short URL{" "}
            <span className="font-mono text-neutral-900">/{shortCode}</span>{" "}
            doesn&rsquo;t exist.
          </p>
          <a
            href="/"
            className="inline-block mt-6 text-sm font-medium px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition"
          >
            Create one
          </a>
        </div>
      </main>
    );
  }

  redirect(data.original_url);
}
