"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
          const response = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          const payload = (await response.json()) as { ok?: boolean; error?: string };
          if (!response.ok || !payload.ok) {
            throw new Error(payload.error || "Unable to subscribe right now.");
          }
          setStatus("success");
          setMessage("Subscribed successfully.");
          setEmail("");
        } catch (error) {
          setStatus("error");
          setMessage(error instanceof Error ? error.message : "Unable to subscribe right now.");
        }
      }}
    >
      <div className="w-full sm:max-w-md">
        <input
          type="email"
          required
          placeholder="Enter your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none ring-brand-teal focus:ring"
        />
        {message && <p className={`mt-2 text-xs ${status === "success" ? "text-emerald-700" : "text-red-600"}`}>{message}</p>}
      </div>
      <button
        disabled={status === "loading"}
        className="rounded-md bg-brand-teal px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Subscribing..." : "Subscribe Newsletter"}
      </button>
    </form>
  );
}
