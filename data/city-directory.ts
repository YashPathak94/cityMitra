import {
  AirVent,
  Building2,
  Bug,
  CarFront,
  Dumbbell,
  Flame,
  GraduationCap,
  Hammer,
  HeartPulse,
  Hotel,
  Landmark,
  MapPin,
  Fuel,
  Scissors,
  Sparkles,
  ShoppingBag,
  Truck,
  Utensils,
  Volleyball,
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
  | "pestcontrol";

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
  { key: "markets", label: "Wholesale", icon: Building2 },
  { key: "sarees", label: "Sarees", icon: ShoppingBag },
  { key: "electronics", label: "Electronics", icon: Zap },
  { key: "hospitals", label: "Hospitals", icon: HeartPulse },
  { key: "malls", label: "Malls", icon: Landmark },
  { key: "play", label: "Play Arena", icon: Volleyball },
  { key: "schools", label: "Schools", icon: GraduationCap },
  { key: "food", label: "Eateries", icon: Utensils },
  { key: "grooming", label: "Grooming", icon: Sparkles },
  { key: "salon", label: "Salon & Spa", icon: Scissors },
  { key: "repair", label: "Vehicle Repair", icon: CarFront },
  { key: "plumber", label: "Plumber", icon: Wrench },
  { key: "electrician", label: "Electrician", icon: Zap },
  { key: "carpenter", label: "Carpenter", icon: Hammer },
  { key: "pandit", label: "Pandit", icon: Flame },
  { key: "movers", label: "Packers & Movers", icon: Truck },
  { key: "gym", label: "Gym & Fitness", icon: Dumbbell },
  { key: "laundry", label: "Laundry", icon: Sparkles },
  { key: "acrepair", label: "AC Repair", icon: AirVent },
  { key: "pestcontrol", label: "Pest Control", icon: Bug },
  { key: "petrol", label: "Petrol Pumps", icon: Fuel },
  { key: "hotels", label: "Hotels", icon: Hotel },
  { key: "dinner", label: "Dinner", icon: Utensils },
  { key: "sightseeing", label: "Sightseeing", icon: MapPin }
] as const;

export const cities = ["Delhi", "Mumbai", "Bengaluru", "Jaipur", "Surat", "Hyderabad", "Leh"] as const;

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
