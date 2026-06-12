import { UserLocation } from "@/lib/city-intel";

export function mapSearchUrl(query: string, userLocation: UserLocation | null) {
  if (userLocation) {
    return `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${userLocation.lat},${userLocation.lng},13z`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function mapDirectionsUrl(query: string, userLocation: UserLocation | null) {
  if (!userLocation) return mapSearchUrl(query, userLocation);

  return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${encodeURIComponent(query)}&travelmode=driving`;
}

export function mapEmbedUrl(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=12&output=embed`;
}
