import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const SHORT_CODE_RE = /^[A-Za-z0-9_-]+$/;
const RESERVED = new Set(["api", "_next", "favicon.ico", "robots.txt"]);

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const originalUrl = String(body.originalUrl || "").trim();
  const shortCode = String(body.shortCode || "").trim();

  if (!isValidUrl(originalUrl)) {
    return NextResponse.json(
      { error: "Please enter a valid http(s) URL." },
      { status: 400 }
    );
  }

  if (!SHORT_CODE_RE.test(shortCode) || shortCode.length > 64) {
    return NextResponse.json(
      { error: "Short name may only contain letters, numbers, - and _." },
      { status: 400 }
    );
  }

  if (RESERVED.has(shortCode.toLowerCase())) {
    return NextResponse.json(
      { error: "That short name is reserved. Try another." },
      { status: 400 }
    );
  }

  const { data: existing, error: lookupError } = await supabase
    .from("links")
    .select("short_code")
    .eq("short_code", shortCode)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json(
      { error: "Database error. Please try again." },
      { status: 500 }
    );
  }

  if (existing) {
    return NextResponse.json(
      { error: "That short name is already taken." },
      { status: 409 }
    );
  }

  const { error: insertError } = await supabase
    .from("links")
    .insert({ original_url: originalUrl, short_code: shortCode });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "That short name is already taken." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Could not create link. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ shortCode }, { status: 201 });
}
