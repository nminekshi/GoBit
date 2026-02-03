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
  actions: [
    { label: "Request curator set", href: "/inquiry-form" },
    { label: "Preview upcoming fair", href: "/explore-auctions", variant: "secondary" },
  ],
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

const items = [
  {
    name: "Abstract Painting",
    img: "/images/Abstract Painting.png",
    currentBid: 12000,
    endsIn: "7h 40m",
    watchers: 42,
    condition: "Acrylic on canvas · signed verso",
    description: "New Listing"
  },
  {
    name: "Sculpture",
    img: "/images/Sculpture.png",
    currentBid: 9000,
    endsIn: "9h 15m",
    watchers: 31,
    condition: "Carrara marble · edition 2/8",
    description: "Gallery Exclusive"
  },
  {
    name: "Modern Art Canvas",
    img: "/images/Modern Art Canvas.png",
    currentBid: 15000,
    endsIn: "8h 20m",
    watchers: 55,
    condition: "Mixed media diptych",
    description: "Trending"
  },
  {
    name: "Classic Oil Painting",
    img: "/images/Classic Oil Painting.png",
    currentBid: 18000,
    endsIn: "10h 10m",
    watchers: 63,
    condition: "Restored 1874 salon work",
    description: "Rare Find"
  },
  {
    name: "Bronze Statue",
    img: "/images/Bronze Statue.png",
    currentBid: 7000,
    endsIn: "11h 30m",
    watchers: 24,
    condition: "Lost-wax bronze, artist proof",
    description: "New Listing"
  },
  {
    name: "Street Art Mural",
    img: "/images/Street Art Mural.png",
    currentBid: 5000,
    endsIn: "12h 50m",
    watchers: 47,
    condition: "Panel-mounted aerosol",
    description: "Urban Collection"
  },
  {
    name: "Immersive Light Installation",
    img: "/images/Modern Art Canvas.png",
    currentBid: 13200,
    endsIn: "6h 25m",
    watchers: 38,
    condition: "Projected neon field",
    description: "Installation"
  },
  {
    name: "Gallery Sculpture Series",
    img: "/images/Sculpture.png",
    currentBid: 10400,
    endsIn: "9h 55m",
    watchers: 29,
    condition: "Polished steel trio",
    description: "Set of 3"
  },
  {
    name: "Urban Fresco Diptych",
    img: "/images/Street Art Mural.png",
    currentBid: 8800,
    endsIn: "7h 5m",
    watchers: 33,
    condition: "Archival lacquer finish",
    description: "New Listing"
  },
];

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
