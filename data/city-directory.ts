import {
  Building2,
  CarFront,
  GraduationCap,
  HeartPulse,
  Landmark,
  MapPin,
  ShoppingBag,
  Utensils,
  Volleyball
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
  | "dinner"
  | "sightseeing";

export type DirectoryItem = {
  name: string;
  city: string;
  category: CategoryKey;
  area: string;
  volume: "High" | "Very High" | "Premium" | "Local Favorite";
  bestFor: string;
  eta: string;
  trust: number;
  tip: string;
};

export const categories = [
  { key: "markets", label: "Wholesale", icon: Building2 },
  { key: "sarees", label: "Sarees", icon: ShoppingBag },
  { key: "electronics", label: "Electronics", icon: ShoppingBag },
  { key: "hospitals", label: "Hospitals", icon: HeartPulse },
  { key: "malls", label: "Malls", icon: Landmark },
  { key: "play", label: "Play Arena", icon: Volleyball },
  { key: "schools", label: "Schools", icon: GraduationCap },
  { key: "food", label: "Eateries", icon: Utensils },
  { key: "grooming", label: "Grooming", icon: ShoppingBag },
  { key: "repair", label: "Vehicle Repair", icon: CarFront },
  { key: "dinner", label: "Dinner", icon: Utensils },
  { key: "sightseeing", label: "Sightseeing", icon: MapPin }
] as const;

export const cities = ["Delhi", "Mumbai", "Bengaluru", "Jaipur", "Surat", "Hyderabad"] as const;

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
  }
];

export function summarizeDirectory() {
  return directory
    .map((item) => `${item.name} in ${item.city} (${item.area}) for ${item.bestFor}. Tip: ${item.tip}`)
    .join("\n");
}
