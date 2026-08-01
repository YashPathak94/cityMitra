import type { CityExperience, ExperienceKind } from "@/data/city-experiences";

type ExperienceSeed = {
  name: string;
  area: string;
  vibe: string;
  whyGo: string;
  genZHook: string;
  bestTime: string;
  searchQuery?: string;
};

type CitySeed = {
  city: string;
  restaurant: ExperienceSeed;
  local: ExperienceSeed;
  famous: ExperienceSeed;
  todo: ExperienceSeed;
};

const liveContact = "Open the live Maps listing for current phone, hours, photos, access notes, and directions.";

const seeds: CitySeed[] = [
  {
    city: "Bhopal",
    restaurant: { name: "Old Bhopal breakfast trail", area: "Chowk", vibe: "Poha, tea, bun kebab, and a city waking in old lanes.", whyGo: "A food-first introduction before the market gets dense.", genZHook: "Breakfast crawl energy without brunch pricing.", bestTime: "07:30-09:30.", searchQuery: "best breakfast Chowk Bhopal" },
    local: { name: "Upper Lake blue-hour walk", area: "Boat Club", vibe: "Open water, walkers, birds, and a cooler capital-city mood.", whyGo: "A low-cost reset with easy access to Shyamla Hills.", genZHook: "Main-character lake light, zero velvet rope.", bestTime: "Sunrise or one hour before sunset." },
    famous: { name: "Madhya Pradesh Tribal Museum", area: "Shyamla Hills", vibe: "Immersive galleries that let material, story, and community lead.", whyGo: "It adds living cultural context to a central India trip.", genZHook: "A museum that understands visual storytelling.", bestTime: "Late morning; verify weekly closure." },
    todo: { name: "Chowk craft and food loop", area: "Old Bhopal", vibe: "Ittar, zardozi, historic facades, and focused eating.", whyGo: "It connects craft, faith, and everyday commerce.", genZHook: "No generic mall montage. The lane is the feed.", bestTime: "Late afternoon into early dinner." }
  },
  {
    city: "Gwalior",
    restaurant: { name: "Maharaj Bada snack round", area: "Lashkar", vibe: "Kachori, sweets, and market movement below heritage facades.", whyGo: "An easy reward after the fort circuit.", genZHook: "Historic square, chaotic snack diplomacy.", bestTime: "Early evening." },
    local: { name: "Tansen precinct pause", area: "Hazira", vibe: "Music memory, shade, and a quieter side of the city.", whyGo: "It expands Gwalior beyond the fort.", genZHook: "Put on a raga and let the location do less shouting.", bestTime: "Morning or late afternoon." },
    famous: { name: "Gwalior Fort", area: "Fort plateau", vibe: "Blue tiles, palaces, temples, and huge central-India views.", whyGo: "The city's architecture and political history meet on one rock.", genZHook: "The skyline understood the assignment centuries ago.", bestTime: "Opening time." },
    todo: { name: "Fort-to-Bada history loop", area: "Gwalior core", vibe: "Royal plateau in the morning, public city in the evening.", whyGo: "It pairs monument scale with street-level life.", genZHook: "Two city moods, one sensible route.", bestTime: "Split between morning and sunset." }
  },
  {
    city: "Jabalpur",
    restaurant: { name: "Civic Centre street-food stop", area: "Civic Centre", vibe: "Regional snacks, quick meals, and central-city energy.", whyGo: "A practical refuel between Madan Mahal and the river plan.", genZHook: "Spend the cab money on three snacks instead.", bestTime: "Lunch or early evening." },
    local: { name: "Gwarighat evening", area: "Narmada riverfront", vibe: "Boats, bells, families, and a river ritual settling the day.", whyGo: "It shows the Narmada as lived city space.", genZHook: "Quiet river content, but keep worship off-camera.", bestTime: "Before sunset through aarti." },
    famous: { name: "Marble Rocks at Bhedaghat", area: "Bhedaghat", vibe: "A river passage through high marble walls.", whyGo: "Light, geology, and the Narmada create Jabalpur's defining landscape.", genZHook: "Nature made the production design.", bestTime: "Morning or late afternoon; verify boating." },
    todo: { name: "Madan Mahal and Balancing Rock", area: "Madan Mahal", vibe: "Gond history, short climbs, and a geological curiosity.", whyGo: "A compact city-side adventure before Bhedaghat.", genZHook: "A rock that survived the group project's structural review.", bestTime: "Early morning." }
  },
  {
    city: "Khajuraho",
    restaurant: { name: "Village-side Bundelkhand meal", area: "Khajuraho village", vibe: "Simple regional food away from tour-bus menus.", whyGo: "It gives the temple day a local rather than packaged pause.", genZHook: "Eat something with a postcode, not a buffet identity crisis.", bestTime: "Lunch.", searchQuery: "Bundelkhand food restaurant Khajuraho" },
    local: { name: "Eastern Group cycle loop", area: "Eastern temple cluster", vibe: "Quiet roads, Jain heritage, village edges, and slower looking.", whyGo: "It reveals a less crowded Khajuraho.", genZHook: "Cycle-core heritage without the group-tour soundtrack.", bestTime: "Late afternoon." },
    famous: { name: "Western Group of Temples", area: "Western Group", vibe: "Nagara architecture, extraordinary sculpture, and layered interpretation.", whyGo: "The protected group is the essential foundation of the visit.", genZHook: "Read the full wall, not one meme.", bestTime: "Opening time or golden hour." },
    todo: { name: "Temple architecture walk with a guide", area: "Western Group", vibe: "Story-led movement through halls, spires, and carved social worlds.", whyGo: "Good interpretation defeats the site's lazy stereotypes.", genZHook: "Context is the premium upgrade.", bestTime: "Morning; use official guide channels." }
  },
  {
    city: "Orchha",
    restaurant: { name: "Ram Raja square breakfast", area: "Town square", vibe: "Tea, poha, temple traffic, and a small town switching on.", whyGo: "It puts you inside Orchha's lived centre before the fort.", genZHook: "Breakfast with actual bells, not a cafe playlist.", bestTime: "07:00-09:00." },
    local: { name: "Betwa cenotaph sunset", area: "Kanchana Ghat", vibe: "River boulders, chhatri silhouettes, and long evening light.", whyGo: "The classic view works because the town finally slows.", genZHook: "Wallpaper energy. Safety barrier still applies.", bestTime: "One hour before sunset." },
    famous: { name: "Jahangir Mahal", area: "Orchha Fort", vibe: "Bundela-Mughal architecture, courtyards, stairs, and roofline views.", whyGo: "It anchors the town's royal and architectural history.", genZHook: "Symmetry, shadows, no filter dependency.", bestTime: "Opening time." },
    todo: { name: "Painted palace and river loop", area: "Fort to Betwa", vibe: "Murals, temple towers, lanes, and a river finish.", whyGo: "It uses the compact town without rushing it.", genZHook: "A full travel edit in walking distance.", bestTime: "Morning plus dusk." }
  },
  {
    city: "Pachmarhi",
    restaurant: { name: "Town-market comfort meal", area: "Pachmarhi bazaar", vibe: "Hot snacks, simple thalis, and post-trail recovery.", whyGo: "The body needs something practical after forest circuits.", genZHook: "Recovery meal, not an aesthetic side quest.", bestTime: "Lunch or early dinner." },
    local: { name: "Bison Lodge nature context", area: "Town core", vibe: "Natural-history orientation before entering the Satpuras.", whyGo: "It makes the landscape more legible.", genZHook: "Know the forest before filming the forest.", bestTime: "Morning; verify hours." },
    famous: { name: "Dhoopgarh sunset", area: "Satpura ridge", vibe: "Layered hills, changing colour, and a regulated viewpoint.", whyGo: "It is the region's iconic horizon when weather cooperates.", genZHook: "The sun sets. Everyone briefly stops talking.", bestTime: "Late afternoon; permit route required." },
    todo: { name: "Reechgarh guided walk", area: "Forest circuit", vibe: "Rock passages, forest shade, and active terrain.", whyGo: "A physical, landscape-first Pachmarhi experience.", genZHook: "Real shoes. Real cave. No studio fog.", bestTime: "Morning with registered guide." }
  },
  {
    city: "Maheshwar",
    restaurant: { name: "Ghat-side Malwa breakfast", area: "Bazaar-ghat lane", vibe: "Poha, tea, temple bells, and early river movement.", whyGo: "A compact start before the fort and looms.", genZHook: "Breakfast before the saree decisions get serious.", bestTime: "07:00-09:00." },
    local: { name: "Handloom workshop visit", area: "Weaver neighbourhood", vibe: "Yarn, border design, loom rhythm, and skilled household production.", whyGo: "It makes Maheshwari textiles understandable and worth valuing.", genZHook: "The making-of is better than the haul.", bestTime: "Late morning; arrange respectfully." },
    famous: { name: "Ahilya Fort and ghats", area: "Narmada riverfront", vibe: "Stone, civic memory, temples, and wide river views.", whyGo: "The fort-river relationship defines Maheshwar.", genZHook: "Architecture with governance lore and a view.", bestTime: "Early morning." },
    todo: { name: "Narmada evening boat and aarti", area: "Main ghats", vibe: "Low river light, carved steps, and devotional sound.", whyGo: "A calm close when boating conditions allow.", genZHook: "Soft launch your peaceful era.", bestTime: "Before sunset; verify boat service." }
  },
  {
    city: "Lucknow",
    restaurant: { name: "Chowk Awadhi tasting walk", area: "Chowk", vibe: "Kebabs, breads, sweets, and kitchens with strong reputations.", whyGo: "Small portions reveal more than one oversized plate.", genZHook: "Build a tasting flight, not a food coma.", bestTime: "Early evening.", searchQuery: "best Awadhi food Chowk Lucknow" },
    local: { name: "Chikankari maker conversation", area: "Chowk", vibe: "Needlework, fabric, hand-skill, and the truth behind price differences.", whyGo: "It separates hand craft from machine imitation.", genZHook: "Know the labour before posting the fit.", bestTime: "Late morning.", searchQuery: "authentic hand chikankari shops Chowk Lucknow" },
    famous: { name: "Bara Imambara and Bhool Bhulaiya", area: "Husainabad", vibe: "Monumental halls, rooftop geometry, and Shia heritage.", whyGo: "It is the architectural anchor of old Lucknow.", genZHook: "The maze is fun; the history is the actual flex.", bestTime: "Opening time." },
    todo: { name: "Husainabad-to-Chowk culture route", area: "Old Lucknow", vibe: "Gateways, memorials, craft, food, and living lanes.", whyGo: "It keeps the day's best stops in one coherent cluster.", genZHook: "No cross-city cab montage required.", bestTime: "Morning heritage, evening food." }
  },
  {
    city: "Mathura",
    restaurant: { name: "Mathura peda and kachori breakfast", area: "Old city", vibe: "Fast counters, temple traffic, and intensely local sweets.", whyGo: "A compact Braj food start before secure temple entry.", genZHook: "Sugar, spice, and no brunch reservation.", bestTime: "07:00-09:00." },
    local: { name: "Mathura Museum sculpture hour", area: "Museum precinct", vibe: "Stone, iconography, coins, and several religious histories.", whyGo: "It adds depth beyond the pilgrimage headline.", genZHook: "Receipts that the city has always been layered.", bestTime: "Late morning; verify closure." },
    famous: { name: "Shri Krishna Janmabhoomi", area: "Janmabhoomi precinct", vibe: "Major pilgrimage, security-led movement, and deep devotional focus.", whyGo: "It is central to Mathura's living sacred identity.", genZHook: "Travel light. Presence over phone storage.", bestTime: "Early morning; verify darshan rules." },
    todo: { name: "Vishram Ghat evening loop", area: "Yamuna riverfront", vibe: "Boats, temple lanes, lamps, and old Mathura at dusk.", whyGo: "It connects the city to the Yamuna and Braj ritual life.", genZHook: "Golden-hour content with boundaries.", bestTime: "Before sunset through aarti." }
  },
  {
    city: "Vrindavan",
    restaurant: { name: "Raman Reti sattvik food stop", area: "Raman Reti", vibe: "Simple vegetarian meals, sweets, and pilgrim-friendly timing.", whyGo: "A calm reset between temple crowds.", genZHook: "Your nervous system also deserves prasad-adjacent peace.", bestTime: "Lunch or early dinner." },
    local: { name: "Keshi Ghat dawn", area: "Old Vrindavan", vibe: "Yamuna light, heritage facades, boats, and a quieter devotional hour.", whyGo: "It reveals Vrindavan before its lanes reach full volume.", genZHook: "Soft light, softer voice.", bestTime: "Sunrise." },
    famous: { name: "Banke Bihari Temple", area: "Old lanes", vibe: "Intense darshan flow, music, flowers, and tightly managed movement.", whyGo: "It is one of Vrindavan's defining living temples.", genZHook: "Keep the phone secure and the expectations flexible.", bestTime: "Verify seasonal darshan schedule." },
    todo: { name: "Two-temple, one-ghat route", area: "Vrindavan core", vibe: "Focused devotion without collecting twenty queues.", whyGo: "A small circuit protects energy and meaning.", genZHook: "Curation beats temple-tab overload.", bestTime: "Early morning or split with evening." }
  },
  {
    city: "Kanpur",
    restaurant: { name: "Swaroop Nagar food hop", area: "Swaroop Nagar", vibe: "Student-friendly cafes, north Indian snacks, and modern city energy.", whyGo: "An easy refuel near hospitals and central routes.", genZHook: "Campus-city comfort without pretending Kanpur is Goa.", bestTime: "Late afternoon." },
    local: { name: "Ganga Barrage breeze stop", area: "Ganga Barrage", vibe: "River air, popular snacks, bikes, and a wide evening horizon.", whyGo: "It is the city's most accessible after-work reset.", genZHook: "Helmet on, sunset on, litter off.", bestTime: "Before sunset." },
    famous: { name: "Kanpur Memorial and 1857 context", area: "Cantonment", vibe: "Contested memory, colonial architecture, and a story requiring nuance.", whyGo: "It opens a conversation about the city's role in 1857.", genZHook: "History is complicated. That is the point.", bestTime: "Morning; verify access." },
    todo: { name: "Bithoor history and ghat half-day", area: "Bithoor", vibe: "Ganga ghats, sacred sites, and 1857-era associations outside the city.", whyGo: "It gives Kanpur's river and historical geography room.", genZHook: "One proper half-day, not a rushed location dump.", bestTime: "Morning with fixed return." }
  },
  {
    city: "Jhansi",
    restaurant: { name: "Bundeli lunch near Sadar", area: "Sadar Bazaar", vibe: "Regional flavours, practical portions, and central-city bustle.", whyGo: "A local pause between fort and museum.", genZHook: "Eat local before the Orchha cab arrives.", bestTime: "Lunch.", searchQuery: "Bundeli food Jhansi Sadar Bazaar" },
    local: { name: "Government Museum deep dive", area: "Museum precinct", vibe: "Weapons, manuscripts, coins, sculpture, and Bundelkhand context.", whyGo: "It expands the timeline beyond one heroic chapter.", genZHook: "The lore has footnotes, finally.", bestTime: "Late morning; verify closure." },
    famous: { name: "Jhansi Fort", area: "Fort hill", vibe: "1857 memory, heavy walls, views, and exposed stone.", whyGo: "It is the city's defining historic landscape.", genZHook: "Fort-core, but read before posing.", bestTime: "Opening time." },
    todo: { name: "Fort, Rani Mahal, museum loop", area: "Jhansi core", vibe: "A coherent half-day through resistance and regional history.", whyGo: "It makes Jhansi a destination before the transfer.", genZHook: "Your train interchange just got a plot.", bestTime: "Morning." }
  },
  {
    city: "Chitrakoot",
    restaurant: { name: "Ram Ghat sattvik meal", area: "Ram Ghat", vibe: "Simple pilgrim food, tea, and a needed pause from movement.", whyGo: "A practical refuel near the core riverfront.", genZHook: "Low drama, high recovery.", bestTime: "Lunch or early dinner." },
    local: { name: "Mandakini dawn walk", area: "Ram Ghat", vibe: "Boats, bells, morning worship, and soft Vindhya light.", whyGo: "It shows the town before pilgrimage volume rises.", genZHook: "Quiet content, quieter camera.", bestTime: "Sunrise." },
    famous: { name: "Kamadgiri parikrama", area: "Kamadgiri", vibe: "A five-kilometre sacred walking circuit with continuous temple life.", whyGo: "It is central to Chitrakoot's devotional geography.", genZHook: "This is practice, not a step-count challenge.", bestTime: "Early morning; assess fitness." },
    todo: { name: "Hanuman Dhara hill visit", area: "Devangana", vibe: "Steps, ropeway, hillside shrine, and wide views.", whyGo: "It combines sacred context with the Vindhya landscape.", genZHook: "Choose ropeway or steps based on reality, not ego.", bestTime: "Morning; verify ropeway." }
  },
  {
    city: "Kochi",
    restaurant: { name: "Fort Kochi seafood and appam stop", area: "Fort Kochi", vibe: "Coastal Kerala plates, heritage streets, and cafe spillover.", whyGo: "A route-friendly meal between waterfront and Mattancherry.", genZHook: "Order local before another cold coffee appears.", bestTime: "Lunch.", searchQuery: "best Kerala seafood appam Fort Kochi" },
    local: { name: "Fort Kochi ferry arrival", area: "Fort Kochi", vibe: "Harbour wind, commuters, ships, and the city changing shores.", whyGo: "The ferry makes Kochi's geography instantly understandable.", genZHook: "Public transport with cinematic harbour credits.", bestTime: "Morning or sunset commute." },
    famous: { name: "Mattancherry heritage lanes", area: "Mattancherry", vibe: "Spice trade, palace history, synagogue precinct, and working shops.", whyGo: "It holds several of Kochi's maritime histories close together.", genZHook: "Layered history, no theme-park filter.", bestTime: "Morning; check worship-site hours." },
    todo: { name: "Ferry-led two-shore day", area: "Fort Kochi to Ernakulam", vibe: "Heritage, harbour travel, mainland food, and fewer bridge delays.", whyGo: "It uses the city's best transport as part of the plan.", genZHook: "Route planning that understood the assignment.", bestTime: "Full or split day; verify ferry times." }
  },
  {
    city: "Thiruvananthapuram",
    restaurant: { name: "Palayam Kerala meals stop", area: "Palayam", vibe: "Banana-leaf meals, mixed neighbourhood energy, and capital-city pace.", whyGo: "A practical cultural lunch near central institutions.", genZHook: "The plate has better project management than most apps.", bestTime: "Lunch." },
    local: { name: "Kanaka Kunnu evening", area: "Museum grounds", vibe: "Trees, cultural programming, walkers, and a relaxed capital mood.", whyGo: "It is an easy public-space reset after museums.", genZHook: "Park walk with possible live-culture bonus.", bestTime: "Late afternoon; check events." },
    famous: { name: "Sree Padmanabhaswamy precinct", area: "East Fort", vibe: "Sacred architecture, strict access, and the historic heart of the city.", whyGo: "It is central to Thiruvananthapuram's identity and name.", genZHook: "Research the rules before planning the fit.", bestTime: "Early morning; verify eligibility and dress." },
    todo: { name: "Museum, market, and East Fort route", area: "Central Thiruvananthapuram", vibe: "Art, public gardens, plural city life, and sacred history.", whyGo: "It gives the capital a coherent city day before the coast.", genZHook: "Culture stack without a three-hour cab spiral.", bestTime: "Morning to late afternoon." }
  },
  {
    city: "Munnar",
    restaurant: { name: "Munnar market tea and snack stop", area: "Munnar town", vibe: "Hot tea, local produce, traffic, and a practical hill-town centre.", whyGo: "It grounds the plantation landscape in everyday town life.", genZHook: "Tea before the tea-viewpoint discourse.", bestTime: "Morning or late afternoon." },
    local: { name: "Tea Museum context stop", area: "Nallathanni side", vibe: "Processing, plantation history, and a more informed cup.", whyGo: "It explains what covers the hills around you.", genZHook: "Origin story for the beverage carrying the trip.", bestTime: "Late morning; verify closure." },
    famous: { name: "Top Station corridor", area: "Top Station road", vibe: "High views, winding travel, cloud drama, and long distances.", whyGo: "It is the classic high-altitude Munnar route when visibility works.", genZHook: "The cloud may ghost you. Plan anyway, flexibly.", bestTime: "Early morning; check road." },
    todo: { name: "One-corridor tea landscape day", area: "Munnar region", vibe: "Fewer stops, better light, less vehicle fatigue.", whyGo: "It respects mountain distance and weather.", genZHook: "Anti-pin-hopping. Pro actual memory.", bestTime: "Start early." }
  },
  {
    city: "Alappuzha",
    restaurant: { name: "Canal-side Kerala lunch", area: "Alappuzha town", vibe: "Fish curry, rice, local service, and no boat-package performance.", whyGo: "A grounded meal between water routes.", genZHook: "Eat where the ferry commuters eat.", bestTime: "Lunch." },
    local: { name: "Public ferry backwater ride", area: "Town jetty", vibe: "Commuters, canals, farms, and real water transport.", whyGo: "It reveals backwater life at low cost.", genZHook: "The best-value scenic transport in the chat.", bestTime: "Morning; verify timetable." },
    famous: { name: "Kuttanad water landscape", area: "Kuttanad route", vibe: "Paddy fields, canals, village life, and below-sea-level farming.", whyGo: "It gives the backwater scenery economic and human context.", genZHook: "Not just palms. A whole water-based system.", bestTime: "Morning or late afternoon." },
    todo: { name: "Inspect-and-book short shikara", area: "Finishing Point", vibe: "Close-to-water travel without a full houseboat commitment.", whyGo: "It suits a half-day and makes safety easier to inspect.", genZHook: "Commitment-light, scenery-heavy.", bestTime: "Morning; confirm licence and jackets." }
  },
  {
    city: "Kozhikode",
    restaurant: { name: "Malabar tasting table", area: "Central Kozhikode", vibe: "Biryani, pathiri, seafood, snacks, and layered coastal flavour.", whyGo: "Food is one of the clearest ways to read the city.", genZHook: "Bring friends. Order breadth.", bestTime: "Lunch or early dinner.", searchQuery: "best Malabar food Kozhikode" },
    local: { name: "SM Street halwa walk", area: "SM Street", vibe: "Old trade lane, sweets, textiles, and dense central-city movement.", whyGo: "It connects commerce to Kozhikode's famous appetite.", genZHook: "Taste test, but with pedestrian awareness.", bestTime: "Late morning or early evening." },
    famous: { name: "Beypore uru heritage", area: "Beypore", vibe: "Wooden vessel craft, harbour history, and a working maritime edge.", whyGo: "It links Malabar to Indian Ocean trade traditions.", genZHook: "Boatbuilding before boats were lifestyle content.", bestTime: "Morning; verify yard access." },
    todo: { name: "Mananchira-to-beach city loop", area: "Kozhikode core", vibe: "Libraries, public space, old streets, snacks, and sunset.", whyGo: "A low-friction route through the city's public personality.", genZHook: "Books to beach with snacks in between.", bestTime: "Late afternoon." }
  },
  {
    city: "Wayanad",
    restaurant: { name: "Wayanad Malabar meal", area: "Kalpetta", vibe: "Regional rice, curries, local produce, and trail-day fuel.", whyGo: "It keeps food close to the district's farming identity.", genZHook: "Eat for the hike, not for the overhead shot.", bestTime: "Lunch." },
    local: { name: "Paddy-country morning drive", area: "Kalpetta outskirts", vibe: "Mist, fields, village roads, and agricultural rhythm.", whyGo: "It shows Wayanad beyond resort gates.", genZHook: "Slow drive, no blind-curve parking.", bestTime: "Early morning." },
    famous: { name: "Edakkal Caves", area: "Ambukuthi hills", vibe: "Rock engravings, steep approach, history, and regulated access.", whyGo: "It is a major archaeological experience in the district.", genZHook: "The climb is part of the receipt.", bestTime: "Opening time; verify tickets." },
    todo: { name: "One-cluster responsible trail day", area: "Wayanad district", vibe: "Permits, forest, weather, and a plan that avoids excessive driving.", whyGo: "It protects both the traveller and the landscape.", genZHook: "Two real experiences beat eight car-window pins.", bestTime: "Start early with accredited operator." }
  },
  {
    city: "Varkala",
    restaurant: { name: "Cliff breakfast with Kerala flavours", area: "North Cliff", vibe: "Sea view, appam options, traveller energy, and a slow start.", whyGo: "It fits naturally after the safest morning beach hour.", genZHook: "A view, yes. Also order something local.", bestTime: "08:00-10:00." },
    local: { name: "South Cliff quiet walk", area: "South Cliff", vibe: "Less commercial paths, sea air, and a slower Varkala mood.", whyGo: "It offers breathing room beyond the busiest cafe strip.", genZHook: "The quieter side of your coastal era.", bestTime: "Morning or before sunset; obey barriers." },
    famous: { name: "Papanasam Beach", area: "Central Varkala", vibe: "Sacred coastal context, swimming zone, and high visitor volume.", whyGo: "It is central to both Varkala's pilgrimage and beach identity.", genZHook: "Read the sea flag before the vibe.", bestTime: "Morning; follow lifeguards." },
    todo: { name: "Cliff-to-temple context route", area: "Varkala core", vibe: "Cafe leisure, coastal geology, pilgrimage, and town life.", whyGo: "It prevents Varkala from becoming only a sunset strip.", genZHook: "Two moods, one respectful walk.", bestTime: "Split between morning and dusk." }
  }
];

function toExperience(city: string, kind: ExperienceKind, item: ExperienceSeed): CityExperience {
  return {
    city,
    kind,
    ...item,
    contactHint: liveContact,
    imageTopic: `${item.name} ${city}`
  };
}

export const regionalCityExperiences = seeds.flatMap((seed) =>
  (["restaurant", "local", "famous", "todo"] as const).map((kind) => toExperience(seed.city, kind, seed[kind]))
);
