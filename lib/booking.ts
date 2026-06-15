// Booking concierge: detects travel/booking intent in a message and produces
// pre-filled deep links to partner platforms. No live scraping — these are
// affiliate-ready redirects (add your IDs via NEXT_PUBLIC_AFFILIATE_* envs).

export type BookingCategory = "flights" | "hotels" | "trains" | "food" | "cabs" | "doctor";

export type BookingOption = {
  provider: string;
  label: string;
  url: string;
  note: string;
};

export type BookingContext = {
  city?: string;
  origin?: string;
  destination?: string;
};

const intentKeywords: Array<{ category: BookingCategory; words: string[] }> = [
  { category: "flights", words: ["flight", "flights", "fly", "airfare", "air ticket", "airline", "plane"] },
  { category: "trains", words: ["train", "trains", "irctc", "rail", "railway", "tatkal", "pnr"] },
  { category: "hotels", words: ["hotel", "hotels", "stay", "stays", "room", "resort", "homestay", "lodge", "accommodation"] },
  { category: "food", words: ["restaurant", "restaurants", "dinner", "lunch", "eat", "food", "reservation", "table", "zomato", "dine"] },
  { category: "cabs", words: ["cab", "cabs", "taxi", "ride", "ola", "uber", "auto", "pickup", "drop"] },
  { category: "doctor", words: ["doctor", "doctors", "appointment", "clinic", "practo", "physician", "dentist", "consultation"] }
];

export const bookingCategoryLabels: Record<BookingCategory, string> = {
  flights: "Flights",
  hotels: "Hotels",
  trains: "Trains",
  food: "Food & reservations",
  cabs: "Cabs",
  doctor: "Doctor appointments"
};

export function detectBookingIntents(text: string): BookingCategory[] {
  const lower = text.toLowerCase();
  const found = new Set<BookingCategory>();

  for (const { category, words } of intentKeywords) {
    if (words.some((word) => new RegExp(`\\b${word}\\b`, "i").test(lower))) {
      found.add(category);
    }
  }

  return [...found];
}

function affiliate(provider: string) {
  // Optional affiliate suffix per provider (set NEXT_PUBLIC_AFFILIATE_<PROVIDER>).
  if (typeof process === "undefined") return "";
  const key = `NEXT_PUBLIC_AFFILIATE_${provider.toUpperCase()}`;
  return process.env[key] || "";
}

function withAffiliate(url: string, provider: string) {
  const tag = affiliate(provider);
  if (!tag) return url;
  return url.includes("?") ? `${url}&${tag}` : `${url}?${tag}`;
}

function enc(value?: string) {
  return encodeURIComponent((value || "").trim());
}

export function buildBookingOptions(category: BookingCategory, context: BookingContext): BookingOption[] {
  const destination = context.destination || context.city || "";
  const origin = context.origin || "";

  switch (category) {
    case "flights":
      return [
        {
          provider: "skyscanner",
          label: "Skyscanner",
          url: withAffiliate("https://www.skyscanner.co.in/transport/flights/", "skyscanner"),
          note: "Compare airlines and find the cheapest dates"
        },
        {
          provider: "makemytrip",
          label: "MakeMyTrip",
          url: withAffiliate("https://www.makemytrip.com/flights/", "makemytrip"),
          note: "Popular in India, frequent fare offers"
        },
        {
          provider: "googleflights",
          label: "Google Flights",
          url: withAffiliate(`https://www.google.com/travel/flights?q=${enc(`flights ${origin} to ${destination}`)}`, "googleflights"),
          note: "Fast price calendar and tracking"
        }
      ];
    case "hotels":
      return [
        {
          provider: "booking",
          label: "Booking.com",
          url: withAffiliate(`https://www.booking.com/searchresults.html?ss=${enc(destination)}`, "booking"),
          note: "Largest inventory, free cancellation filters"
        },
        {
          provider: "agoda",
          label: "Agoda",
          url: withAffiliate(`https://www.agoda.com/search?city=${enc(destination)}`, "agoda"),
          note: "Strong deals across Asia"
        },
        {
          provider: "makemytrip",
          label: "MakeMyTrip",
          url: withAffiliate(`https://www.makemytrip.com/hotels/hotel-listing/?city=${enc(destination)}`, "makemytrip"),
          note: "India-first, wallet offers"
        },
        {
          provider: "scapia",
          label: "Scapia",
          url: withAffiliate("https://www.scapia.com/", "scapia"),
          note: "Travel card rewards on stays"
        }
      ];
    case "trains":
      return [
        {
          provider: "irctc",
          label: "IRCTC",
          url: withAffiliate("https://www.irctc.co.in/nget/train-search", "irctc"),
          note: "Official Indian Railways booking"
        },
        {
          provider: "confirmtkt",
          label: "ConfirmTkt",
          url: withAffiliate(`https://www.confirmtkt.com/rbooking-train-tickets/${enc(origin)}-to-${enc(destination)}`, "confirmtkt"),
          note: "Seat availability and waitlist prediction"
        }
      ];
    case "food":
      return [
        {
          provider: "zomato",
          label: "Zomato",
          url: withAffiliate(`https://www.zomato.com/${enc(destination.toLowerCase())}/restaurants`, "zomato"),
          note: "Reviews, menus, and table reservations"
        },
        {
          provider: "googlemaps",
          label: "Maps: restaurants",
          url: withAffiliate(`https://www.google.com/maps/search/${enc(`best restaurants in ${destination}`)}`, "googlemaps"),
          note: "See ratings and directions nearby"
        }
      ];
    case "cabs":
      return [
        {
          provider: "uber",
          label: "Uber",
          url: withAffiliate("https://m.uber.com/", "uber"),
          note: "Book a ride to your destination"
        },
        {
          provider: "ola",
          label: "Ola",
          url: withAffiliate("https://book.olacabs.com/", "ola"),
          note: "India-wide cabs and autos"
        }
      ];
    case "doctor":
      return [
        {
          provider: "practo",
          label: "Practo",
          url: withAffiliate(`https://www.practo.com/${enc(destination.toLowerCase())}`, "practo"),
          note: "Find doctors and book appointments"
        }
      ];
    default:
      return [];
  }
}

export function buildConcierge(text: string, context: BookingContext) {
  return detectBookingIntents(text).map((category) => ({
    category,
    label: bookingCategoryLabels[category],
    options: buildBookingOptions(category, context)
  }));
}
