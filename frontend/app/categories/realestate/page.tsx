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
  actions: [
    { label: "Book diligence call", href: "/inquiry-form" },
    { label: "Download sample PSA", href: "/company-profile", variant: "secondary" },
  ],
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

const items = [
  {
    name: "Downtown Apartment",
    img: "/images/Downtown Apartment.png",
    currentBid: 320000,
    endsIn: "12h 0m",
    watchers: 18,
    condition: "2BR loft · NOI $62k",
  },
  {
    name: "Beach House",
    img: "/images/Beach House.png",
    currentBid: 750000,
    endsIn: "8h 30m",
    watchers: 24,
    condition: "5BR · turnkey STR",
  },
  {
    name: "Luxury Penthouse",
    img: "/images/Luxury Penthouse.png",
    currentBid: 1200000,
    endsIn: "15h 20m",
    watchers: 31,
    condition: "Skyline view · capex complete",
  },
  {
    name: "Country Villa",
    img: "/images/Country Villa.png",
    currentBid: 540000,
    endsIn: "11h 10m",
    watchers: 16,
    condition: "Organic vineyard tie-in",
  },
  {
    name: "City Loft",
    img: "/images/City Loft.png",
    currentBid: 410000,
    endsIn: "13h 45m",
    watchers: 19,
    condition: "Converted warehouse",
  },
  {
    name: "Mountain Cabin",
    img: "/images/Mountain Cabin.png",
    currentBid: 290000,
    endsIn: "14h 55m",
    watchers: 22,
    condition: "Dual revenue (ski + summer)",
  },
  {
    name: "Harborfront Loft Stack",
    img: "/images/Downtown Apartment.png",
    currentBid: 360000,
    endsIn: "9h 20m",
    watchers: 21,
    condition: "4-unit micro living",
  },
  {
    name: "Lakeside Villa Cluster",
    img: "/images/Beach House.png",
    currentBid: 820000,
    endsIn: "10h 35m",
    watchers: 27,
    condition: "STR licenses grandfathered",
  },
  {
    name: "Skyline Hospitality Floors",
    img: "/images/Luxury Penthouse.png",
    currentBid: 1340000,
    endsIn: "16h 25m",
    watchers: 34,
    condition: "Boutique hotel conversion",
  },
];

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
