import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, Users2, Phone, CalendarClock, GitMerge, Archive, Plus, Settings, HelpCircle,
  Search, LayoutGrid, Bell, ChevronDown, ArrowDownUp, CheckSquare, Upload, List, Building2,
  Copy, Clock, Sparkles, X, Pencil, MessageSquare, PhoneCall, UserPlus, ChevronLeft, ChevronRight,
} from "lucide-react";
import { RouteError } from "@/components/route-error";

/**
 * PREVIEW ONLY — /dev/leads
 *
 * A faithful build of the Google Stitch "Leads" mockup, mapped onto the REAL
 * lead data model. Deliberately unauthenticated and driven by mock rows so it
 * can be opened on localhost without a login; it touches nothing in the live
 * Leads section.
 *
 * Where this differs from the Stitch export, and why:
 *  - Stitch's mockup is a medical-rep CRM (doctors, hospitals, "Specialty",
 *    "Schedule Visit"). None of those fields exist here. Mapped to the real
 *    schema: contact name, firm, stage, temperature, product interest, the
 *    follow-up slots, and the real actions (Log a call / Convert to Party).
 *  - Icons are Lucide, not Material Symbols — same glyph shapes, and it avoids
 *    loading a second icon font alongside the app's existing set.
 *  - Colours/shadows/type are the shared Stitch tokens (`--st-*`, `.pill`,
 *    `.glass`, `.chip`, `t-*`, `sh-*`) defined once in src/styles.css under
 *    the `.stitch` scope class — this page only adds the `stitch` class.
 */
export const Route = createFileRoute("/dev/leads")({
  errorComponent: RouteError,
  head: () => ({ meta: [{ title: "Leads preview — Cerebyl" }] }),
  component: LeadsPreview,
});

// ---- Mock rows shaped like real leads -----------------------------------
type MockLead = {
  code: string; name: string; firm: string; stage: string;
  temp: "Hot" | "Warm" | "Cold"; interest: string;
  nextFu: string; meta: string; metaTone: "alert" | "muted" | "info";
  dup?: boolean; phone: string; summary: string; summaryDate: string;
};

const LEADS: MockLead[] = [
  {
    code: "L-8492", name: "Rajesh Kumar", firm: "Shree Balaji Distributors",
    stage: "Interested", temp: "Hot", interest: "PCD Franchise",
    nextFu: "Oct 12", meta: "14d uncontacted", metaTone: "alert", dup: true,
    phone: "9876543210",
    summary: "Asked for the full cardiac range rate list and monopoly terms for Indore district. Wants a 45-day credit period — needs manager approval.",
    summaryDate: "Oct 02",
  },
  {
    code: "L-8493", name: "Amit Kulkarni", firm: "MediCare Distributors",
    stage: "Contacted", temp: "Warm", interest: "Third Party",
    nextFu: "Oct 15", meta: "2d ago", metaTone: "muted",
    phone: "9812223344",
    summary: "Shared the derma catalogue over WhatsApp. Will revert after checking with his partner.",
    summaryDate: "Oct 08",
  },
  {
    code: "L-8494", name: "Sneha Bhat", firm: "Bhat Meds",
    stage: "New", temp: "Cold", interest: "Generic Range",
    nextFu: "Unscheduled", meta: "Just added", metaTone: "info",
    phone: "9765001234",
    summary: "Inbound enquiry from IndiaMart. Not yet contacted.",
    summaryDate: "Oct 10",
  },
];

const TEMP_STYLE: Record<MockLead["temp"], { bg: string; fg: string; dot: string; pulse: boolean }> = {
  Hot:  { bg: "var(--st-error-container)",        fg: "var(--st-on-error-container)",   dot: "var(--st-error)",     pulse: true },
  Warm: { bg: "var(--st-secondary-container)",    fg: "var(--st-on-secondary-container)", dot: "var(--st-secondary)", pulse: false },
  Cold: { bg: "var(--st-surface-container-high)", fg: "var(--st-on-surface-variant)",   dot: "var(--st-outline)",   pulse: false },
};

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Users2, label: "All Leads", active: true },
  { icon: Phone, label: "Call List" },
  { icon: CalendarClock, label: "Follow-ups" },
  { icon: GitMerge, label: "Duplicates" },
  { icon: Archive, label: "Lead Intake" },
];

function LeadsPreview() {
  const [selected, setSelected] = useState<MockLead | null>(LEADS[0]);
  const [lens, setLens] = useState("All Leads");

  return (
    <div className="stitch relative flex h-screen overflow-hidden bg-[color:var(--st-background)] p-4">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="blob -left-[20%] -top-[20%] h-[80vw] w-[80vw] bg-[color:var(--st-primary)]/30 blur-[120px]" />
        <div className="blob bottom-[-10%] right-[-10%] h-[70vw] w-[70vw] bg-[color:var(--st-primary-fixed-dim)]/40 blur-[100px]" />
        <div className="blob left-[20%] top-[30%] h-[50vw] w-[50vw] bg-[color:var(--st-secondary-container)]/30 blur-[150px]" />
      </div>

      <div className="glass sh-lg relative z-10 flex h-full w-full flex-1 overflow-hidden rounded-3xl">
        {/* ---- Sidebar ---- */}
        <aside className="z-20 flex w-72 flex-col bg-transparent pt-6">
          <div className="mb-8 flex flex-col items-start gap-4 px-6">
            <h2 className="t-head-sm font-medium text-[color:var(--st-primary)]">Cerebyl CRM</h2>
            <p className="t-label text-[color:var(--st-on-surface-variant)]">Pharma Intelligence</p>
          </div>
          <nav className="relative flex flex-1 flex-col gap-2">
            {NAV.map(({ icon: Icon, label, active }) => (
              <a
                key={label}
                href="#"
                onClick={(e) => e.preventDefault()}
                className={
                  active
                    ? "t-body-md relative z-10 ml-4 flex items-center gap-3 rounded-l-3xl bg-white/70 px-6 py-3 font-medium text-[color:var(--st-primary)]"
                    : "t-body-md mx-4 flex items-center gap-3 rounded-full px-6 py-3 text-[color:var(--st-on-surface-variant)] transition-colors hover:text-[color:var(--st-primary)]"
                }
              >
                <Icon className="h-[18px] w-[18px]" /> {label}
              </a>
            ))}
          </nav>
          <div className="mb-8 px-6">
            <button className="pill sh-md w-full justify-center">
              <Plus className="h-[18px] w-[18px]" /> New Inquiry
            </button>
          </div>
          <div className="mt-auto flex flex-col gap-2 border-t border-[color:var(--st-surface-variant)]/30 px-6 pb-6 pt-4">
            {[{ icon: Settings, label: "Settings" }, { icon: HelpCircle, label: "Help" }].map(({ icon: Icon, label }) => (
              <a key={label} href="#" onClick={(e) => e.preventDefault()}
                 className="t-body-md flex items-center gap-3 rounded-full px-4 py-2 text-[color:var(--st-on-surface-variant)] transition-colors hover:text-[color:var(--st-primary)]">
                <Icon className="h-[18px] w-[18px]" /> {label}
              </a>
            ))}
          </div>
        </aside>

        {/* ---- Main ---- */}
        <main className="relative z-10 flex h-full flex-1 flex-col rounded-l-3xl bg-white/70 shadow-[inset_4px_0_12px_rgba(0,0,0,0.02)]">
          {/* Top bar */}
          <header className="flex h-20 shrink-0 items-center justify-between border-b border-white/50 px-4">
            <div className="flex items-center gap-6">
              <span className="t-head-sm font-medium tracking-tight">Cerebyl</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[color:var(--st-on-surface-variant)]" />
                <input
                  className="t-body-sm sh-sm w-64 rounded-full border-0 bg-white py-2.5 pl-11 pr-4 text-[color:var(--st-on-surface)] placeholder:text-[color:var(--st-on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[color:var(--st-primary)]"
                  placeholder="Search name, firm, phone, city…"
                />
              </div>
              <button className="sh-sm rounded-full bg-white/50 p-2.5 text-[color:var(--st-on-surface-variant)] transition-all hover:bg-white hover:text-[color:var(--st-primary)]">
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button className="sh-sm rounded-full bg-white/50 p-2.5 text-[color:var(--st-on-surface-variant)] transition-all hover:bg-white hover:text-[color:var(--st-primary)]">
                <Bell className="h-5 w-5" />
              </button>
              <div className="sh-sm ml-2 grid h-10 w-10 place-items-center rounded-full bg-[color:var(--st-primary)] text-sm font-semibold text-white">HS</div>
            </div>
          </header>

          {/* Title + toolbar */}
          <div className="flex shrink-0 flex-col gap-6 px-6 pb-6 pt-6">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="t-head-md">Leads</h1>
                <p className="t-body-sm mt-1 text-[color:var(--st-on-surface-variant)]">124 of 1,250 leads shown</p>
              </div>
              <div className="sh-sm flex rounded-full bg-white/60 p-1.5">
                {["All Leads", "Call List", "Follow-ups", "Duplicates"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setLens(t)}
                    className={
                      lens === t
                        ? "t-data sh-sm rounded-full bg-white px-6 py-2 font-medium text-[color:var(--st-on-surface)]"
                        : "t-data rounded-full px-6 py-2 text-[color:var(--st-on-surface-variant)] transition-colors hover:text-[color:var(--st-on-surface)]"
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {["Stage", "Temp", "Rep"].map((f) => (
                  <button key={f} className="pill sh-md">
                    {f} <ChevronDown className="h-4 w-4" />
                  </button>
                ))}
                <div className="mx-2 h-6 w-px bg-[color:var(--st-outline-variant)]/30" />
                <button className="pill sh-md">
                  <ArrowDownUp className="h-4 w-4" /> Newly added
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="sh-sm flex items-center gap-1 rounded-full bg-white p-1">
                  <button className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--st-surface-container-low)] text-[color:var(--st-primary)] shadow-inner">
                    <LayoutGrid className="h-[18px] w-[18px]" />
                  </button>
                  <button className="grid h-8 w-8 place-items-center rounded-full text-[color:var(--st-on-surface-variant)] transition-colors hover:bg-[color:var(--st-surface-variant)]/50">
                    <List className="h-[18px] w-[18px]" />
                  </button>
                </div>
                <button className="pill sh-md"><CheckSquare className="h-4 w-4" /> Select</button>
                <button className="pill sh-md"><Upload className="h-4 w-4" /> Import</button>
                <button className="pill sh-md"><Plus className="h-4 w-4" /> Add Lead</button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative flex flex-1 gap-8 overflow-hidden px-6 pb-6">
            <div className="flex-1 overflow-y-auto pr-2">
              <div className={`grid grid-cols-1 items-start gap-6 ${selected ? "xl:grid-cols-2" : "lg:grid-cols-2 xl:grid-cols-3"}`}>
                {LEADS.map((l) => (
                  <LeadCard key={l.code} lead={l} active={selected?.code === l.code} onClick={() => setSelected(l)} />
                ))}
              </div>
            </div>

            {selected && <PeekDrawer lead={selected} onClose={() => setSelected(null)} />}
          </div>

          {/* Pagination */}
          <div className="z-20 flex shrink-0 items-center justify-between border-t border-white/50 px-6 py-4">
            <div className="flex items-center gap-4">
              <span className="t-body-sm font-medium text-[color:var(--st-on-surface-variant)]">Rows per page:</span>
              <select className="t-data sh-sm rounded-full border-0 bg-white py-2 pl-4 pr-8 focus:ring-2 focus:ring-[color:var(--st-primary)]">
                <option>25</option><option>50</option><option>100</option>
              </select>
            </div>
            <div className="sh-sm flex items-center gap-4 rounded-full bg-white px-5 py-2">
              <span className="t-body-sm font-medium text-[color:var(--st-on-surface-variant)]">1-25 of 124</span>
              <div className="ml-2 flex gap-2">
                <button disabled className="cursor-not-allowed rounded-full bg-[color:var(--st-surface-container-low)] p-1 text-[color:var(--st-outline)]">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="rounded-full border border-[color:var(--st-surface-variant)]/30 bg-white p-1 shadow-sm transition-colors hover:bg-[color:var(--st-primary)]/10 hover:text-[color:var(--st-primary)]">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function LeadCard({ lead, active, onClick }: { lead: MockLead; active: boolean; onClick: () => void }) {
  const t = TEMP_STYLE[lead.temp];
  const metaStyle =
    lead.metaTone === "alert"
      ? { color: "var(--st-error)", background: "color-mix(in oklab, var(--st-error) 10%, transparent)" }
      : lead.metaTone === "info"
        ? { color: "var(--st-primary)", background: "color-mix(in oklab, var(--st-primary) 10%, transparent)" }
        : { color: "var(--st-on-surface-variant)", background: "var(--st-surface-container-low)" };

  return (
    <div
      onClick={onClick}
      className={`sh-md group relative flex cursor-pointer flex-col gap-6 overflow-hidden rounded-3xl border border-white p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] ${active ? "bg-white/80" : "bg-white/60"}`}
    >
      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="flex shrink-0 items-center gap-2">
          <span className="t-data chip sh-sm rounded-full bg-[color:var(--st-surface-container-low)] px-3 py-1 text-[10px] text-[color:var(--st-on-surface-variant)]">
            {lead.code}
          </span>
          {lead.dup && <Copy className="h-4 w-4 shrink-0 text-[color:var(--st-error)]" aria-label="Duplicate flag" />}
        </div>
        <span
          className="t-label chip sh-sm flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px]"
          style={{ background: t.bg, color: t.fg }}
        >
          <span className={`h-2 w-2 rounded-full ${t.pulse ? "animate-pulse" : ""}`} style={{ background: t.dot }} />
          {lead.temp.toUpperCase()}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="t-head-sm text-xl">{lead.name}</h3>
        <p className="t-body-sm mt-2 flex items-center gap-1.5 text-[color:var(--st-on-surface-variant)]">
          <Building2 className="h-4 w-4" /> {lead.firm}
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-2">
        <span className="t-label rounded-full border border-[color:var(--st-primary)]/20 bg-[color:var(--st-primary)]/5 px-3 py-1.5 text-[10px] text-[color:var(--st-primary)]">
          {lead.stage}
        </span>
        <span className="t-label sh-sm rounded-full bg-[color:var(--st-surface-container-low)] px-3 py-1.5 text-[10px] text-[color:var(--st-on-surface-variant)]">
          {lead.interest}
        </span>
      </div>

      <div className="relative z-10 mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[color:var(--st-surface-variant)]/30 pt-4 text-[12px] text-[color:var(--st-on-surface-variant)]">
        <div className="chip sh-sm flex items-center gap-1.5 rounded-full bg-[color:var(--st-surface-container-low)] px-3 py-1.5">
          <CalendarClock className="h-3.5 w-3.5 shrink-0" /> {lead.nextFu}
        </div>
        <div className="chip sh-sm flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium" style={metaStyle}>
          {lead.metaTone === "alert" ? <Clock className="h-3.5 w-3.5" /> : lead.metaTone === "info" ? <Sparkles className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
          {lead.meta}
        </div>
      </div>
    </div>
  );
}

function PeekDrawer({ lead, onClose }: { lead: MockLead; onClose: () => void }) {
  const t = TEMP_STYLE[lead.temp];
  const initials = lead.name.split(" ").map((w) => w[0]).slice(0, 2).join("");

  return (
    <aside className="sh-lg relative z-10 flex h-full w-[420px] shrink-0 flex-col overflow-hidden rounded-3xl border border-white bg-white/90 backdrop-blur-2xl">
      <div className="flex items-center justify-between px-6 py-5">
        <span className="t-data sh-sm rounded-full border border-white bg-[color:var(--st-surface-container-low)] px-3 py-1 text-[11px] text-[color:var(--st-on-surface-variant)]">
          {lead.code}
        </span>
        <button onClick={onClose} className="sh-sm rounded-full bg-white p-2 text-[color:var(--st-on-surface-variant)] transition-all hover:text-[color:var(--st-on-surface)]">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6">
        {/* Identity */}
        <div className="relative flex flex-col items-center border-b border-[color:var(--st-surface-variant)]/30 pb-6 text-center">
          <div className="sh-md relative z-10 mb-4 grid h-24 w-24 place-items-center rounded-full border-4 border-white bg-[color:var(--st-primary)] text-2xl font-semibold text-white">
            {initials}
          </div>
          <h2 className="t-head-sm text-2xl">{lead.name}</h2>
          <p className="t-body-md mt-2 flex items-center justify-center gap-1.5 text-[color:var(--st-on-surface-variant)]">
            <Building2 className="h-4 w-4" /> {lead.firm}
          </p>
          <div className="mt-6 flex w-full justify-center gap-3">
            <a href={`tel:${lead.phone}`} className="pill sh-btn flex-1 justify-center py-3">
              <PhoneCall className="h-[18px] w-[18px]" /> Call
            </a>
            <a href={`https://wa.me/91${lead.phone}`} target="_blank" rel="noreferrer" className="pill sh-btn flex-1 justify-center py-3">
              <MessageSquare className="h-[18px] w-[18px]" /> WhatsApp
            </a>
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="t-label ml-1 text-[10px] text-[color:var(--st-on-surface-variant)]">Stage</label>
            <div className="flex cursor-pointer items-center gap-2 rounded-full border border-[color:var(--st-surface-variant)]/30 bg-white px-4 py-2.5 shadow-sm transition-all hover:shadow-md">
              <span className="t-data text-sm">{lead.stage}</span>
              <Pencil className="ml-auto h-3.5 w-3.5 text-[color:var(--st-primary)]" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="t-label ml-1 text-[10px] text-[color:var(--st-on-surface-variant)]">Temperature</label>
            <div className="flex cursor-pointer items-center gap-2 rounded-full border-0 px-4 py-2.5 shadow-sm" style={{ background: `color-mix(in oklab, ${t.bg} 50%, white)` }}>
              <span className={`h-2.5 w-2.5 rounded-full ${t.pulse ? "animate-pulse" : ""}`} style={{ background: t.dot }} />
              <span className="t-data text-sm font-medium" style={{ color: t.fg }}>{lead.temp.toUpperCase()}</span>
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="t-label ml-1 text-[10px] text-[color:var(--st-on-surface-variant)]">Product interest</label>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="t-body-sm rounded-full border border-[color:var(--st-surface-variant)]/30 bg-white px-4 py-2 shadow-sm text-[color:var(--st-on-surface-variant)]">{lead.interest}</span>
              <button className="t-body-sm flex items-center gap-1 rounded-full border border-dashed border-[color:var(--st-primary)]/50 px-4 py-2 text-[color:var(--st-primary)] transition-colors hover:bg-[color:var(--st-primary)]/5">
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Last interaction */}
        <div className="relative overflow-hidden rounded-3xl border border-white bg-[color:var(--st-surface-container-low)] p-5 shadow-sm">
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[color:var(--st-primary)]/10 blur-xl" />
          <div className="relative z-10 mb-3 flex items-center justify-between">
            <h4 className="t-label flex items-center gap-1.5 text-[color:var(--st-primary)]">
              <MessageSquare className="h-4 w-4" /> Last interaction
            </h4>
            <span className="t-data rounded-full border border-[color:var(--st-surface-variant)]/30 bg-white px-3 py-1 text-[11px] text-[color:var(--st-on-surface-variant)] shadow-sm">
              {lead.summaryDate}
            </span>
          </div>
          <p className="t-body-sm relative z-10 text-sm italic leading-relaxed">"{lead.summary}"</p>
          <button className="t-data relative z-10 mt-3 font-medium text-[color:var(--st-primary)] hover:underline">Read full summary</button>
        </div>
      </div>

      {/* Footer actions — the REAL lead actions */}
      <div className="mt-auto flex flex-col gap-3 bg-white/80 p-6 backdrop-blur-xl">
        <button className="pill sh-md w-full justify-center py-3">
          <PhoneCall className="h-[18px] w-[18px]" /> Log a call
        </button>
        <div className="flex gap-3">
          <button className="pill sh-md w-full justify-center py-3"><UserPlus className="h-[18px] w-[18px]" /> Convert</button>
          <button className="pill sh-md w-full justify-center py-3"><Pencil className="h-[18px] w-[18px]" /> Edit</button>
        </div>
      </div>
    </aside>
  );
}
