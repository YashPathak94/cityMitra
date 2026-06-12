import { NextRequest, NextResponse } from "next/server";

const fallbackImages: Record<string, string> = {
  dining: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
  hotels: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  markets: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
  places: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80"
};

// Only redirect to image hosts we expect from the Wikipedia/Commons APIs.
function isAllowedImageHost(value: string) {
  try {
    const host = new URL(value).hostname;
    return (
      value.startsWith("https://") &&
      (host.endsWith(".wikimedia.org") ||
        host.endsWith(".wikipedia.org") ||
        host === "images.unsplash.com")
    );
  } catch {
    return false;
  }
}

function clean(value: string | null) {
  return (value || "")
    .replace(/[^a-zA-Z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function fallbackFor(topic: string) {
  const lowerTopic = topic.toLowerCase();

  if (lowerTopic.includes("hotel")) return fallbackImages.hotels;
  if (lowerTopic.includes("dining") || lowerTopic.includes("food") || lowerTopic.includes("restaurant")) {
    return fallbackImages.dining;
  }
  if (lowerTopic.includes("market") || lowerTopic.includes("shop") || lowerTopic.includes("wholesale")) {
    return fallbackImages.markets;
  }

  return fallbackImages.places;
}

async function findWikipediaCityImage(city: string) {
  const searchUrl = new URL("https://en.wikipedia.org/w/api.php");
  searchUrl.searchParams.set("action", "query");
  searchUrl.searchParams.set("format", "json");
  searchUrl.searchParams.set("list", "search");
  searchUrl.searchParams.set("srlimit", "5");
  searchUrl.searchParams.set("srsearch", `${city} India city`);

  const searchResponse = await fetch(searchUrl, {
    headers: { "User-Agent": "CityMitra/1.0 city image discovery" },
    next: { revalidate: 86400 }
  });
  const searchPayload = await searchResponse.json();
  const results = (searchPayload?.query?.search || []) as Array<{ pageid: number; title: string }>;
  const normalizedCity = city.toLowerCase();
  const bestMatch =
    results.find((item) => item.title.toLowerCase() === normalizedCity) ||
    results.find((item) => item.title.toLowerCase().includes(normalizedCity) && !/disambiguation/i.test(item.title)) ||
    results[0];

  if (!bestMatch?.pageid) return null;

  const imageUrl = new URL("https://en.wikipedia.org/w/api.php");
  imageUrl.searchParams.set("action", "query");
  imageUrl.searchParams.set("format", "json");
  imageUrl.searchParams.set("pageids", String(bestMatch.pageid));
  imageUrl.searchParams.set("prop", "pageimages");
  imageUrl.searchParams.set("pithumbsize", "1200");

  const imageResponse = await fetch(imageUrl, {
    headers: { "User-Agent": "CityMitra/1.0 city image discovery" },
    next: { revalidate: 86400 }
  });
  const imagePayload = await imageResponse.json();
  const page = imagePayload?.query?.pages?.[bestMatch.pageid];
  const source = page?.thumbnail?.source;

  return typeof source === "string" && !/\.svg($|\?)/i.test(source) ? source : null;
}

export async function GET(request: NextRequest) {
  const city = clean(request.nextUrl.searchParams.get("city"));
  const topic = clean(request.nextUrl.searchParams.get("topic")) || "city";
  const fallback = fallbackFor(topic);

  if (!city) {
    return NextResponse.redirect(fallback, {
      headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" }
    });
  }

  const cityPageImage = await findWikipediaCityImage(city).catch(() => null);

  if (cityPageImage && isAllowedImageHost(cityPageImage)) {
    return NextResponse.redirect(cityPageImage, {
      headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" }
    });
  }

  const search = `${city} India city`;
  const commonsUrl = new URL("https://commons.wikimedia.org/w/api.php");
  commonsUrl.searchParams.set("action", "query");
  commonsUrl.searchParams.set("format", "json");
  commonsUrl.searchParams.set("generator", "search");
  commonsUrl.searchParams.set("gsrnamespace", "6");
  commonsUrl.searchParams.set("gsrlimit", "8");
  commonsUrl.searchParams.set("gsrsearch", search);
  commonsUrl.searchParams.set("prop", "imageinfo");
  commonsUrl.searchParams.set("iiprop", "url");
  commonsUrl.searchParams.set("iiurlwidth", "1200");

  try {
    const response = await fetch(commonsUrl, {
      headers: {
        "User-Agent": "CityMitra/1.0 city image discovery"
      },
      next: { revalidate: 86400 }
    });
    const payload = await response.json();
    const pages = Object.values(payload?.query?.pages || {}) as Array<{
      imageinfo?: Array<{ thumburl?: string; url?: string }>;
      title?: string;
    }>;
    const image = pages
      .map((page) => page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url)
      .find((url): url is string => Boolean(url && !/\.svg($|\?)/i.test(url) && isAllowedImageHost(url)));

    return NextResponse.redirect(image || fallback, {
      headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" }
    });
  } catch {
    return NextResponse.redirect(fallback, {
      headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" }
    });
  }
}
