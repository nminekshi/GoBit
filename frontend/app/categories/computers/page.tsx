
import CategoryDetailPage from "../../components/CategoryDetailPage";

const hero = {
  eyebrow: "Enterprise compute",
  title: "Flagship laptops & GPU-ready workstations",
  subtitle:
    "Sourced from enterprise refreshes with diagnostics, battery cycles, and imaging ready for redeploy.",
  highlight: "Secure wipe + bios locks cleared before shipment",
  statLabel: "Fastest turnover",
  statValue: "2.4h",
  statDetail: "Ultrabook clusters this week",
  actions: [
    { label: "Book pallet pickup", href: "/inquiry-form" },
    { label: "Compare financing", href: "/how-to-pay", variant: "secondary" },
  ],
};

const metrics = [
  { label: "Lots live", value: "72", detail: "rollover ready" },
  { label: "Avg. savings", value: "37%", detail: "vs MSRP" },
  { label: "QA pass rate", value: "99.2%", detail: "hardware burn-in" },
  { label: "Enterprise buyers", value: "54", detail: "active seats" },
];

const insights = [
  {
    label: "Developers",
    detail: "High-core laptops with 32GB RAM clearing reserves instantly.",
    trend: "+12% demand",
  },
  {
    label: "AI labs",
    detail: "ROG and Zephyrus lots see 6% premium when bundled with docking kits.",
    trend: "6% uplift",
  },
  {
    label: "Lease-backs",
    detail: "Surface fleets getting financed at sub 9% cost of capital.",
    trend: "New credit line",
  },
];

const timeline = [
  { label: "Next QA batch", detail: "60 ThinkPads finishing diagnostics", eta: "In 3h" },
  { label: "Logistics cutoff", detail: "Overnight courier pallet window", eta: "21:00" },
  { label: "Firmware push", detail: "bios unlocked + asset tags logged", eta: "Tomorrow" },
];

const items = [
  {
    name: "MacBook Pro 16''",
    img: "/images/MacBook Pro 16.png",
    currentBid: 2100,
    endsIn: "4h 5m",
    watchers: 58,
    condition: "M3 Max · 64GB RAM",
    description: "New Listing"
  },
  {
    name: "Dell XPS 13",
    img: "/images/Dell XPS 13.png",
    currentBid: 1100,
    endsIn: "2h 50m",
    watchers: 34,
    condition: "OLED · 32GB/1TB",
    description: "Ultrabook"
  },
  {
    name: "HP Spectre x360",
    img: "/images/HP Spectre x360.png",
    currentBid: 1300,
    endsIn: "3h 30m",
    watchers: 27,
    condition: "2-in-1 Creator spec",
    description: "Convertible"
  },
  {
    name: "Lenovo ThinkPad X1",
    img: "/images/Lenovo ThinkPad X1.png",
    currentBid: 1250,
    endsIn: "5h 10m",
    watchers: 41,
    condition: "Carbon Gen 11",
    description: "Business Class"
  },
  {
    name: "Microsoft Surface Pro 9",
    img: "/images/Microsoft Surface Pro 9.png",
    currentBid: 950,
    endsIn: "2h 20m",
    watchers: 30,
    condition: "5G · Keyboard bundle",
    description: "Tablet PC"
  },
  {
    name: "Asus ROG Zephyrus",
    img: "/images/Asus ROG Zephyrus.png",
    currentBid: 1800,
    endsIn: "6h 45m",
    watchers: 52,
    condition: "RTX 4090 · 240Hz",
    description: "Gaming"
  },
  {
    name: "Asus ROG Zephyrus Duo",
    img: "/images/Asus ROG Zephyrus.png",
    currentBid: 1950,
    endsIn: "4h 40m",
    watchers: 36,
    condition: "Dual-screen · creator tuned",
    description: "New Listing"
  },
  {
    name: "Dell XPS 13 Developer Batch",
    img: "/images/Dell XPS 13.png",
    currentBid: 1180,
    endsIn: "3h 15m",
    watchers: 28,
    condition: "Ubuntu imaged · 32GB",
    description: "Developer Edition"
  },
  {
    name: "Surface Mobility Pod",
    img: "/images/Microsoft Surface Pro 9.png",
    currentBid: 990,
    endsIn: "5h 55m",
    watchers: 25,
    condition: "LTE + keyboard flight cases",
    description: "Bundle"
  },
];

export default function ComputersAuction() {
  return (
    <CategoryDetailPage
      categoryKey="computers"
      hero={hero}
      metrics={metrics}
      insights={insights}
      timeline={timeline}
      items={items}
    />
  );
}
