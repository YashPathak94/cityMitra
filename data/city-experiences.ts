import { expandedCityExperiences } from "@/data/expanded-city-experiences";
import { regionalCityExperiences } from "@/data/regional-city-experiences";

export type ExperienceKind = "restaurant" | "local" | "famous" | "todo";

export type CityExperience = {
  name: string;
  city: string;
  kind: ExperienceKind;
  area: string;
  vibe: string;
  whyGo: string;
  genZHook: string;
  bestTime: string;
  contactHint: string;
  searchQuery?: string;
  imageTopic?: string;
};

const liveContact = "Open the live Maps listing for current phone, hours, menu, photos, and directions.";

export const cityExperiences: CityExperience[] = [
  {
    name: "Karim's Jama Masjid",
    city: "Delhi",
    kind: "restaurant",
    area: "Old Delhi",
    vibe: "Old-school Mughlai, no-frills, heavy on history.",
    whyGo: "Go when you want the classic kebab-korma lane experience after a Chandni Chowk market run.",
    genZHook: "Bring friends, order family-style, and let the table look chaotic in the best possible way.",
    bestTime: "Late lunch or early dinner before the old-city lanes choke.",
    contactHint: liveContact,
    imageTopic: "Jama Masjid Old Delhi food"
  },
  {
    name: "Lodhi Art District",
    city: "Delhi",
    kind: "local",
    area: "Lodhi Colony",
    vibe: "Open-air murals, coffee detours, and low-effort photo walks.",
    whyGo: "A calm break from market intensity; works well before Khan Market or India Habitat Centre.",
    genZHook: "Free content walk. The background budget is zero, the photo output is not.",
    bestTime: "Golden hour, especially on cooler months.",
    contactHint: "Public area. Use Maps for current route and nearby cafe contacts.",
    imageTopic: "Lodhi Art District murals"
  },
  {
    name: "India Gate lawns",
    city: "Delhi",
    kind: "famous",
    area: "Central Delhi",
    vibe: "Iconic city evening with families, lights, and wide boulevards.",
    whyGo: "Pair with Kartavya Path, museums, or a central Delhi dinner plan.",
    genZHook: "Best for chill walking reels, night photos, and low-cost hangout energy.",
    bestTime: "After sunset; avoid peak summer afternoons.",
    contactHint: "Public monument zone. Check Maps for parking and traffic closures.",
    imageTopic: "India Gate Delhi"
  },
  {
    name: "Nehru Place parts hunt",
    city: "Delhi",
    kind: "todo",
    area: "Nehru Place",
    vibe: "Laptop repairs, accessories, components, and quick comparison shopping.",
    whyGo: "Useful for urgent tech fixes or price-checking before buying online.",
    genZHook: "Perfect when your charger dies and your group chat starts giving terrible advice.",
    bestTime: "Weekday late morning.",
    contactHint: liveContact,
    searchQuery: "Nehru Place computer repair shops Delhi",
    imageTopic: "Nehru Place Delhi electronics market"
  },
  {
    name: "Britannia & Co.",
    city: "Mumbai",
    kind: "restaurant",
    area: "Ballard Estate",
    vibe: "Parsi heritage dining with a time-capsule feel.",
    whyGo: "A strong lunch anchor if your day is around Fort, Colaba, or Crawford Market.",
    genZHook: "Old Bombay energy, berry pulao fame, and interiors that do not need a filter.",
    bestTime: "Lunch; check current operating days before leaving.",
    contactHint: liveContact,
    imageTopic: "Ballard Estate Mumbai restaurant"
  },
  {
    name: "Bandra Bandstand walk",
    city: "Mumbai",
    kind: "local",
    area: "Bandra West",
    vibe: "Sea breeze, street snacks, celebrity-home curiosity, and sunset crowds.",
    whyGo: "A low-cost evening reset after Linking Road or Hill Road shopping.",
    genZHook: "The city gives you a free main-character walk; just do not block the promenade.",
    bestTime: "Sunset, outside monsoon downpours.",
    contactHint: "Public promenade. Use Maps for route, parking, and nearby cafes.",
    imageTopic: "Bandra Bandstand Mumbai"
  },
  {
    name: "Gateway of India",
    city: "Mumbai",
    kind: "famous",
    area: "Colaba",
    vibe: "Mumbai postcard, ferry energy, and heritage hotel backdrop.",
    whyGo: "Works as a starting point for Colaba Causeway, Kala Ghoda, and Fort walks.",
    genZHook: "Touristy, yes. Still undefeated for first-Mumbai photos.",
    bestTime: "Morning for fewer crowds; evening for atmosphere.",
    contactHint: "Public monument zone. Check ferry counters locally for boat timings.",
    imageTopic: "Gateway of India Mumbai"
  },
  {
    name: "Kala Ghoda gallery crawl",
    city: "Mumbai",
    kind: "todo",
    area: "Fort",
    vibe: "Art galleries, cafes, museums, and walkable heritage streets.",
    whyGo: "Best when you want culture without travelling across suburbs.",
    genZHook: "Aesthetic streets, strong coffee options, and less basic than another mall plan.",
    bestTime: "Late morning to early evening.",
    contactHint: liveContact,
    searchQuery: "Kala Ghoda art galleries Mumbai"
  },
  {
    name: "Vidyarthi Bhavan",
    city: "Bengaluru",
    kind: "restaurant",
    area: "Basavanagudi",
    vibe: "Legendary dosa stop with old Bengaluru rhythm.",
    whyGo: "A breakfast anchor before Gandhi Bazaar, Lalbagh, or old-city shopping.",
    genZHook: "Stacked dosa plates, fast service, and the kind of hype that actually survived decades.",
    bestTime: "Breakfast; expect queues.",
    contactHint: liveContact,
    imageTopic: "Basavanagudi Bengaluru dosa"
  },
  {
    name: "Church Street",
    city: "Bengaluru",
    kind: "local",
    area: "Central Bengaluru",
    vibe: "Bookstores, cafes, street energy, and casual date-plan safety.",
    whyGo: "Easy to combine with MG Road metro, Cubbon Park, or Brigade Road.",
    genZHook: "The default 'where should we meet?' answer that rarely fails.",
    bestTime: "Evening on weekdays; weekends are busier.",
    contactHint: "Open street. Use Maps for current cafe contacts and events.",
    imageTopic: "Church Street Bengaluru"
  },
  {
    name: "Lalbagh Botanical Garden",
    city: "Bengaluru",
    kind: "famous",
    area: "Mavalli",
    vibe: "Green lungs, morning walks, flower shows, and glasshouse views.",
    whyGo: "A calm reset before market-heavy days.",
    genZHook: "Soft-life morning plan that does not require spending like it is payday.",
    bestTime: "Early morning or late afternoon.",
    contactHint: "Check official/Maps listing for current entry timings and event dates.",
    imageTopic: "Lalbagh Botanical Garden Bengaluru"
  },
  {
    name: "Indiranagar cafe hop",
    city: "Bengaluru",
    kind: "todo",
    area: "Indiranagar",
    vibe: "Cafes, boutiques, breweries, and walkable evening clusters.",
    whyGo: "Good for groups who want options without splitting across the city.",
    genZHook: "Pick one lane, not twelve tabs. Your cab bill will thank you.",
    bestTime: "Evening; reserve for popular dinner spots.",
    contactHint: liveContact,
    searchQuery: "Indiranagar cafes Bengaluru"
  },
  {
    name: "Laxmi Misthan Bhandar",
    city: "Jaipur",
    kind: "restaurant",
    area: "Johari Bazaar",
    vibe: "Classic sweets, thali, and old-city dining in one stop.",
    whyGo: "A practical food anchor while shopping in the walled city.",
    genZHook: "Come for the thali, leave with sweets you said you were not buying.",
    bestTime: "Lunch or early evening.",
    contactHint: liveContact,
    imageTopic: "Jaipur LMB Johari Bazaar"
  },
  {
    name: "Nahargarh sunset point",
    city: "Jaipur",
    kind: "local",
    area: "Aravalli ridge",
    vibe: "Fort walls, city views, and golden-hour drama.",
    whyGo: "The best visual payoff after a bazaar or fort circuit.",
    genZHook: "Sunset content with actual altitude. Respect the edge, obviously.",
    bestTime: "Reach 45 minutes before sunset.",
    contactHint: "Check Maps for route, entry timing, and return cab availability.",
    imageTopic: "Nahargarh Fort Jaipur sunset"
  },
  {
    name: "Hawa Mahal",
    city: "Jaipur",
    kind: "famous",
    area: "Badi Choupad",
    vibe: "Pink City icon with fast-moving photo crowds.",
    whyGo: "Pair it with City Palace, Jantar Mantar, and Johari Bazaar in one walk.",
    genZHook: "The photo is famous because it works. Go early and claim the frame.",
    bestTime: "Morning light.",
    contactHint: "Check official/Maps listing for current ticket timing.",
    imageTopic: "Hawa Mahal Jaipur"
  },
  {
    name: "Block-print workshop run",
    city: "Jaipur",
    kind: "todo",
    area: "Sanganer or Bagru",
    vibe: "Hands-on textile craft, dye tables, and source-level shopping.",
    whyGo: "A better story than buying the same print from a tourist lane.",
    genZHook: "Make the souvenir part of the day, not just the checkout.",
    bestTime: "Morning; confirm workshop availability first.",
    contactHint: liveContact,
    searchQuery: "block printing workshop Sanganer Jaipur"
  },
  {
    name: "Locho breakfast trail",
    city: "Surat",
    kind: "restaurant",
    area: "Citywide morning stalls",
    vibe: "Surti snack culture at its most local.",
    whyGo: "A cheap, quick way to understand Surat before textile shopping.",
    genZHook: "Soft, spicy, chaotic, photogenic enough, and impossible to explain properly.",
    bestTime: "Morning before popular stalls sell out.",
    contactHint: liveContact,
    searchQuery: "best locho in Surat"
  },
  {
    name: "Dumas Road evening",
    city: "Surat",
    kind: "local",
    area: "Dumas Road",
    vibe: "Food runs, seaside drives, and late-evening hangouts.",
    whyGo: "A relaxed counterweight to Ring Road's wholesale intensity.",
    genZHook: "Market day detox with snacks, sea air, and group-drive energy.",
    bestTime: "Evening.",
    contactHint: "Use Maps for current food stalls, parking, and route traffic.",
    imageTopic: "Dumas Road Surat"
  },
  {
    name: "Dutch Garden",
    city: "Surat",
    kind: "famous",
    area: "Nanpura",
    vibe: "Colonial-era garden stop near older city routes.",
    whyGo: "Short, calm, and easy to pair with city shopping.",
    genZHook: "Not every plan needs to be a mega attraction. Sometimes a breather wins.",
    bestTime: "Morning or late afternoon.",
    contactHint: "Check Maps for current public access and timings.",
    imageTopic: "Dutch Garden Surat"
  },
  {
    name: "Ring Road textile comparison",
    city: "Surat",
    kind: "todo",
    area: "Ring Road",
    vibe: "Fabric, sarees, bulk buying, and real trade movement.",
    whyGo: "The useful way to buy is comparing buildings, not just shops.",
    genZHook: "Main-character shopping, wholesale edition.",
    bestTime: "Weekday late morning.",
    contactHint: liveContact,
    searchQuery: "Ring Road textile market Surat"
  },
  {
    name: "Shah Ghouse or Shadab biryani run",
    city: "Hyderabad",
    kind: "restaurant",
    area: "Old City / Tolichowki",
    vibe: "Biryani-first, reputation-heavy, crowd-approved.",
    whyGo: "A proper food stop after Charminar, Golconda, or old-city shopping.",
    genZHook: "Do not ask 'best biryani' unless you are ready for a debate. Start here.",
    bestTime: "Lunch or early dinner.",
    contactHint: liveContact,
    searchQuery: "Shah Ghouse Shadab biryani Hyderabad"
  },
  {
    name: "Durgam Cheruvu bridge",
    city: "Hyderabad",
    kind: "local",
    area: "Madhapur",
    vibe: "Lake bridge, city lights, and easy HITEC-side evening walks.",
    whyGo: "Useful if your stay is near business districts and you want a quick scenic stop.",
    genZHook: "Low-effort night photos without crossing into old-city traffic.",
    bestTime: "After sunset.",
    contactHint: "Public area. Use Maps for traffic and parking.",
    imageTopic: "Durgam Cheruvu Hyderabad bridge"
  },
  {
    name: "Charminar",
    city: "Hyderabad",
    kind: "famous",
    area: "Old City",
    vibe: "Monument, bangles, pearls, street food, and city identity.",
    whyGo: "The anchor for Laad Bazaar, Pathergatti pearls, and old-city snacks.",
    genZHook: "Iconic for a reason. Go early if you want photos without traffic chaos.",
    bestTime: "Morning or dusk.",
    contactHint: "Check official/Maps listing for current access and ticket details.",
    imageTopic: "Charminar Hyderabad"
  },
  {
    name: "Laad Bazaar bangle hunt",
    city: "Hyderabad",
    kind: "todo",
    area: "Charminar",
    vibe: "Colour, bridal shopping, bargaining, and tight lanes.",
    whyGo: "Great for wedding shopping or one focused souvenir category.",
    genZHook: "A colour explosion. Keep one hand free and your bargaining face ready.",
    bestTime: "Late morning before evening crowd.",
    contactHint: liveContact,
    searchQuery: "Laad Bazaar bangles Hyderabad"
  },
  {
    name: "The Tibetan Kitchen",
    city: "Leh",
    kind: "restaurant",
    area: "Fort Road / Main Bazaar side",
    vibe: "Comfort food, momos, thukpa, and traveller-table energy.",
    whyGo: "Works after an acclimatisation walk when you need simple, warm food.",
    genZHook: "The meal your altitude-hit body quietly asked for.",
    bestTime: "Early dinner; confirm seasonal opening.",
    contactHint: liveContact,
    imageTopic: "Leh Tibetan restaurant"
  },
  {
    name: "Shanti Stupa sunset",
    city: "Leh",
    kind: "local",
    area: "Changspa ridge",
    vibe: "White stupa, mountain views, and slow high-altitude breathing.",
    whyGo: "A manageable local outing after acclimatisation.",
    genZHook: "Sunset with mountain layers. Walk slow; ego is not oxygen.",
    bestTime: "Sunset after a rest day.",
    contactHint: "Check Maps for route and seasonal access.",
    imageTopic: "Shanti Stupa Leh"
  },
  {
    name: "Leh Palace",
    city: "Leh",
    kind: "famous",
    area: "Old Town",
    vibe: "Heritage climb, old-town views, and valley photos.",
    whyGo: "A close-to-town history stop before bigger monastery day trips.",
    genZHook: "Views without committing to a brutal first-day road trip.",
    bestTime: "Morning or late afternoon.",
    contactHint: "Check official/Maps listing for current entry timings.",
    imageTopic: "Leh Palace"
  },
  {
    name: "Main Bazaar acclimatisation walk",
    city: "Leh",
    kind: "todo",
    area: "Main Bazaar",
    vibe: "Supplies, cafes, apricot products, woollens, and travel-agent checks.",
    whyGo: "The smartest first-day activity because it keeps you near services.",
    genZHook: "Shopping as altitude strategy. That is not a joke here.",
    bestTime: "First evening, slowly.",
    contactHint: liveContact,
    searchQuery: "Leh Main Bazaar cafes travel agents"
  },
  {
    name: "El Chico",
    city: "Prayagraj",
    kind: "restaurant",
    area: "Civil Lines",
    vibe: "Old favourite, bakery energy, and family-safe dining.",
    whyGo: "Reliable when you need a calm stop after Sangam or old-city lanes.",
    genZHook: "A retro Civil Lines anchor when your group cannot decide cuisine.",
    bestTime: "Lunch or dinner.",
    contactHint: liveContact,
    imageTopic: "Civil Lines Prayagraj restaurant"
  },
  {
    name: "Civil Lines coffee walk",
    city: "Prayagraj",
    kind: "local",
    area: "Civil Lines",
    vibe: "University-town calm, bookstores, bakeries, and broad roads.",
    whyGo: "A decompression zone after ghats, Chowk, or Mela routes.",
    genZHook: "Low-key, walkable, and not trying too hard. Rare combo.",
    bestTime: "Late afternoon.",
    contactHint: "Use Maps for current cafes and bookstores.",
    imageTopic: "Civil Lines Prayagraj"
  },
  {
    name: "Triveni Sangam",
    city: "Prayagraj",
    kind: "famous",
    area: "Sangam",
    vibe: "Pilgrimage, boats, sunrise mist, and massive festival logistics.",
    whyGo: "The city’s defining experience and the route anchor for first-timers.",
    genZHook: "Go at dawn if you want the calm version, not the queue version.",
    bestTime: "Sunrise.",
    contactHint: "Fix boat price locally; use Maps for current access routes.",
    imageTopic: "Triveni Sangam Prayagraj"
  },
  {
    name: "Anand Bhavan plus Company Garden",
    city: "Prayagraj",
    kind: "todo",
    area: "Tagore Town / Civil Lines",
    vibe: "History, gardens, and a calmer afternoon route.",
    whyGo: "A useful non-ghat plan when heat or crowds change the day.",
    genZHook: "The backup plan that does not feel like a downgrade.",
    bestTime: "Late morning or winter afternoon.",
    contactHint: "Check Maps/official listing for current museum timings.",
    imageTopic: "Anand Bhavan Prayagraj"
  },
  {
    name: "Kashi Chaat Bhandar",
    city: "Varanasi",
    kind: "restaurant",
    area: "Godowlia",
    vibe: "Fast, famous, tangy street-food stop near the old-city action.",
    whyGo: "A practical food anchor between temple lanes and ghat walks.",
    genZHook: "Tiny plates, big opinions, and a queue that moves faster than your indecision.",
    bestTime: "Evening before or after ghat plans.",
    contactHint: liveContact,
    imageTopic: "Varanasi chaat Godowlia"
  },
  {
    name: "Assi Ghat mornings",
    city: "Varanasi",
    kind: "local",
    area: "Assi",
    vibe: "Yoga, tea, sunrise boats, and calmer cafe lanes.",
    whyGo: "A softer entry point than the busiest ghats.",
    genZHook: "Main-character sunrise without the peak Dashashwamedh crush.",
    bestTime: "Sunrise.",
    contactHint: "Public ghat. Use Maps for boat points and nearby cafes.",
    imageTopic: "Assi Ghat Varanasi sunrise"
  },
  {
    name: "Dashashwamedh Ghat",
    city: "Varanasi",
    kind: "famous",
    area: "Old City",
    vibe: "Evening aarti, boats, bells, and full sensory overload.",
    whyGo: "The signature Varanasi evening experience.",
    genZHook: "Crowded, intense, unforgettable. Keep your phone secure and your expectations open.",
    bestTime: "Arrive 45 minutes before aarti.",
    contactHint: "Public ghat. Use Maps for access and boat contacts.",
    imageTopic: "Dashashwamedh Ghat Varanasi"
  },
  {
    name: "Banarasi silk authenticity walk",
    city: "Varanasi",
    kind: "todo",
    area: "Chowk / Sarai Mohana",
    vibe: "Looms, silk houses, bargaining, and authenticity checks.",
    whyGo: "Useful if you want a real Banarasi purchase instead of a tourist-lane shortcut.",
    genZHook: "The flex is knowing the weave, not just wearing the saree.",
    bestTime: "Late morning.",
    contactHint: liveContact,
    searchQuery: "Banarasi silk handloom shops Sarai Mohana Varanasi"
  },
  {
    name: "Sarafa Bazaar food night",
    city: "Indore",
    kind: "restaurant",
    area: "Sarafa",
    vibe: "Jewellery market by day, street-food carnival by night.",
    whyGo: "The most Indore way to eat dinner without choosing one restaurant.",
    genZHook: "Snack crawl energy. Your camera eats first, then you do.",
    bestTime: "After 9 pm.",
    contactHint: "Open market. Use Maps for current crowd and route.",
    imageTopic: "Sarafa Bazaar Indore food"
  },
  {
    name: "Chappan Dukan",
    city: "Indore",
    kind: "local",
    area: "New Palasia",
    vibe: "56-shop snack strip with family and friend-group energy.",
    whyGo: "Daytime food plan that is easier to manage than Sarafa.",
    genZHook: "When nobody agrees on food, this place wins by having too many answers.",
    bestTime: "Evening or late afternoon.",
    contactHint: "Open food street. Use Maps for individual shop contacts.",
    imageTopic: "Chappan Dukan Indore"
  },
  {
    name: "Rajwada Palace",
    city: "Indore",
    kind: "famous",
    area: "Old Indore",
    vibe: "Holkar-era city anchor and old-market gateway.",
    whyGo: "Pairs naturally with cloth markets and old-city food.",
    genZHook: "A heritage stop that does not eat the whole day.",
    bestTime: "Morning or late afternoon.",
    contactHint: "Check Maps/official listing for current access and timings.",
    imageTopic: "Rajwada Palace Indore"
  },
  {
    name: "Ujjain day-trip from Indore",
    city: "Indore",
    kind: "todo",
    area: "Indore to Ujjain",
    vibe: "Temple day trip, early start, return for Indore food.",
    whyGo: "One of the easiest high-value add-ons from Indore.",
    genZHook: "Spiritual morning, snack-city evening. Balanced, somehow.",
    bestTime: "Start before sunrise for darshan.",
    contactHint: liveContact,
    searchQuery: "Indore to Ujjain Mahakaleshwar route"
  },
  {
    name: "Ram ki Paidi evening snacks",
    city: "Ayodhya",
    kind: "restaurant",
    area: "Ram ki Paidi",
    vibe: "Riverfront food, temple-town crowd, and evening light.",
    whyGo: "A gentle food plan after darshan routes.",
    genZHook: "Go for the riverfront mood; keep the food expectations simple and happy.",
    bestTime: "After sunset aarti.",
    contactHint: liveContact,
    searchQuery: "Ram ki Paidi food Ayodhya"
  },
  {
    name: "Saryu ghat sunset",
    city: "Ayodhya",
    kind: "local",
    area: "Naya Ghat",
    vibe: "Aarti, boats, lights, and slow riverfront walking.",
    whyGo: "The calmest counterpoint to queue-heavy temple hours.",
    genZHook: "Golden-hour faith-city frames, no overplanning needed.",
    bestTime: "Reach 30 minutes before sunset.",
    contactHint: "Public ghat. Use Maps for current access and boat points.",
    imageTopic: "Saryu Ghat Ayodhya"
  },
  {
    name: "Ram Mandir complex",
    city: "Ayodhya",
    kind: "famous",
    area: "Temple core",
    vibe: "Major pilgrimage route with security-led movement.",
    whyGo: "The central reason most visitors come to Ayodhya.",
    genZHook: "Plan light. The experience is the queue, the discipline, and the moment inside.",
    bestTime: "Early morning weekday slots.",
    contactHint: "Check official/Maps listing for darshan timing and rules.",
    imageTopic: "Ram Mandir Ayodhya"
  },
  {
    name: "Hanuman Garhi to Kanak Bhawan walk",
    city: "Ayodhya",
    kind: "todo",
    area: "Temple circuit",
    vibe: "Steps, darshan, sweets, and short old-town movement.",
    whyGo: "A tight route that respects temple order and avoids unnecessary backtracking.",
    genZHook: "Less random wandering, more meaningful stops.",
    bestTime: "Morning after main darshan.",
    contactHint: "Use Maps for current pedestrian routes and crowd status.",
    imageTopic: "Hanuman Garhi Ayodhya"
  },
  {
    name: "Pinch of Spice",
    city: "Agra",
    kind: "restaurant",
    area: "Civil Lines / Fatehabad Road",
    vibe: "Reliable North Indian dinner after monument hours.",
    whyGo: "A practical upgrade from highway buffet dining.",
    genZHook: "When the Taj day ends and everyone finally admits they are starving.",
    bestTime: "Dinner; reserve/check wait time on busy weekends.",
    contactHint: liveContact,
    imageTopic: "Agra restaurant dinner"
  },
  {
    name: "Tajganj rooftop view",
    city: "Agra",
    kind: "local",
    area: "Tajganj",
    vibe: "Rooftop cafes, monument views, and budget-traveller energy.",
    whyGo: "A slow breakfast or evening tea plan near the Taj gates.",
    genZHook: "The view does most of the work. Order something, sit, breathe.",
    bestTime: "Early morning after Taj visit or sunset.",
    contactHint: liveContact,
    searchQuery: "Tajganj rooftop cafe Agra Taj view"
  },
  {
    name: "Taj Mahal",
    city: "Agra",
    kind: "famous",
    area: "Tajganj",
    vibe: "World icon, sunrise light, and crowd-sensitive logistics.",
    whyGo: "The one place where timing changes the entire experience.",
    genZHook: "Yes, everyone has seen the photo. Go anyway. Sunrise wins.",
    bestTime: "Earliest slot; closed Fridays.",
    contactHint: "Check official ticketing/Maps listing for current entry rules.",
    imageTopic: "Taj Mahal Agra"
  },
  {
    name: "Mehtab Bagh sunset",
    city: "Agra",
    kind: "todo",
    area: "Across Yamuna",
    vibe: "Garden-side Taj view without the main complex rush.",
    whyGo: "A calm evening view if you are staying overnight.",
    genZHook: "The less obvious Taj angle. Still dramatic, less elbow traffic.",
    bestTime: "Sunset.",
    contactHint: "Check Maps/official listing for current entry timing.",
    imageTopic: "Mehtab Bagh Agra"
  },
  ...expandedCityExperiences,
  ...regionalCityExperiences
];

export function getCityExperiences(city: string) {
  return cityExperiences.filter((item) => item.city.toLowerCase() === city.toLowerCase());
}

export function experienceImageUrl(item: CityExperience) {
  const params = new URLSearchParams({
    city: item.city,
    topic: item.imageTopic || item.searchQuery || item.name
  });

  return `/api/city-image?${params.toString()}`;
}

export function experienceSearchQuery(item: CityExperience) {
  return item.searchQuery || `${item.name} ${item.city}`;
}
