import CategoryDetailPage from "../../components/CategoryDetailPage";

const hero = {
  eyebrow: "Performance & fleet",
  title: "EVs, SUVs, and collectible builds vetted for instant deployment",
  subtitle:
    "Battery health, service history, and telemetry logs ship with every vehicle so you can deploy to drivers or collectors the same week.",
  highlight: "Title-in-hand + transport scheduling included",
  statLabel: "Avg. recon cost",
  statValue: "$1.8K",
  statDetail: "based on last 20 closings",
  actions: [
    { label: "Schedule inspection", href: "/inquiry-form" },
    { label: "Open fleet desk", href: "/admin/dashboard", variant: "secondary" },
  ],
};

const metrics = [
  { label: "Lots live", value: "58", detail: "fleet + collector" },
  { label: "Avg. savings", value: "22%", detail: "vs dealer retail" },
  { label: "Logistics lead", value: "72h", detail: "door-to-door" },
  { label: "Buyers active", value: "140", detail: "pre-approved" },
];

const insights = [
  {
    label: "EV premiums",
    detail: "Tesla dual-motor builds sell fastest when Supercharger credits transfer.",
    trend: "+9% value",
  },
  {
    label: "SUV demand",
    detail: "Luxury SUVs with verified maintenance see sub 5h turnover.",
    trend: "4.7h turnover",
  },
  {
    label: "Performance coupes",
    detail: "Mustang consignors approving bids 6% above reserve this week.",
    trend: "+6% lift",
  },
];

const timeline = [
  { label: "Inspection queue", detail: "Third-party reports uploading", eta: "In 1h" },
  { label: "Carrier cutoff", detail: "West-coast enclosed transport", eta: "Tonight" },
  { label: "VIN audit", detail: "Fleet lot compliance sweep", eta: "Tomorrow" },
];

const items = [
  {
    name: "Tesla Model S",
    img: "/images/Tesla Model S.png",
    currentBid: 55000,
    endsIn: "6h 20m",
    watchers: 64,
    condition: "Dual motor · 34k mi",
  },
  {
    name: "BMW X5",
    img: "/images/BMW X5 .png",
    currentBid: 42000,
    endsIn: "5h 10m",
    watchers: 41,
    condition: "M Sport · full history",
  },
  {
    name: "Audi Q7",
    img: "/images/Audi Q7.png",
    currentBid: 39000,
    endsIn: "7h 30m",
    watchers: 35,
    condition: "Prestige trim",
  },
  {
    name: "Mercedes-Benz C-Class",
    img: "/images/Mercedes-Benz C-Class.png",
    currentBid: 37000,
    endsIn: "8h 15m",
    watchers: 29,
    condition: "AMG package",
  },
  {
    name: "Toyota Land Cruiser",
    img: "/images/Toyota Land Cruiser.png",
    currentBid: 32000,
    endsIn: "9h 5m",
    watchers: 33,
    condition: "Heritage edition",
  },
  {
    name: "Ford Mustang",
    img: "/images/Ford Mustang.png",
    currentBid: 28000,
    endsIn: "10h 40m",
    watchers: 47,
    condition: "GT performance",
  },
  {
    name: "Tesla Model S Performance",
    img: "/images/Tesla Model S.png",
    currentBid: 61000,
    endsIn: "7h 15m",
    watchers: 52,
    condition: "Plaid · 21k mi",
  },
  {
    name: "BMW X5 Executive Fleet",
    img: "/images/BMW X5 .png",
    currentBid: 44500,
    endsIn: "6h 5m",
    watchers: 37,
    condition: "xDrive50e · 3-unit release",
  },
  {
    name: "Audi Q7 Technik Series",
    img: "/images/Audi Q7.png",
    currentBid: 40200,
    endsIn: "8h 55m",
    watchers: 32,
    condition: "Adaptive air suspension",
  },
];

export default function VehiclesAuction() {
  return (
    <CategoryDetailPage
      categoryKey="vehicles"
      hero={hero}
      metrics={metrics}
      insights={insights}
      timeline={timeline}
      items={items}
    />
  );
}
