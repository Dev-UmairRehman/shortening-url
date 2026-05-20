"use client";

import { useState } from "react";

export default function HomePage() {
  const [longUrl, setLongUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setCopied(false);
    setLoading(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: longUrl, shortCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      setResult({ shortUrl: `${origin}/${data.shortCode}` });
      setLongUrl("");
      setShortCode("");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result?.shortUrl) return;
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Shorty</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Create custom short links in seconds.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4"
        >
          <div>
            <label
              htmlFor="longUrl"
              className="block text-sm font-medium mb-1.5"
            >
              Long URL
            </label>
            <input
              id="longUrl"
              type="url"
              required
              placeholder="https://example.com/very/long/link"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="shortCode"
              className="block text-sm font-medium mb-1.5"
            >
              Custom short name
            </label>
            <div className="flex items-center rounded-lg border border-neutral-300 focus-within:ring-2 focus-within:ring-neutral-900 focus-within:border-transparent overflow-hidden">
              <span className="px-3 py-2 text-sm text-neutral-500 bg-neutral-50 border-r border-neutral-200">
                /
              </span>
              <input
                id="shortCode"
                type="text"
                required
                pattern="[A-Za-z0-9_-]+"
                title="Letters, numbers, dashes and underscores only"
                placeholder="youtube"
                value={shortCode}
                onChange={(e) =>
                  setShortCode(
                    e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9_-]/g, "")
                  )
                }
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Letters, numbers, dashes and underscores only.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Creating..." : "Create short URL"}
          </button>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
        </form>

        {result && (
          <div className="mt-6 bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
              Your short URL
            </p>
            <div className="flex items-center gap-2">
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 truncate text-sm font-medium text-neutral-900 hover:underline"
              >
                {result.shortUrl}
              </a>
              <button
                onClick={handleCopy}
                className="text-xs font-medium px-3 py-1.5 rounded-md border border-neutral-300 hover:bg-neutral-50 transition"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
