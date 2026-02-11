import CategoryDetailPage, { type CategoryHero } from "../../components/CategoryDetailPage";

const hero: CategoryHero = {
  eyebrow: "High-demand tech",
  title: "Consumer electronics that move in hours",
  subtitle:
    "Phones, wearables, pro audio, and flagship TVs sourced from verified retailers and production houses.",
  highlight: "IMEI + serials logged · warranty transfer ready",
  statLabel: "Median hammer",
  statValue: "$1.2K",
  statDetail: "Premium phones this cycle",
  actions: [],
};

const metrics = [
  { label: "Active lots", value: "96", detail: "+14 new today" },
  { label: "Avg. savings", value: "33%", detail: "retail delta" },
  { label: "Warranty transfers", value: "87%", detail: "eligible units" },
  { label: "Watchlists", value: "212", detail: "subscribed buyers" },
];

const insights = [
  {
    label: "Flagship phones",
    detail: "Titanium finishes clearing 5% over reserve when paired with AppleCare.",
    trend: "+5% premium",
  },
  {
    label: "Home cinema",
    detail: "QLED bundles shipping with concierge calibration vouchers.",
    trend: "Same-day installs",
  },
  {
    label: "Content kits",
    detail: "Mirrorless kits + gimbals seeing 11% uptick from creators.",
    trend: "+11% demand",
  },
];

const timeline = [
  { label: "Certification batch", detail: "New IMEI audits uploading", eta: "In 45m" },
  { label: "Warehouse cutoff", detail: "Express shipping label window", eta: "20:00" },
  { label: "Accessory drop", detail: "Studio audio peripherals", eta: "Tomorrow" },
];

const items: any[] = [];

export default function ElectronicsAuction() {
  return (
    <CategoryDetailPage
      categoryKey="electronics"
      hero={hero}
      metrics={metrics}
      insights={insights}
      timeline={timeline}
      items={items}
    />
  );
}
