// Affiliate/partner offers shown in the home page Offers rail and the /offers
// page. Each offer is honest about what we actually know: real partner links
// carry the exact tagline given by the partner, and slots without a live link
// yet are clearly marked "Coming soon" rather than showing an invented discount.

export type OfferCategory = "hotels" | "flights" | "cabs" | "food" | "trains";

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
  trains: "Trains"
};

export const offers: Offer[] = [
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
  }
];
