import CategoryDetailPage, { CategoryHero } from "../../components/CategoryDetailPage";

const hero: CategoryHero = {
  eyebrow: "Curated releases",
  title: "Gallery-ready canvases & sculptural statements",
  subtitle:
    "Every lot is museum packed, provenance checked, and concierge-ready for global delivery windows.",
  highlight: "Private collectors pre-qualified · white-glove escrow on close",
  statLabel: "Highest active bid",
  statValue: "$18K",
  statDetail: "Classic oil reserve met",
  actions: [],
};

const metrics = [
  { label: "Lots live", value: "64", detail: "+9 this week" },
  { label: "Avg. uplift", value: "14%", detail: "post-sale comps" },
  { label: "Reserve hit rate", value: "91%", detail: "last 30 days" },
  { label: "Global bidders", value: "38", detail: "+6 new studios" },
];

const insights = [
  {
    label: "Bronze commissions",
    detail: "Tier-one foundries clearing 8% above guidance as museums restock.",
    trend: "+8% spread",
  },
  {
    label: "Street editions",
    detail: "Signed mural fragments moving fastest with concierge-delivered framing.",
    trend: "4.5h turnover",
  },
  {
    label: "Gallery consignors",
    detail: "New Paris partnership added 11 blue-chip canvases to the board today.",
    trend: "+11 new lots",
  },
];

const timeline = [
  {
    label: "Private studio preview",
    detail: "Virtual walkthrough for top 12 bidders",
    eta: "Tonight · 19:00",
  },
  {
    label: "Condition dossiers",
    detail: "Restoration reports pushed to watchlists",
    eta: "In 2h",
  },
  {
    label: "Logistics hold",
    detail: "European freight window closes",
    eta: "Tomorrow",
  },
];

const items: any[] = [];

export default function ArtAuction() {
  return (
    <CategoryDetailPage
      categoryKey="art"
      hero={hero}
      metrics={metrics}
      insights={insights}
      timeline={timeline}
      items={items}
    />
  );
}
