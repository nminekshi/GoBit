import CategoryDetailPage from "../../components/CategoryDetailPage";

const hero = {
  eyebrow: "Institutional real estate",
  title: "Income-producing assets with instant underwriting",
  subtitle:
    "Hospitality, multifamily, and luxury residential lots ship with live rent rolls, drone scans, and diligence vaults.",
  highlight: "Title, insurance, and escrow partners on standby",
  statLabel: "Cap rate ceiling",
  statValue: "12.1%",
  statDetail: "Mountain cabin micro-fund",
  actions: [],
};

const metrics = [
  { label: "Assets live", value: "32", detail: "+4 boutique hotels" },
  { label: "Avg. discount", value: "11%", detail: "vs broker guide" },
  { label: "Verified buyers", value: "260", detail: "family offices" },
  { label: "Due diligence kits", value: "29", detail: "shared this week" },
];

const insights = [
  {
    label: "Beach markets",
    detail: "Coastal rentals locking 20% higher occupancy guarantees.",
    trend: "+20% ADR",
  },
  {
    label: "Urban infill",
    detail: "Downtown loft conversions closing inside 9 days post-bid.",
    trend: "9-day close",
  },
  {
    label: "Cabin funds",
    detail: "Fractional cabin syndicates oversubscribed 1.4x.",
    trend: "+1.4x demand",
  },
];

const timeline = [
  { label: "Legal packet refresh", detail: "Updated PSAs + estoppels", eta: "Today" },
  { label: "Site visits", detail: "Mountain + villa tours streaming", eta: "Tomorrow 10:00" },
  { label: "Wire cutoff", detail: "Escrow prefunding window", eta: "Friday" },
];

const items: any[] = [];

export default function RealEstateAuction() {
  return (
    <CategoryDetailPage
      categoryKey="realestate"
      hero={hero}
      metrics={metrics}
      insights={insights}
      timeline={timeline}
      items={items}
    />
  );
}
