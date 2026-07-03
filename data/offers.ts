// Affiliate/partner offers shown in the home page Offers rail and the /offers
// page. Each offer is honest about what we actually know: real partner links
// carry the exact tagline given by the partner, and slots without a live link
// yet are clearly marked "Coming soon" rather than showing an invented discount.

export type OfferCategory = "hotels" | "flights" | "cabs" | "food" | "trains" | "cards" | "shopping";

export type Offer = {
  id: string;
  provider: string;
  category: OfferCategory;
  tagline: string;
  badge: string;
  url: string; // empty string = not live yet, rendered as a non-clickable "Coming soon" card
  accent: string;
};

export const offerCategoryLabels: Record<OfferCategory, string> = {
  hotels: "Hotels",
  flights: "Flights",
  cabs: "Cabs",
  food: "Food",
  trains: "Trains",
  cards: "Cards",
  shopping: "Shopping"
};

const rawOffers: Offer[] = [
  {
    id: "makemytrip-hotels",
    provider: "MakeMyTrip",
    category: "hotels",
    tagline: "Maximize your travel savings with MakeMyTrip Hotels!",
    badge: "Hotel deals",
    url: "https://bitli.in/81Z7UFA",
    accent: "#d6262b"
  },
  {
    id: "booking-com",
    provider: "Booking.com",
    category: "hotels",
    tagline: "Upto 15% Off on all Bookings",
    badge: "15% OFF",
    url: "https://bitli.in/UHJePR8",
    accent: "#003b95"
  },
  {
    id: "agoda",
    provider: "Agoda",
    category: "hotels",
    tagline: "Get Upto 60% Off on Hotels & Activities",
    badge: "60% OFF",
    url: "https://bitli.in/P7onPo4",
    accent: "#5b2a86"
  },
  {
    id: "cleartrip",
    provider: "Cleartrip",
    category: "flights",
    tagline: "Get Upto 25% Off (Max: Rs 1500) on Domestic Flights Using Code: CTDOM",
    badge: "25% OFF",
    url: "https://bitli.in/LOOLR4q",
    accent: "#e2472b"
  },
  {
    id: "expedia",
    provider: "Expedia",
    category: "hotels",
    tagline: "Upto 60% Off on Hotel Bookings",
    badge: "60% OFF",
    url: "https://bitli.in/5Tq7btE",
    accent: "#b9790a"
  },
  {
    id: "uber",
    provider: "Uber",
    category: "cabs",
    tagline: "Ride offer coming soon",
    badge: "Coming soon",
    url: "",
    accent: "#111111"
  },
  {
    id: "ola",
    provider: "Ola",
    category: "cabs",
    tagline: "Ride offer coming soon",
    badge: "Coming soon",
    url: "",
    accent: "#c99a00"
  },
  {
    id: "zomato",
    provider: "Zomato",
    category: "food",
    tagline: "Dining offer coming soon",
    badge: "Coming soon",
    url: "",
    accent: "#cf2e3d"
  },
  {
    id: "swiggy",
    provider: "Swiggy",
    category: "food",
    tagline: "Delivery offer coming soon",
    badge: "Coming soon",
    url: "",
    accent: "#e8720c"
  },
  {
    id: "irctc",
    provider: "IRCTC",
    category: "trains",
    tagline: "Train booking offer coming soon",
    badge: "Coming soon",
    url: "",
    accent: "#0a4a86"
  },
  {
    id: "hdfc-irctc-card",
    provider: "HDFC IRCTC Card",
    category: "cards",
    tagline:
      "Earn 5 Reward points per Rs 100 spent on the IRCTC website. Earn 1 Reward point per Rs 100 spent on all other categories.",
    badge: "Reward card",
    url: "https://bitli.in/4ZO1jKN",
    accent: "#8b1e3f"
  },
  {
    id: "tripadvisor",
    provider: "Tripadvisor",
    category: "hotels",
    tagline: "Dream Your Next Trip with Trip Advisor",
    badge: "Plan your trip",
    url: "https://bitli.in/hIxh7l8",
    accent: "#00af87"
  },
  {
    id: "myntra",
    provider: "Myntra",
    category: "shopping",
    tagline: "Get 50-80% Off Across Top Brands",
    badge: "50-80% OFF",
    url: "https://myntr.it/tMi60uY",
    accent: "#ff3f6c"
  }
];

// Live offers first, "Coming soon" placeholders always last — keeps the rail
// feeling complete without deprioritising real, clickable deals. Sort is
// stable, so entries within each group keep their authored order above.
export const offers: Offer[] = [...rawOffers].sort((a, b) => Number(Boolean(b.url)) - Number(Boolean(a.url)));
