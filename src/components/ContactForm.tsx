"use client";

import { useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Contact request failed");
      event.currentTarget.reset();
      setState("success");
    } catch {
      setState("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
    >
      <h2 className="text-lg font-semibold text-brand-navy">Send a Message</h2>
      <div className="mt-4 space-y-3">
        <input name="name" required placeholder="Full name" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input name="email" required type="email" placeholder="Email address" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <input name="phone" placeholder="Phone number" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <textarea name="message" required placeholder="Your message" rows={5} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <button
          disabled={state === "submitting"}
          className="origin-center rounded-md bg-brand-navy px-5 py-3 text-sm font-semibold text-white transition-all duration-150 hover:scale-[1.03] hover:bg-brand-slate hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state === "submitting" ? "Submitting..." : "Submit Inquiry"}
        </button>
        {state === "success" && <p className="text-sm font-medium text-emerald-700">Inquiry submitted. We will respond as soon as possible.</p>}
        {state === "error" && <p className="text-sm font-medium text-red-600">Unable to submit right now. Please email info@everonglobaltrades.com.</p>}
      </div>
    </form>
  );
}
