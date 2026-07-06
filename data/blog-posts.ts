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
  },
  {
    slug: "city-guides-neighbourhood-playbook",
    title: "Inside CityMitra's City Guides: A Neighbourhood Playbook for Every City",
    excerpt:
      "Best time to visit, how to get around, which areas do what, and a budget note that's actually honest — how CityMitra's city guides are built and how to use them before you plan anything else.",
    date: "2026-07-04",
    author: "CityMitra Team",
    coverImage: imageForTheme("city"),
    tags: ["City Guides", "Feature Deep-Dive", "Product"],
    ctaLabel: "Browse city guides",
    ctaHref: "/cities",
    blocks: [
      p(
        "Most 'city guide' content online is either a decade old or written by someone who visited once for a weekend. CityMitra's city guides are built the other way round — structured like a local's mental map, not a tourist brochure."
      ),
      h2("What's actually on a city guide page"),
      list(
        "Best time to visit — weather and crowd timing specific to that city, not generic 'October to March' advice",
        "Getting around — the real transport answer: metro, auto, app-cabs, or a car, and when each makes sense",
        "A budget note that says what things actually cost, not a vague 'affordable' or 'expensive' label",
        "Key areas and what they're each known for — so you know why you'd go to Connaught Place versus Chandni Chowk",
        "Curated picks pulled straight from the directory for that city, with local tips attached"
      ),
      h2("Why 'key areas' matter more than a list of attractions"),
      p(
        "A list of ten monuments doesn't tell you how a city works. Knowing that one area is the wholesale textile zone, another is the food street, and a third is where the business hotels cluster — that's what actually changes how you plan a day. CityMitra's guides are organised around that, city by city, from Delhi and Mumbai down to Leh."
      ),
      h2("Built to hand off, not to replace planning"),
      p(
        "A city guide page is deliberately the first stop, not the last. Every guide ends with a direct line into City Chat to get a personalised route with timings, and the curated picks link straight into Google Maps. Read the guide once before a trip; use the chat and the directory for everything specific to that day."
      ),
      p(
        "Seven cities are live at launch — Delhi, Mumbai, Bengaluru, Jaipur, Surat, Hyderabad, and Leh — with more being added as the directory grows."
      )
    ]
  },
  {
    slug: "how-citymitra-offers-work",
    title: "How CityMitra's Offers & Deals Rail Works (And Why the Discounts Are Real)",
    excerpt:
      "A hotel discount rail on the home page, an /offers page you can filter by category, and an honest 'coming soon' label instead of a fake discount when a deal isn't live yet.",
    date: "2026-07-05",
    author: "CityMitra Team",
    coverImage: imageForTheme("hotel"),
    tags: ["Offers", "Feature Deep-Dive", "Deals"],
    ctaLabel: "See today's offers",
    ctaHref: "/offers",
    blocks: [
      p(
        "Most 'deals' sections on travel sites show you whatever the highest-paying partner wants shown, labelled as if it's picked for you. CityMitra's Offers rail works differently, and it's worth explaining exactly how."
      ),
      h2("What you'll actually find there"),
      list(
        "Hotels: discounts from Booking.com, Agoda, MakeMyTrip, Expedia and Tripadvisor",
        "Flights: fare codes from Cleartrip and similar partners",
        "Shopping: fashion deals like Myntra's seasonal sale",
        "Cards: reward-point offers, like the HDFC IRCTC card, for people who book trains often"
      ),
      h2("Why some cards say 'Coming soon' instead of a discount"),
      p(
        "When a category doesn't have a live partner deal yet — cabs and food delivery, at the time of writing — CityMitra shows a plainly labelled 'Coming soon' card instead of inventing a discount percentage to fill the space. An empty-looking slot is more honest than a fabricated one, and it's a small thing that matters: if we'll lie about a 40% discount that doesn't exist, why would you trust anything else on the page?"
      ),
      h2("Sponsored means sponsored"),
      p(
        "Every partner link carries a 'sponsored' tag, both visibly and in the page's technical markup, because that's what it is. CityMitra earns a commission when you book through these links — that's the business model, stated plainly rather than hidden in fine print. It doesn't cost you anything extra, and it's how a free, sign-up-free site stays running."
      ),
      h2("Where to find it"),
      p(
        "The compact offers strip sits on the home page, right below the concierge banner. For the full list with category filters — Hotels, Flights, Cabs, Food, Trains, Cards, Shopping — head to the dedicated /offers page."
      )
    ]
  },
  {
    slug: "your-feedback-shapes-citymitra",
    title: "One Tap, Five Stars: How Your Feedback Shapes CityMitra",
    excerpt:
      "A one-row star rating on the home page that takes ten seconds — here's where that feedback actually goes, and why we built it deliberately small instead of a full review system.",
    date: "2026-07-06",
    author: "CityMitra Team",
    coverImage: imageForTheme("ai"),
    tags: ["Feedback", "Product", "Community"],
    ctaLabel: "Share your feedback",
    ctaHref: "/",
    blocks: [
      p(
        "Most feedback widgets are either a popup you have to dismiss twice or a five-page survey nobody finishes. CityMitra's feedback strip is neither — it's one row, near the footer, that takes about ten seconds if you use it at all."
      ),
      h2("What it looks like"),
      p(
        "Tap a star out of five. If you want, add a one-line note — what worked, or what to fix. Hit send. That's the entire interaction. No account, no email required, no follow-up prompts."
      ),
      h2("Where it actually goes"),
      p(
        "Your rating and note land in the same activity pipeline that powers CityMitra's internal analytics — visible to the team, not sold or shared anywhere. Low ratings with a note are exactly how listing errors and broken categories get caught and fixed; we don't have a large moderation team, so this small, low-friction channel is genuinely how issues surface."
      ),
      h2("Why it's this small on purpose"),
      p(
        "A full review system with photos, replies, and public profiles is a bigger commitment than most people want to make for a quick city-guide session. Keeping it to one tap plus an optional line means more people actually use it, and the signal we get — even just a star count trend — is more useful than a handful of essay-length reviews from the most motivated 1% of visitors."
      ),
      p(
        "If you've used CityMitra to find a market, book a cab, or plan a trip, the star rating at the bottom of the home page is the fastest way to tell us whether it worked."
      )
    ]
  },
  {
    slug: "every-category-citymitra-covers",
    title: "Every Category CityMitra Covers — From Wholesale Markets to EV Chargers",
    excerpt:
      "Thirty-plus categories spanning shopping, health, home services, and everyday utilities — a full list of what CityMitra tracks per city, and why the category list keeps growing.",
    date: "2026-07-07",
    author: "CityMitra Team",
    coverImage: imageForTheme("wholesale"),
    tags: ["Categories", "Feature Deep-Dive", "Product"],
    ctaLabel: "Explore all categories",
    ctaHref: "/",
    blocks: [
      p(
        "A city guide is only as useful as its category list. CityMitra started with the obvious ones — markets, hotels, food — and has kept adding the categories that come up in real errands, not just travel planning."
      ),
      h2("Shopping & commerce"),
      list(
        "Wholesale markets, sarees, electronics, malls, agriculture supply",
        "Each with city-specific search phrasing — 'wholesale market' means something different in Surat than in Jaipur"
      ),
      h2("Health & essential services"),
      list(
        "Hospitals and doctors — general physicians, paediatricians, dentists, specialists — with a Practo handoff",
        "Public restrooms — Sulabh facilities, mall and metro-station options",
        "Petrol pumps and EV charging — fast DC chargers, CNG stations, battery-swap points"
      ),
      h2("Home & everyday help"),
      list(
        "Plumber, electrician, carpenter, AC repair, pest control, laundry, packers & movers, pandit"
      ),
      h2("Leisure, learning & life admin"),
      list(
        "Gyms, salons, play arenas, sports academies, schools, sightseeing, news & media agencies"
      ),
      h2("Why the list keeps growing"),
      p(
        "Doctors, sports academies, EV charging, public restrooms, news & media, and agriculture are some of the newest additions — added because they're the searches people actually make on a normal day, not because they photograph well for a travel brochure. Every category works the same way: tap it, and CityMitra hands you off to Google Maps with the right search already typed in for your city."
      )
    ]
  },
  {
    slug: "citymitra-free-no-signup-explained",
    title: "CityMitra Is Free and Sign-Up-Free — Here's Exactly What That Means",
    excerpt:
      "No account wall, no email gate, no dark patterns. Here's what you can do without ever creating an account, and how a free product actually stays funded.",
    date: "2026-07-08",
    author: "CityMitra Team",
    coverImage: imageForTheme("cab"),
    tags: ["Why CityMitra", "Product", "Transparency"],
    ctaLabel: "Start browsing free",
    ctaHref: "/",
    blocks: [
      p(
        "A lot of 'free' products aren't, really — you hit a wall after three searches, or a paywall shows up right when you're about to find what you needed. CityMitra doesn't do that, and it's worth being specific about what 'free' actually covers."
      ),
      h2("What you can do without an account"),
      list(
        "Browse every city and every category, unlimited",
        "Chat with the AI guide and get full answers",
        "Build a full Travel Plan and export it as a PDF or CSV",
        "Read every blog post and city guide",
        "Submit feedback and subscribe to the newsletter"
      ),
      h2("What an account is actually for"),
      p(
        "CityMitra Pro exists for people who want extra features layered on top — it's opt-in, not a requirement to use the core product. You'll never be blocked mid-task and asked to sign up just to see a result you were already looking at."
      ),
      h2("So how does a free site pay for itself?"),
      p(
        "Two ways, both disclosed on the page itself: partner commissions on the Offers rail (clearly tagged 'sponsored'), and Google-served ads. We don't sell your data — the privacy policy is specific about what's collected (mostly anonymous usage events) and what isn't (names, phone numbers, payment details aren't collected at all)."
      ),
      p(
        "The bet is straightforward: a genuinely useful, honest free tool earns enough trust and traffic that the ad and partner revenue works out, without ever needing to gate the product behind a sign-up wall."
      )
    ]
  },
  {
    slug: "search-citymitra-like-a-pro",
    title: "Search CityMitra Like a Pro: ⌘K, City Switching, and Smart Search",
    excerpt:
      "The command palette, quick city switching, and search phrases that actually work — small features that save real time once you know they're there.",
    date: "2026-07-09",
    author: "CityMitra Team",
    coverImage: imageForTheme("market"),
    tags: ["How-To", "Search", "Product"],
    ctaLabel: "Try the search",
    ctaHref: "/",
    blocks: [
      p(
        "CityMitra has a few small navigation features that aren't obvious on first visit but save real time once you know they exist. Here's the shortlist."
      ),
      h2("⌘K / Ctrl+K opens the command palette"),
      p(
        "From anywhere on the site, press Cmd+K (Mac) or Ctrl+K (Windows/Linux) to open a fast search box. Type a city, a category, or a page name — 'Jaipur', 'EV charger', 'Travel Plan' — and jump straight there without clicking through menus."
      ),
      h2("Switching cities takes one tap"),
      p(
        "The city picker in the header remembers your current city as you browse categories, so switching from Delhi to Mumbai mid-session doesn't reset your place in the page. If you allow location access, CityMitra can also set your city automatically and sort results by actual distance."
      ),
      h2("Search phrases that work well"),
      list(
        "City + category: 'sarees in Surat', 'wholesale market Jaipur'",
        "Utility + urgency: 'EV charger near me', '24 hour petrol pump'",
        "Natural questions in City Chat: 'one day in Jaipur for textiles and food'"
      ),
      h2("Everything funnels into a map"),
      p(
        "Whichever path you use to find something — search, chat, or browsing categories — the destination is the same: a 'Show on map' action that hands off to Google Maps for the live details. The navigation features exist purely to get you to that handoff faster."
      )
    ]
  }
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
