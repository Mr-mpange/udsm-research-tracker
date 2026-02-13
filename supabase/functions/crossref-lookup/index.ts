const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { doi } = await req.json();
    if (!doi || typeof doi !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'doi' parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanDoi = doi.replace(/^https?:\/\/doi\.org\//, "");
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`, {
      headers: { "User-Agent": "UDSM-Dashboard/1.0 (mailto:research@udsm.ac.tz)" },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Crossref returned ${res.status}` }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const work = data.message;

    return new Response(
      JSON.stringify({
        doi: cleanDoi,
        title: work.title?.[0] ?? null,
        citations: work["is-referenced-by-count"] ?? 0,
        references: work["references-count"] ?? 0,
        publisher: work.publisher ?? null,
        type: work.type ?? null,
        issued: work.issued?.["date-parts"]?.[0] ?? null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
