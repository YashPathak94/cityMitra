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

function citySlug(value?: string) {
  return (value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

// Maps a CityMitra directory category to the most relevant booking category,
// so the chat can surface the right action chip first.
export const categoryToBooking: Record<string, BookingCategory> = {
  hotels: "hotels",
  dinner: "food",
  food: "food",
  hospitals: "doctor",
  sightseeing: "hotels",
  petrol: "cabs",
  repair: "cabs"
};

export function buildBookingOptions(category: BookingCategory, context: BookingContext): BookingOption[] {
  const destination = context.destination || context.city || "";
  const slug = citySlug(destination);

  switch (category) {
    case "flights":
      return [
        {
          provider: "makemytrip",
          label: "MakeMyTrip",
          url: withAffiliate("https://www.makemytrip.com/flights/", "makemytrip"),
          note: "India-first fares and offers"
        },
        {
          provider: "skyscanner",
          label: "Skyscanner",
          url: withAffiliate("https://www.skyscanner.co.in/", "skyscanner"),
          note: "Compare every airline"
        },
        {
          provider: "googleflights",
          label: "Google Flights",
          url: withAffiliate(`https://www.google.com/travel/flights?q=${enc(`Flights to ${destination}`)}`, "googleflights"),
          note: "Price calendar and tracking"
        }
      ];
    case "hotels":
      return [
        {
          provider: "makemytrip",
          label: "MakeMyTrip",
          url: "https://bitli.in/81Z7UFA",
          note: "Maximize your travel savings with MakeMyTrip Hotels!"
        },
        {
          provider: "booking",
          label: "Booking.com",
          url: "https://bitli.in/UHJePR8",
          note: "Upto 15% Off on all Bookings"
        },
        {
          provider: "agoda",
          label: "Agoda",
          url: "https://bitli.in/P7onPo4",
          note: "Get Upto 60% Off on Hotels & Activities"
        },
        {
          provider: "scapia",
          label: "Scapia",
          url: withAffiliate("https://www.scapia.com/", "scapia"),
          note: "Travel-card rewards"
        }
      ];
    case "trains":
      return [
        {
          provider: "irctc",
          label: "IRCTC",
          url: withAffiliate("https://www.irctc.co.in/nget/train-search", "irctc"),
          note: "Official railway booking"
        },
        {
          provider: "confirmtkt",
          label: "ConfirmTkt",
          url: withAffiliate("https://www.confirmtkt.com/", "confirmtkt"),
          note: "Seat & waitlist prediction"
        }
      ];
    case "food":
      return [
        {
          provider: "zomato",
          label: "Zomato",
          url: withAffiliate(slug ? `https://www.zomato.com/${slug}/restaurants` : "https://www.zomato.com/", "zomato"),
          note: "Menus, reviews, reservations"
        },
        {
          provider: "googlemaps",
          label: "Maps: restaurants",
          url: withAffiliate(`https://www.google.com/maps/search/${enc(`restaurants in ${destination}`)}`, "googlemaps"),
          note: "Ratings and directions"
        }
      ];
    case "cabs":
      return [
        {
          provider: "uber",
          label: "Uber",
          url: withAffiliate("https://m.uber.com/", "uber"),
          note: "Book a ride"
        },
        {
          provider: "ola",
          label: "Ola",
          url: withAffiliate("https://www.olacabs.com/", "ola"),
          note: "Cabs and autos"
        }
      ];
    case "doctor":
      return [
        {
          provider: "practo",
          label: "Practo",
          url: withAffiliate(slug ? `https://www.practo.com/${slug}` : "https://www.practo.com/", "practo"),
          note: "Find doctors & appointments"
        },
        {
          provider: "googlemaps",
          label: "Maps: clinics",
          url: withAffiliate(`https://www.google.com/maps/search/${enc(`clinics and hospitals in ${destination}`)}`, "googlemaps"),
          note: "Nearby, with directions"
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
