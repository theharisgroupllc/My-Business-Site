"use client";

import { useState } from "react";

const providers = {
  google: {
    label: "Google",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38Z" />
      </svg>
    ),
  },
  apple: {
    label: "Apple",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M16.37 1.43c0 1.05-.38 1.97-1.14 2.76-.82.85-1.78 1.34-2.82 1.26-.13-1 .39-2.07 1.12-2.82.8-.82 2.05-1.44 2.84-1.2ZM20.59 17.32c-.55 1.26-.82 1.82-1.53 2.93-.99 1.51-2.38 3.39-4.1 3.41-1.53.01-1.93-1-4.01-.99-2.08.01-2.52 1.01-4.05 1-1.72-.02-3.04-1.71-4.03-3.22-2.76-4.22-3.05-9.17-1.35-11.8 1.21-1.87 3.12-2.97 4.92-2.97 1.83 0 2.99 1.01 4.51 1.01 1.47 0 2.37-1.01 4.5-1.01 1.61 0 3.32.88 4.52 2.39-3.97 2.18-3.33 7.85.62 9.25Z" />
      </svg>
    ),
  },
} as const;

type SocialAuthPanelProps = {
  mode?: "login" | "signup";
};

export function SocialAuthPanel({ mode = "login" }: SocialAuthPanelProps) {
  const [activeProvider, setActiveProvider] = useState<keyof typeof providers>("google");
  const provider = providers[activeProvider];

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-white p-1 shadow-inner">
        {(Object.keys(providers) as Array<keyof typeof providers>).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveProvider(key)}
            className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
              activeProvider === key ? "bg-brand-navy text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {providers[key].icon}
            {providers[key].label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:border-brand-teal hover:text-brand-teal"
      >
        {provider.icon}
        {mode === "signup" ? "Sign up" : "Continue"} with {provider.label}
      </button>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        OAuth2-ready UI: connect this button to a secure provider callback and httpOnly session storage when a server auth layer is attached.
      </p>
    </div>
  );
}
