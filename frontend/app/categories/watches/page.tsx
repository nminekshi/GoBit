import CategoryDetailPage from "../../components/CategoryDetailPage";

const hero = {
  eyebrow: "Horology desk",
  title: "Swiss icons & avant-garde timepieces in one live board",
  subtitle:
    "All lots undergo caliber verification, service card checks, and bracelet measurement before bids clear.",
  highlight: "Escrow + insured shipping to 70+ countries",
  statLabel: "Median delta",
  statValue: "$4.7K",
  statDetail: "Spread vs retail on steel sports",
  actions: [
    { label: "Book a wrist check", href: "/inquiry-form" },
    { label: "View concierge policy", href: "/company-profile", variant: "secondary" },
  ],
};

const metrics = [
  { label: "Lots live", value: "48", detail: "curated today" },
  { label: "Avg. savings", value: "18%", detail: "vs boutique" },
  { label: "Service history", value: "95%", detail: "docs uploaded" },
  { label: "Watchlists", value: "310", detail: "collectors tuned in" },
];

const insights = [
  {
    label: "Diver boom",
    detail: "Submariners with full kits closing 4% above last week.",
    trend: "+4% delta",
  },
  {
    label: "Chronograph lane",
    detail: "Speedmasters with tritium dials moving in under 3 hours.",
    trend: "<3h turnover",
  },
  {
    label: "Digital luxe",
    detail: "Apple Watch Ultra bundles remain top entry point for new buyers.",
    trend: "+22 new bidders",
  },
];

const timeline = [
  { label: "Authentication batch", detail: "COSC reports uploading", eta: "In 30m" },
  { label: "Bracelet sizing", detail: "Concierge workshop window", eta: "18:00" },
  { label: "Global shipping", detail: "Overnight export manifest", eta: "Tonight" },
];

const items = [
  {
    name: "Rolex Submariner",
    img: "/images/Rolex Submariner.png",
    currentBid: 9500,
    endsIn: "3h 15m",
    watchers: 85,
    condition: "2020 · full set",
  },
  {
    name: "Apple Watch Ultra",
    img: "/images/Apple Watch Ultra.png",
    currentBid: 600,
    endsIn: "45m",
    watchers: 48,
    condition: "Titanium · LTE",
  },
  {
    name: "Omega Speedmaster",
    img: "/images/Omega Speedmaster.png",
    currentBid: 5200,
    endsIn: "2h 10m",
    watchers: 57,
    condition: "Hesalite · 1998",
  },
  {
    name: "Tag Heuer Carrera",
    img: "/images/Tag Heuer Carrera.png",
    currentBid: 3100,
    endsIn: "1h 55m",
    watchers: 39,
    condition: "Calibre Heuer 02",
  },
  {
    name: "Seiko Prospex",
    img: "/images/Seiko Prospex.png",
    currentBid: 800,
    endsIn: "4h 40m",
    watchers: 33,
    condition: "Limited diver",
  },
  {
    name: "Casio G-Shock",
    img: "/images/Casio G-Shock.png",
    currentBid: 150,
    endsIn: "5h 25m",
    watchers: 28,
    condition: "Master of G",
  },
  {
    name: "Omega Speedmaster '57",
    img: "/images/Omega Speedmaster.png",
    currentBid: 5400,
    endsIn: "2h 55m",
    watchers: 44,
    condition: "Manual wind · 2022",
  },
  {
    name: "Tag Heuer Carrera Glassbox",
    img: "/images/Tag Heuer Carrera.png",
    currentBid: 3350,
    endsIn: "1h 35m",
    watchers: 31,
    condition: "Reverse panda dial",
  },
  {
    name: "Apple Watch Ultra Alpine",
    img: "/images/Apple Watch Ultra.png",
    currentBid: 640,
    endsIn: "55m",
    watchers: 40,
    condition: "Alpine Loop + charger",
  },
];

export default function WatchesAuction() {
  return (
    <CategoryDetailPage
      categoryKey="watches"
      hero={hero}
      metrics={metrics}
      insights={insights}
      timeline={timeline}
      items={items}
    />
  );
}

