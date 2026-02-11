
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
  actions: [],
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

const items: any[] = [];

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
