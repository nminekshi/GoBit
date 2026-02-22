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
  actions: [],
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

const items: any[] = [];

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
