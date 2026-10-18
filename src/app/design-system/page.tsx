import { BackgroundArt } from "@/components/background-art";

export const metadata = { title: "TripWise | Design system preview" };

export default function DesignSystemPreview() {
  return <div className="py-8 space-y-8">
    <section className="retro-art-host min-h-[650px] px-5 py-8 sm:px-10">
      <BackgroundArt />
      <div className="retro-art-content max-w-2xl">
        <p className="retro-label">TripWise · Design system / 01</p>
        <h1 className="mb-6 text-4xl sm:text-6xl">Where to next?</h1>
        <div className="retro-stripes" aria-hidden="true"><span /><span /><span /></div>
        <p className="max-w-md text-lg leading-7">Cream paper, classic type and a little adventure. Original template artwork, at its original speed.</p>
      </div>
    </section>
    <section aria-label="Palette" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        ["Paper", "bg-paper", "#F6EAD0"], ["Card", "bg-card", "#FFFBF2"],
        ["Navy", "bg-navy text-card", "#1B3A5C"], ["Orange", "bg-orange", "#E8702A"],
        ["Teal", "bg-teal", "#2A9D8F"], ["Earth", "bg-earth text-card", "#A4622B"],
        ["Stamp", "bg-stamp text-card", "#C4472B"],
      ].map(([label, color, hex]) => <div key={label} className={`rounded-md border border-border p-4 ${color}`}><p className="font-mono text-sm">{label}<br />{hex}</p></div>)}
    </section>
    <section className="retro-card" aria-label="Style samples">
      <h2 className="mb-4 text-3xl">A ticket to somewhere new</h2>
      <p className="mb-5 leading-7">Georgia for stories and headings. Courier New for small labels, navigation, actions and badges. Hover or press this card to see the hard shadow move.</p>
      <div className="mb-6 flex flex-wrap gap-3">
        <button type="button" className="retro-button">Main action</button>
        <button type="button" className="retro-button retro-button-secondary">Secondary</button>
        <button type="button" className="retro-button retro-button-neutral">Neutral</button>
        <button type="button" className="retro-button retro-button-danger">Remove</button>
        <button type="button" disabled className="retro-button">Disabled</button>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <label className="retro-label">Destination<input className="retro-input mt-2" placeholder="Kyoto, Lisbon…" /></label>
        <label className="retro-label">Travel style<select className="retro-dropdown mt-2" defaultValue="discovery"><option value="discovery">Discovery</option><option value="slow">Take it slow</option></select></label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="retro-label mb-0">Chips & badges</span>
        <button type="button" className="retro-chip">Beaches</button>
        <button type="button" className="retro-chip" aria-pressed="true">Temples</button>
        <span className="retro-badge">✦ Sights</span>
      </div>
    </section>
    <section aria-label="Semantic theme" className="rounded-lg border border-border bg-card p-6 text-card-foreground">
      <p className="mb-3 font-mono text-sm">Tailwind + shadcn semantic tokens</p>
      <div className="flex flex-wrap gap-3">
        <span className="rounded-md bg-primary px-4 py-3 text-primary-foreground">Primary</span>
        <span className="rounded-md bg-secondary px-4 py-3 text-secondary-foreground">Secondary</span>
        <span className="rounded-md bg-destructive px-4 py-3 text-destructive-foreground">Danger</span>
      </div>
    </section>
  </div>;
}
