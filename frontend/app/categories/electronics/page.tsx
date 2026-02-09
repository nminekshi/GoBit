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

const items = [
  {
    name: "iPhone 15 Pro Max",
    img: "/images/15 pro max.png",
    currentBid: 1200,
    endsIn: "2h 30m",
    watchers: 78,
    condition: "256GB · sealed",
    description: "Smartphone"
  },
  {
    name: "Samsung QLED TV",
    img: "/images/Samsung QLED TV.png",
    currentBid: 800,
    endsIn: "1h 10m",
    watchers: 33,
    condition: "65\" flagship with stand",
    description: "New Listing"
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    img: "/images/Sony WH-1000XM5 Headphones.png",
    currentBid: 250,
    endsIn: "3h 5m",
    watchers: 45,
    condition: "Midnight · open-box",
    description: "Audio"
  },
  {
    name: "GoPro Hero 12",
    img: "/images/GoPro Hero 12.png",
    currentBid: 350,
    endsIn: "4h 20m",
    watchers: 29,
    condition: "Adventure bundle",
    description: "Action Camera"
  },
  {
    name: "iPad Pro 12.9",
    img: "/images/iPad Pro 12.9.png",
    currentBid: 900,
    endsIn: "2h 50m",
    watchers: 51,
    condition: "M4 · Pencil Pro",
    description: "Tablet"
  },
  {
    name: "Canon EOS R7 Camera",
    img: "/images/Canon EOS R7 Camera.png",
    currentBid: 1400,
    endsIn: "5h 15m",
    watchers: 37,
    condition: "Dual lens kit",
    description: "Photography"
  },
  {
    name: "Apple Watch Ultra Bundle",
    img: "/images/Apple Watch Ultra.png",
    currentBid: 780,
    endsIn: "1h 35m",
    watchers: 44,
    condition: "Trail Loop + AppleCare",
    description: "Wearable"
  },
  {
    name: "Bose Studio Soundbar 900",
    img: "/images/Samsung QLED TV.png",
    currentBid: 420,
    endsIn: "3h 40m",
    watchers: 26,
    condition: "Dolby Atmos kit",
    description: "Home Audio"
  },
  {
    name: "Canon Creator Combo",
    img: "/images/Canon EOS R7 Camera.png",
    currentBid: 1650,
    endsIn: "6h 5m",
    watchers: 31,
    condition: "R7 + gimbal + mics",
    description: "Pro Kit"
  },
];

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
