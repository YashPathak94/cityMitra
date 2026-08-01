import {
  AirVent,
  Armchair,
  Bike,
  BriefcaseBusiness,
  Building2,
  Bug,
  CakeSlice,
  CarFront,
  CarTaxiFront,
  Clapperboard,
  Coffee,
  Dumbbell,
  Flame,
  FlaskConical,
  GraduationCap,
  Hammer,
  Heart,
  HeartPulse,
  Hotel,
  KeyRound,
  Landmark,
  MapPin,
  Fuel,
  Gem,
  Newspaper,
  Package,
  PawPrint,
  Pill,
  PlugZap,
  Scissors,
  Sparkles,
  ShoppingBag,
  ShoppingBasket,
  Stethoscope,
  Toilet,
  Tractor,
  Trees,
  Trophy,
  Truck,
  Utensils,
  Volleyball,
  Wine,
  Wrench,
  Zap
} from "lucide-react";

export type CategoryKey =
  | "markets"
  | "sarees"
  | "electronics"
  | "hospitals"
  | "malls"
  | "play"
  | "schools"
  | "food"
  | "grooming"
  | "repair"
  | "petrol"
  | "hotels"
  | "dinner"
  | "sightseeing"
  | "plumber"
  | "electrician"
  | "carpenter"
  | "pandit"
  | "movers"
  | "gym"
  | "salon"
  | "laundry"
  | "acrepair"
  | "pestcontrol"
  | "sportsacademy"
  | "news"
  | "evcharging"
  | "restrooms"
  | "doctors"
  | "agriculture"
  | "pharmacies"
  | "dentists"
  | "diagnostics"
  | "cafes"
  | "bakeries"
  | "nightlife"
  | "cinemas"
  | "museums"
  | "parks"
  | "temples"
  | "wedding"
  | "jewellery"
  | "furniture"
  | "groceries"
  | "courier"
  | "cabs"
  | "bike-rental"
  | "car-rental"
  | "coworking"
  | "pet-care";

export type DirectoryItem = {
  name: string;
  city: string;
  category: CategoryKey;
  area: string;
  altitude?: string;
  volume: "High" | "Very High" | "Premium" | "Local Favorite";
  bestFor: string;
  eta: string;
  trust: number;
  tip: string;
};

export const categories = [
  { key: "markets", slug: "wholesale", label: "Wholesale", icon: Building2, tint: "#f97316" },
  { key: "sarees", slug: "sarees", label: "Sarees", icon: ShoppingBag, tint: "#db2777" },
  { key: "electronics", slug: "electronics", label: "Electronics", icon: Zap, tint: "#2563eb" },
  { key: "hospitals", slug: "hospitals", label: "Hospitals", icon: HeartPulse, tint: "#dc2626" },
  { key: "malls", slug: "malls", label: "Malls", icon: Landmark, tint: "#7c3aed" },
  { key: "play", slug: "play-arena", label: "Play Arena", icon: Volleyball, tint: "#0891b2" },
  { key: "schools", slug: "schools", label: "Schools", icon: GraduationCap, tint: "#0d9488" },
  { key: "food", slug: "eateries", label: "Eateries", icon: Utensils, tint: "#ea580c" },
  { key: "grooming", slug: "grooming", label: "Grooming", icon: Sparkles, tint: "#c026d3" },
  { key: "salon", slug: "salon-spa", label: "Salon & Spa", icon: Scissors, tint: "#e11d48" },
  { key: "repair", slug: "vehicle-repair", label: "Vehicle Repair", icon: CarFront, tint: "#475569" },
  { key: "plumber", slug: "plumbers", label: "Plumber", icon: Wrench, tint: "#0284c7" },
  { key: "electrician", slug: "electricians", label: "Electrician", icon: Zap, tint: "#ca8a04" },
  { key: "carpenter", slug: "carpenters", label: "Carpenter", icon: Hammer, tint: "#a16207" },
  { key: "pandit", slug: "pandits", label: "Pandit", icon: Flame, tint: "#ea580c" },
  { key: "movers", slug: "packers-movers", label: "Packers & Movers", icon: Truck, tint: "#2563eb" },
  { key: "gym", slug: "gyms", label: "Gym & Fitness", icon: Dumbbell, tint: "#16a34a" },
  { key: "laundry", slug: "laundry", label: "Laundry", icon: Sparkles, tint: "#0891b2" },
  { key: "acrepair", slug: "ac-repair", label: "AC Repair", icon: AirVent, tint: "#0284c7" },
  { key: "pestcontrol", slug: "pest-control", label: "Pest Control", icon: Bug, tint: "#65a30d" },
  { key: "petrol", slug: "petrol-pumps", label: "Petrol Pumps", icon: Fuel, tint: "#059669" },
  { key: "hotels", slug: "hotels", label: "Hotels", icon: Hotel, tint: "#7c3aed" },
  { key: "dinner", slug: "dinner", label: "Dinner", icon: Utensils, tint: "#ea580c" },
  { key: "sightseeing", slug: "sightseeing", label: "Sightseeing", icon: MapPin, tint: "#0891b2" },
  { key: "doctors", slug: "doctors", label: "Doctors", icon: Stethoscope, tint: "#dc2626" },
  { key: "sportsacademy", slug: "sports-academies", label: "Sports Academy", icon: Trophy, tint: "#16a34a" },
  { key: "evcharging", slug: "ev-charging", label: "EV Charging", icon: PlugZap, tint: "#059669" },
  { key: "restrooms", slug: "public-restrooms", label: "Public Restrooms", icon: Toilet, tint: "#0284c7" },
  { key: "news", slug: "news-media", label: "News & Media", icon: Newspaper, tint: "#475569" },
  { key: "agriculture", slug: "agriculture", label: "Agriculture", icon: Tractor, tint: "#65a30d" },
  { key: "pharmacies", slug: "pharmacies", label: "Pharmacies", icon: Pill, tint: "#0f766e" },
  { key: "dentists", slug: "dentists", label: "Dentists", icon: Stethoscope, tint: "#2563eb" },
  { key: "diagnostics", slug: "diagnostic-labs", label: "Diagnostic Labs", icon: FlaskConical, tint: "#7c3aed" },
  { key: "cafes", slug: "cafes", label: "Cafes", icon: Coffee, tint: "#b45309" },
  { key: "bakeries", slug: "bakeries", label: "Bakeries", icon: CakeSlice, tint: "#db2777" },
  { key: "nightlife", slug: "nightlife", label: "Nightlife", icon: Wine, tint: "#7c3aed" },
  { key: "cinemas", slug: "cinemas", label: "Cinemas", icon: Clapperboard, tint: "#dc2626" },
  { key: "museums", slug: "museums", label: "Museums", icon: Landmark, tint: "#475569" },
  { key: "parks", slug: "parks", label: "Parks", icon: Trees, tint: "#15803d" },
  { key: "temples", slug: "temples", label: "Temples", icon: Flame, tint: "#ea580c" },
  { key: "wedding", slug: "wedding-services", label: "Wedding Services", icon: Heart, tint: "#e11d48" },
  { key: "jewellery", slug: "jewellery", label: "Jewellery", icon: Gem, tint: "#ca8a04" },
  { key: "furniture", slug: "furniture", label: "Furniture", icon: Armchair, tint: "#92400e" },
  { key: "groceries", slug: "groceries", label: "Groceries", icon: ShoppingBasket, tint: "#16a34a" },
  { key: "courier", slug: "courier-services", label: "Courier Services", icon: Package, tint: "#2563eb" },
  { key: "cabs", slug: "cabs", label: "Cabs", icon: CarTaxiFront, tint: "#ca8a04" },
  { key: "bike-rental", slug: "bike-rentals", label: "Bike Rentals", icon: Bike, tint: "#0891b2" },
  { key: "car-rental", slug: "car-rentals", label: "Car Rentals", icon: KeyRound, tint: "#475569" },
  { key: "coworking", slug: "coworking", label: "Coworking", icon: BriefcaseBusiness, tint: "#2563eb" },
  { key: "pet-care", slug: "pet-care", label: "Pet Care", icon: PawPrint, tint: "#db2777" }
] as const;

export const cities = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Jaipur",
  "Surat",
  "Hyderabad",
  "Leh",
  "Prayagraj",
  "Varanasi",
  "Indore",
  "Ayodhya",
  "Agra",
  "Manali",
  "Shimla",
  "Mussoorie",
  "Darjeeling",
  "Rishikesh",
  "Haridwar",
  "Ujjain",
  "Amritsar",
  "Bhopal",
  "Gwalior",
  "Jabalpur",
  "Khajuraho",
  "Orchha",
  "Pachmarhi",
  "Maheshwar",
  "Lucknow",
  "Mathura",
  "Vrindavan",
  "Kanpur",
  "Jhansi",
  "Chitrakoot",
  "Kochi",
  "Thiruvananthapuram",
  "Munnar",
  "Alappuzha",
  "Kozhikode",
  "Wayanad",
  "Varkala"
] as const;

export function categoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug || category.key === slug);
}

export function categoryHref(citySlug: string, categoryKey: CategoryKey) {
  const category = categories.find((item) => item.key === categoryKey);
  return `/cities/${citySlug}/${category?.slug || categoryKey}`;
}

export const directory: DirectoryItem[] = [
  {
    name: "Chandni Chowk Trade Lanes",
    city: "Delhi",
    category: "markets",
    area: "Old Delhi",
    volume: "Very High",
    bestFor: "bulk wedding goods, spices, fabric, daily wholesale runs",
    eta: "Metro friendly",
    trust: 96,
    tip: "Go before noon and keep two alternate lanes ready for faster buying."
  },
  {
    name: "Nalli Silk Circuit",
    city: "Delhi",
    category: "sarees",
    area: "South Extension",
    volume: "Premium",
    bestFor: "silk sarees and planned family shopping",
    eta: "25 min from Connaught Place",
    trust: 91,
    tip: "Book blouse measurements before peak evening hours."
  },
  {
    name: "Lamington Road Electronics",
    city: "Mumbai",
    category: "electronics",
    area: "Grant Road",
    volume: "Very High",
    bestFor: "computer parts, repairs, cameras, components",
    eta: "Local train friendly",
    trust: 94,
    tip: "Compare warranty terms before comparing price."
  },
  {
    name: "Kokilaben Dhirubhai Ambani Hospital",
    city: "Mumbai",
    category: "hospitals",
    area: "Andheri West",
    volume: "Premium",
    bestFor: "multi-specialty consultation and planned treatment",
    eta: "35 min from BKC",
    trust: 93,
    tip: "Carry prior reports digitally and physically."
  },
  {
    name: "Phoenix Marketcity",
    city: "Bengaluru",
    category: "malls",
    area: "Whitefield",
    volume: "Very High",
    bestFor: "shopping, cinema, food, family meetups",
    eta: "Metro plus short cab",
    trust: 90,
    tip: "Use basement parking availability signs to avoid circular delays."
  },
  {
    name: "Play Arena",
    city: "Bengaluru",
    category: "play",
    area: "Kasavanahalli",
    volume: "High",
    bestFor: "group sports, corporate outings, weekend games",
    eta: "30 min from Koramangala",
    trust: 89,
    tip: "Pre-book courts for evenings and weekends."
  },
  {
    name: "Mayo College Cluster",
    city: "Jaipur",
    category: "schools",
    area: "Ajmer Road Access",
    volume: "Premium",
    bestFor: "school research and education planning",
    eta: "Route depends on campus visit",
    trust: 88,
    tip: "Shortlist by board, commute, and admissions calendar first."
  },
  {
    name: "Johari Bazaar Food Stops",
    city: "Jaipur",
    category: "food",
    area: "Pink City",
    volume: "Very High",
    bestFor: "kachori, sweets, lassi, quick market snacks",
    eta: "Walkable market zone",
    trust: 92,
    tip: "Pair food stops with shopping lanes to save a second trip."
  },
  {
    name: "Athwa Grooming Row",
    city: "Surat",
    category: "grooming",
    area: "Athwa",
    volume: "High",
    bestFor: "salons, wedding grooming, skincare appointments",
    eta: "20 min from textile market",
    trust: 85,
    tip: "Ask for package duration, not only package price."
  },
  {
    name: "Ring Road Auto Service Belt",
    city: "Surat",
    category: "repair",
    area: "Ring Road",
    volume: "Very High",
    bestFor: "quick two-wheeler and car repair",
    eta: "Market-adjacent",
    trust: 87,
    tip: "Take a photo of parts before replacement for clear billing."
  },
  {
    name: "Jubilee Hills Dinner Trail",
    city: "Hyderabad",
    category: "dinner",
    area: "Jubilee Hills",
    volume: "Premium",
    bestFor: "family dinners, dates, late evening food",
    eta: "25 min from Hitec City",
    trust: 91,
    tip: "Reserve ahead on Fridays and ask for valet wait time."
  },
  {
    name: "Charminar Heritage Loop",
    city: "Hyderabad",
    category: "sightseeing",
    area: "Old City",
    volume: "Very High",
    bestFor: "heritage walk, bangles, street food, photography",
    eta: "Best by cab plus walking",
    trust: 95,
    tip: "Start early evening and keep the shopping route one-way."
  },
  {
    name: "Leh Main Bazaar",
    city: "Leh",
    category: "markets",
    area: "Main Bazaar Road",
    altitude: "Approx. 3,500 m",
    volume: "Very High",
    bestFor: "warm layers, dry fruits, souvenirs, cafes, SIM and travel basics",
    eta: "Central walkable zone",
    trust: 94,
    tip: "Shop after acclimatization walks; keep the first day light and hydrated."
  },
  {
    name: "Tibetan Market",
    city: "Leh",
    category: "sightseeing",
    area: "Near Main Bazaar",
    altitude: "Approx. 3,500 m",
    volume: "High",
    bestFor: "handicrafts, woollens, local browsing, slow evening walks",
    eta: "5-10 min from Main Bazaar",
    trust: 88,
    tip: "Pair it with Main Bazaar instead of making a separate trip."
  },
  {
    name: "Leh Palace Viewpoint",
    city: "Leh",
    category: "sightseeing",
    area: "Old Leh",
    altitude: "Approx. 3,600 m",
    volume: "Very High",
    bestFor: "history, city views, sunset photos, first sightseeing loop",
    eta: "20-30 min slow climb or short cab",
    trust: 92,
    tip: "Do this after one acclimatization day if you feel breathless."
  },
  {
    name: "Shanti Stupa",
    city: "Leh",
    category: "sightseeing",
    area: "Changspa",
    altitude: "Approx. 3,600 m",
    volume: "Very High",
    bestFor: "sunset, panoramic Leh views, calm first-evening plan",
    eta: "15 min cab from Main Bazaar",
    trust: 93,
    tip: "Carry a layer; wind picks up fast after sunset."
  },
  {
    name: "SNM Hospital",
    city: "Leh",
    category: "hospitals",
    area: "Leh town",
    altitude: "Approx. 3,500 m",
    volume: "High",
    bestFor: "altitude sickness checks, emergency care, general medical help",
    eta: "10-15 min from Main Bazaar",
    trust: 90,
    tip: "For headache, nausea, or breathlessness at altitude, do not wait it out."
  },
  {
    name: "Leh Manali Highway Service Belt",
    city: "Leh",
    category: "repair",
    area: "Skalzangling and highway access roads",
    altitude: "Approx. 3,500 m",
    volume: "High",
    bestFor: "bike checks, puncture repair, brake inspection, road-trip prep",
    eta: "15-20 min from Main Bazaar",
    trust: 86,
    tip: "Check brakes, clutch, tyres, coolant, and spare fuel before high passes."
  },
  {
    name: "HP Petrol Pump Leh",
    city: "Leh",
    category: "petrol",
    area: "Leh town",
    altitude: "Approx. 3,500 m",
    volume: "Very High",
    bestFor: "fuel top-up before Nubra, Pangong, Khardung La, and long loops",
    eta: "Central access",
    trust: 91,
    tip: "Top up in Leh even if the tank looks comfortable; distances are deceptive."
  },
  {
    name: "The Grand Dragon Ladakh",
    city: "Leh",
    category: "hotels",
    area: "Old Road",
    altitude: "Approx. 3,500 m",
    volume: "Premium",
    bestFor: "premium stay, family comfort, acclimatization base",
    eta: "10 min from airport",
    trust: 92,
    tip: "Keep day one free for rest even if the hotel feels comfortable."
  },
  {
    name: "Hotel Omasila",
    city: "Leh",
    category: "hotels",
    area: "Changspa",
    altitude: "Approx. 3,500 m",
    volume: "Local Favorite",
    bestFor: "quiet stays, walkable cafes, relaxed acclimatization",
    eta: "10 min from Main Bazaar",
    trust: 87,
    tip: "Choose Changspa if you want calmer evenings near cafe lanes."
  }
];

export function summarizeDirectory() {
  return directory
    .map(
      (item) =>
        `${item.name} in ${item.city} (${item.area}${item.altitude ? `, ${item.altitude}` : ""}) for ${item.bestFor}. Category: ${item.category}. Tip: ${item.tip}`
    )
    .join("\n");
}
