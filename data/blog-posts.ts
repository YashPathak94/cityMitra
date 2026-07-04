import { imageForTheme } from "@/lib/category-images";

// Blog content for /blog and /blog/[slug]. Posts use a small block model
// (paragraphs, h2 headings, lists) so articles render with real structure —
// good for readers and for SEO. Images come from lib/category-images'
// verified Unsplash sets so covers never 404.
//
// Honesty rule (applies to every post): describe only features CityMitra
// actually has, and keep AI/trust claims accurate — AI suggestions are
// starting points to verify, not guarantees.

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO date
  author: string;
  coverImage: string;
  tags: string[];
  blocks: BlogBlock[];
  ctaLabel: string;
  ctaHref: string;
};

const p = (text: string): BlogBlock => ({ type: "p", text });
const h2 = (text: string): BlogBlock => ({ type: "h2", text });
const list = (...items: string[]): BlogBlock => ({ type: "list", items });

export const blogPosts: BlogPost[] = [
  {
    slug: "discover-best-local-spots-indian-cities",
    title: "Discover the Best Local Spots in Indian Cities with CityMitra",
    excerpt:
      "From wholesale lanes in Old Delhi to hidden eateries in Jaipur — how to cut through the noise and find local spots that are actually worth your time, using one city guide built for India.",
    date: "2026-07-03",
    author: "CityMitra Team",
    coverImage: imageForTheme("market"),
    tags: ["Local Discovery", "City Guides", "India"],
    ctaLabel: "Explore your city now",
    ctaHref: "/",
    blocks: [
      p(
        "Ever felt overwhelmed trying to find authentic eateries, trusted repair shops, or community-backed markets in a bustling Indian city? You're not alone. With rapid urbanisation and an explosion of new businesses, even longtime residents struggle to keep up with which places are genuinely worth visiting. The problem isn't a lack of options — it's filtering through the noise."
      ),
      p(
        "CityMitra was built for exactly this. Pick a city — Delhi, Mumbai, Bengaluru, Jaipur, Surat, Hyderabad, even Leh — tap a category, and get map-ready picks in seconds: wholesale markets, hospitals, hotels, street food, salons, plumbers, EV chargers, and more than two dozen other categories, each with a one-tap route into Google Maps."
      ),
      h2("Find trusted local services in minutes, not hours"),
      p(
        "Whether you're hunting for an electrician in Paschim Vihar, a hygienic eatery near your hotel, or a pharmacy that's open late, the slow part is usually the searching — endless tabs, outdated listings, and reviews you can't judge. CityMitra flips that: every category gives you a shortlist of the kinds of places locals actually use, plus a direct 'Show on map' action so you can check live hours, photos, and directions in Google Maps before you leave."
      ),
      list(
        "Pick your city and tap a category — no sign-up needed to browse",
        "Use the search bar (or press Ctrl/Cmd+K) with phrases like 'sarees in Surat' or 'EV charger near me'",
        "Tap 'Show on map' to verify live timings and reviews before travelling",
        "Enable nearby mode to sort picks around your actual location"
      ),
      h2("Navigate like a local — without the guesswork"),
      p(
        "Exploring a market district like Chandni Chowk rewards a plan. Go early or late to skip the midday crush, know the specialty of each lane before you arrive, and keep a backup stop ready. CityMitra's city guides list the actual market clusters per city with what each is genuinely known for, and every recommendation links straight into Maps for live traffic and transit — so you spend your time buying, not backtracking."
      ),
      h2("How CityMitra keeps recommendations honest"),
      p(
        "A word on trust, because it matters. CityMitra combines a hand-curated directory of well-known, long-standing places (each with a trust score) with AI-generated suggestions for everything else. We label which is which, and we never claim live availability or current prices — that's what the Google Maps handoff is for. When something looks wrong, the feedback strip on the home page goes straight to the team, and listings get corrected."
      ),
      h2("Make smarter city discoveries — starting today"),
      p(
        "The best city discoveries happen when one reliable guide brings places, routes, deals, and planning together. Swap a franchise stop for an independent vendor this week, use the AI chat to plan a Saturday market run, and turn everyday errands into a chance to support the businesses that give your neighbourhood its character."
      )
    ]
  },
  {
    slug: "how-to-use-citymitra-ai-city-chat",
    title: "How to Use CityMitra's AI City Chat to Plan Any Indian City in Minutes",
    excerpt:
      "A practical walkthrough of CityMitra's AI chat: the prompts that work best, how to get a day plan with timings and backups, and when to hand off to Google Maps.",
    date: "2026-06-28",
    author: "CityMitra Team",
    coverImage: imageForTheme("ai"),
    tags: ["How-To", "AI Planning", "City Chat"],
    ctaLabel: "Open City Chat",
    ctaHref: "/chat",
    blocks: [
      p(
        "Planning a day in an unfamiliar Indian city usually means twenty open tabs: one for food, one for the fort timings, one for 'is this area safe after dark'. CityMitra's City Chat compresses that into one conversation. Ask a question, get a tight answer with named places, areas, and timing hints — then tap through to book a cab, find a hotel, or open the route in Maps."
      ),
      h2("Prompts that get great answers"),
      list(
        "'One day in Jaipur for textiles and street food' — returns a sequenced plan, not a list dump",
        "'Best areas to stay in Hyderabad for a business trip under ₹4,000/night'",
        "'Wholesale saree markets in Surat and when to go'",
        "'Leh in October — what should I know?' (the chat flags altitude acclimatisation automatically)"
      ),
      h2("Ask for an itinerary when you want one"),
      p(
        "By default the chat keeps it short — a one-line intro and a handful of tight bullets. When you actually want a full plan, say the word: ask for an 'itinerary' or a 'route table' and it switches to a day-by-day structure. You can also export your plan as a PDF or CSV from the home page's planner tools to keep it offline."
      ),
      h2("Use the booking chips, skip the app-juggling"),
      p(
        "When your question involves flights, hotels, trains, cabs, or a doctor, the chat surfaces booking chips under the answer — deep links into Cleartrip, Booking.com, MakeMyTrip, Agoda, IRCTC, Uber, Practo and more, pre-filtered for your city. You compare and book on the provider's own site; CityMitra just saves you the searching."
      ),
      h2("Know what the AI can and can't do"),
      p(
        "City Chat is honest about its limits: it won't claim live availability, current opening hours, or medical certainty — always verify those in Maps or by calling ahead. Treat it as a fast local friend who knows every neighbourhood's reputation, and let Google Maps handle the live, minute-by-minute details."
      ),
      p(
        "Try it with your next trip — even a routine one. 'Where should I get dinner near Connaught Place tonight?' takes about eight seconds to answer."
      )
    ]
  },
  {
    slug: "fund-your-trip-citymitra-travel-plan",
    title: "How CityMitra's Travel Plan Turns a Dream Trip into a Funded One",
    excerpt:
      "Set a destination and a budget, and CityMitra's Travel Plan builds a month-by-month saving plan — with transport comparisons, hotel tiers, and card-reward math that stays honest.",
    date: "2026-06-20",
    author: "CityMitra Team",
    coverImage: imageForTheme("flight"),
    tags: ["Travel Planning", "Budgeting", "Travel Plan"],
    ctaLabel: "Build my Travel Plan",
    ctaHref: "/travel-plan",
    blocks: [
      p(
        "Most trips get funded the same last-minute way: a chunk of savings, a credit card swipe, and some post-trip regret. CityMitra's Travel Plan works backwards instead — start from the destination, date, and budget, and get a concrete plan for how the money shows up before the trip does."
      ),
      h2("Start with the number, not the destination"),
      p(
        "Enter where you're going, when, how many travellers, and your target budget. The calculator instantly shows the monthly amount to set aside, a projected corpus for your timeline, and how much of the trip could be offset by disciplined saving plus card rewards — all computed live as you adjust the sliders, no sign-up required."
      ),
      h2("Compare every way to travel and stay"),
      list(
        "Transport: realistic fare ranges for flights, trains, buses, car, and bike on your exact route, with the best-value pick flagged",
        "Hotels: budget, comfort, and premium tiers priced for your number of nights",
        "Cards: if you tell it which cards you hold (HDFC, Axis, SBI, ICICI, Amex and more), it suggests which to use for what — after subtracting annual fees"
      ),
      h2("The honesty clause (read this)"),
      p(
        "Travel Plan never promises free travel or guaranteed returns. Investment growth figures are illustrative assumptions — markets can fall — and every plan carries that disclaimer front and centre. The AI research suggestions (funds, stocks, card offers) are starting points you must verify with the issuer or a SEBI-registered advisor, not recommendations to act on blindly. We'd rather under-promise than surprise you."
      ),
      h2("From plan to booking"),
      p(
        "Once the plan looks right, the Offers page carries live partner deals — hotel discounts on Booking.com, Agoda and MakeMyTrip, flight codes on Cleartrip, and more — so the booking step captures some of the savings the plan counted on. Set the plan, automate the monthly transfer, and let the trip fund itself a little each month."
      )
    ]
  },
  {
    slug: "wholesale-markets-delhi-surat-jaipur",
    title: "Wholesale Markets in Delhi, Surat & Jaipur: A Buyer's Guide with CityMitra",
    excerpt:
      "Where India's traders actually buy: the wholesale clusters of Old Delhi, Surat's textile lanes, and Jaipur's craft markets — with timing tips and how to route between them fast.",
    date: "2026-06-12",
    author: "CityMitra Team",
    coverImage: imageForTheme("wholesale"),
    tags: ["Wholesale", "Shopping", "Markets"],
    ctaLabel: "Browse city guides",
    ctaHref: "/cities",
    blocks: [
      p(
        "India's wholesale markets are where retail prices go to be humbled — but they punish the unprepared. Lanes specialise ruthlessly, peak hours crush your pace, and the best deals go to buyers who know exactly which cluster to hit and when. Here's how experienced buyers work three of the biggest wholesale cities, and how CityMitra speeds up every step."
      ),
      h2("Delhi: the Chandni Chowk system"),
      p(
        "Old Delhi's trade lanes are really a dozen markets wearing one name: wedding goods here, spices there, fabric and paper in their own lanes. Go before noon, keep two alternate lanes ready, and travel by metro — parking is a myth. CityMitra's Delhi guide maps the clusters and its Wholesale category gives you map-ready entry points so you start in the right lane instead of finding it at 2pm."
      ),
      h2("Surat: textile wholesale at national scale"),
      p(
        "Surat moves more synthetic fabric and sarees than anywhere in India. The market complexes are vast and look identical from outside — the difference between a good trip and a wasted one is knowing which complex carries your category and price band. Search 'sarees in Surat' in CityMitra to get the known clusters, then verify current timings on the Maps handoff before you commit to a route."
      ),
      h2("Jaipur: crafts, gems, and block prints"),
      p(
        "Jaipur splits its wholesale energy between craft categories — block-printed textiles, gemstones, jootis, and blue pottery each have home turf. Bundle your buying by locality (a CityMitra city-guide staple) so you're not crossing the Pink City four times in an afternoon."
      ),
      h2("The buyer's checklist"),
      list(
        "Go early; wholesale mornings are calmer and more negotiable",
        "Carry small denominations — big notes slow every stall down",
        "Cluster stops by locality to cut travel time and fuel",
        "Use CityMitra's 'View all on map' to sanity-check distances before finalising your route",
        "Keep a backup lane for every category — stock varies day to day"
      ),
      p(
        "Wholesale buying rewards preparation more than bargaining skill. Ten minutes of route planning in CityMitra regularly saves an hour on the ground."
      )
    ]
  },
  {
    slug: "ev-charging-restrooms-everyday-utilities",
    title: "EV Chargers, Petrol Pumps & Public Restrooms: Finding Everyday Utilities Fast",
    excerpt:
      "The least glamorous searches are the most urgent ones. How CityMitra's utility categories — EV charging, fuel, public restrooms, doctors — turn panic searches into one-tap answers.",
    date: "2026-07-01",
    author: "CityMitra Team",
    coverImage: imageForTheme("fuel"),
    tags: ["City Utilities", "EV Charging", "How-To"],
    ctaLabel: "Find utilities in your city",
    ctaHref: "/",
    blocks: [
      p(
        "Nobody plans their day around finding a public restroom, an EV charger at 15% battery, or a doctor on a Sunday evening — which is exactly why those searches are the most stressful ones. CityMitra now treats everyday utilities as first-class categories, right next to hotels and markets."
      ),
      h2("EV charging without range anxiety"),
      p(
        "India's charging network is growing faster than any single app tracks it. CityMitra's EV Charging category builds the right searches for your city — fast DC chargers, mall charging, battery-swap stations, highway points — and drops you into Google Maps where live availability and plug types are visible. Check the route's chargers before you leave, not when the dashboard starts warning you."
      ),
      h2("Restrooms, fuel, and the other unglamorous essentials"),
      list(
        "Public Restrooms: Sulabh facilities, mall and metro-station restrooms, and pay-and-use options near you",
        "Petrol Pumps: 24-hour pumps, CNG stations, and highway fuel stops on your route",
        "Doctors: general physicians, paediatricians, dentists and specialists — with a Practo handoff for booked appointments",
        "Sports academies, agriculture supply stores, and local news offices round out the everyday list"
      ),
      h2("The two-tap pattern"),
      p(
        "Every utility follows the same flow: tap the category, tap 'Show on map'. CityMitra picks the right search phrasing for your city, and Google Maps supplies the live part — open now, distance, reviews. It's deliberately boring, because urgent searches should be."
      ),
      p(
        "Bookmark your city's page before your next road trip. The moment you need a charger or a chemist at midnight, the answer is two taps old."
      )
    ]
  },
  {
    slug: "why-citymitra-one-app-for-indian-cities",
    title: "Why CityMitra Beats Ten Open Tabs: One Guide for Markets, Hotels, Doctors & Deals",
    excerpt:
      "Search engines answer questions; CityMitra answers cities. Why a purpose-built Indian city guide saves you time over generic search — and everything you can do without even signing up.",
    date: "2026-06-05",
    author: "CityMitra Team",
    coverImage: imageForTheme("city"),
    tags: ["Why CityMitra", "Product", "Local Discovery"],
    ctaLabel: "See today's offers",
    ctaHref: "/offers",
    blocks: [
      p(
        "Generic search is brilliant at answering a question and terrible at planning a city. Ask it for 'things to do in Bengaluru' and you get listicles written for tourists who left in 2019. Ask CityMitra and you get the city broken into thirty practical categories — from wholesale markets and street food to EV chargers and paediatricians — each one two taps from a live map route."
      ),
      h2("Everything in one place, honestly labelled"),
      list(
        "Directory: curated, trust-scored picks plus AI suggestions (clearly labelled) across 7 launch cities",
        "City Chat: an AI guide that answers like a local and keeps it short",
        "Travel Plan: a savings calculator that funds trips with math, not promises",
        "Offers: live partner deals — hotels on Booking.com, Agoda and MakeMyTrip, flights on Cleartrip, fashion on Myntra — sorted so real deals come first",
        "City Guides: neighbourhood-level write-ups on markets, timings, transport and budget"
      ),
      h2("No sign-up wall, no dark patterns"),
      p(
        "You can browse every category, chat with the AI, build a travel plan, and export it as a PDF without creating an account. We flag sponsored links as sponsored, mark AI content as AI, and put a disclaimer on anything with a rupee sign attached. The business model is partnerships and featured placements — not selling your data, which we don't do."
      ),
      h2("Built for how Indian cities actually work"),
      p(
        "CityMitra's categories mirror real urban life here: pandits and packers-and-movers next to gyms and salons, CNG stations next to EV chargers, a Leh altitude warning baked into the chat. Global apps treat Indian cities as generic map tiles; CityMitra treats them as home turf."
      ),
      p(
        "Open your city, tap one category you'd normally Google, and time the difference. That gap — multiplied across every errand, trip, and booking — is the whole pitch."
      )
    ]
  }
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
