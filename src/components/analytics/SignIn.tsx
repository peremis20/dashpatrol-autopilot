"use client";

import { useEffect, useState } from "react";
import { ConnectButton, GoogleClientForm, SetupSteps } from "./SettingsPanel";
import { BarsIcon, BoltIcon, KeyIcon } from "./Icons";

const FEATURES = [
  { icon: BarsIcon, title: "Analytics and Search Console together", text: "Traffic, searches and top pages in one view." },
  { icon: KeyIcon, title: "Find quick SEO wins", text: "See the searches you almost rank for and track your positions weekly." },
  { icon: BoltIcon, title: "SEO on autopilot", text: "Your pages improve every day on Shopify, WordPress, Webflow, Wix or any site, with every change logged and undoable." },
];

/** What a visitor sees before signing in. */
export function SignInScreen({ error }: { error?: string | null }) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [unreachable, setUnreachable] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setUnreachable(false);
    setAvailable(null);
    fetch("/api/session")
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((s) => {
        // The owner setup form only shows when the server itself says sign in isn't set up.
        if (typeof s?.signInAvailable !== "boolean") throw new Error("unexpected answer");
        setAvailable(s.signInAvailable);
      })
      .catch(() => setUnreachable(true));
  }, [attempt]);

  // The public site (dashpatrol.io) when the app runs on app.dashpatrol.io, so the menu matches the home page.
  const [home, setHome] = useState("");
  useEffect(() => {
    const h = window.location.host;
    if (/^app\./i.test(h)) setHome(`https://${h.slice(4)}`);
  }, []);
  const site = home || "https://dashpatrol.io";
  const links: [string, string][] = [
    ["Benefits", "/benefits.html"],
    ["Features", "/features.html"],
    ["How It Works", "/how-it-works.html"],
    ["Pricing", "/pricing.html"],
    ["FAQ", "/faq.html"],
  ];

  return (
    <div className="min-h-screen bg-[#06341A] bg-[radial-gradient(900px_620px_at_78%_38%,#15893E_0%,rgba(21,137,62,0)_62%)] font-dash text-white">
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#06341A]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-5 px-5 py-3 sm:px-8">
          <a target="_top" href={`${site}/`} className="flex items-center gap-2 text-[25px] font-bold tracking-[-0.02em] text-white no-underline">
            <span className="grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-[#8FE33B] shadow-[inset_0_-3px_0_rgba(0,0,0,0.12)]">
              <span className="h-[18px] w-[14px] rounded-r-[9px] border-[4px] border-l-[5px] border-[#06341A]" />
            </span>
            DashPatrol
          </a>
          <nav className="hidden items-center gap-[30px] text-[15px] font-medium md:flex" aria-label="Main">
            {links.map(([label, path]) => (
              <a key={path} target="_top" href={`${site}${path}`} className="text-white no-underline hover:text-[#8FE33B]">{label}</a>
            ))}
          </nav>
          <a target="_top" href={`${site}/`} className="text-sm font-semibold text-[#A6F04F] no-underline hover:underline md:hidden">Home</a>
        </div>
      </header>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="mb-10 text-center">
            <p className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-bold tracking-[0.06em] text-[#A6F04F]">
              YOUR SEO TEAM, IN ONE APP
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-[-0.02em] sm:text-6xl">
              Grow your business on <span className="text-[#A6F04F]">autopilot.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-white/85">
              Sign in with the Google account that has your Analytics and Search Console. Connect your website, and a
              short checklist walks you through the rest.
            </p>
          </div>

          <div className="mx-auto max-w-md rounded-3xl bg-white p-7 text-center text-[#0B1F12] shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
            {error && <p className="mb-4 rounded-lg bg-dash-down/5 p-3 text-sm text-dash-down">{error}</p>}
            {unreachable ? (
              <div className="space-y-3" role="alert">
                <p className="text-sm">Couldn&apos;t reach DashPatrol. Check your connection and try again.</p>
                <button
                  onClick={() => setAttempt((n) => n + 1)}
                  className="rounded-xl bg-[#0F6B2F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#06341A]"
                >
                  Try again
                </button>
              </div>
            ) : available === null ? (
              <div className="h-11" />
            ) : available ? (
              <>
                <p className="mb-4 text-xl font-bold tracking-[-0.02em]">Start free in one click</p>
                <ConnectButton label="Sign in with Google" />
                <p className="mt-4 text-xs text-[#5B6B60]">
                  Free during early access. No credit card. DashPatrol reads your Analytics and Search Console. It only
                  changes something in your Google account when you ask it to, like Set it up for me (which adds your site
                  and creates an Analytics property).
                </p>
              </>
            ) : (
              <div className="space-y-4 text-left text-sm">
                <p className="font-semibold">First time setup for the platform owner</p>
                <SetupSteps canSaveClient />
                <GoogleClientForm onSaved={() => window.location.reload()} />
              </div>
            )}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-white/15 bg-white/[0.07] p-5">
                <Icon className="mb-3 h-6 w-6 text-[#A6F04F]" />
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-white/80">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-white/70">
            <a target="_top" href={`${site}/privacy-policy.html`} className="text-white/85 hover:underline">Privacy policy</a> ·{" "}
            <a target="_top" href={`${site}/terms-of-service.html`} className="text-white/85 hover:underline">Terms of use</a> ·{" "}
            <a target="_top" href={`${site}/`} className="text-white/85 hover:underline">DashPatrol home</a>
          </p>
        </div>
      </div>
    </div>
  );
}
