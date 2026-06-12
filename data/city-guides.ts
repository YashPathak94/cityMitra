export type CityGuide = {
  slug: string;
  name: string;
  state: string;
  tagline: string;
  intro: string[];
  bestTime: string;
  gettingAround: string;
  budgetNote: string;
  keyAreas: Array<{ name: string; knownFor: string }>;
  tips: string[];
};

export const cityGuides: CityGuide[] = [
  {
    slug: "delhi",
    name: "Delhi",
    state: "Delhi NCR",
    tagline: "Wholesale capital, street food heavyweight, and a metro that actually saves your day.",
    intro: [
      "Delhi rewards people who plan by area, not by shop. The city is a cluster of trade neighbourhoods: Chandni Chowk and Sadar Bazaar for wholesale, Nehru Place for electronics, South Extension and Lajpat Nagar for fashion, and Khan Market for premium buys. Pick one cluster per half-day; crossing the city twice is how trips die in traffic.",
      "The metro is the single best decision you can make here. It connects nearly every commercial zone, skips the worst congestion, and drops you within walking distance of the main markets. Pair it with early starts: wholesale lanes are workable before noon and exhausting after."
    ],
    bestTime: "October to March. Avoid May–June heat and the worst smog weeks of November.",
    gettingAround: "Delhi Metro first, autos for the last kilometre. Park-and-ride beats driving into old city lanes.",
    budgetNote: "Street food and metro keep day costs low; wholesale buying needs cash plus UPI backup.",
    keyAreas: [
      { name: "Chandni Chowk", knownFor: "wedding goods, fabric, spices, and bulk wholesale lanes" },
      { name: "Nehru Place", knownFor: "computers, parts, repairs — Asia-scale electronics hub" },
      { name: "Sadar Bazaar", knownFor: "household goods and toys at wholesale volume" },
      { name: "South Extension", knownFor: "branded fashion, premium sarees, planned family shopping" },
      { name: "Karol Bagh", knownFor: "jewellery, mid-range shopping, and food in one stretch" }
    ],
    tips: [
      "Carry a bag with wheels for wholesale runs; rickshaw pickup points sit outside the densest lanes.",
      "Negotiate after checking three shops; first-lane prices are openers, not finals.",
      "Keep AIIMS/Max as hospital backups saved in Maps if travelling with family.",
      "Friday closures vary by market — check before a dedicated trip."
    ]
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    tagline: "Local trains, Lamington Road electronics, and street commerce that never sleeps.",
    intro: [
      "Mumbai runs on its local train spine, and your plan should too. Pick markets on the same line: Crawford Market and Zaveri Bazaar sit in the Fort belt, Lamington Road handles electronics and repairs near Grant Road, and Linking Road in Bandra covers fashion. Trying to mix lines at rush hour is the classic visitor mistake.",
      "The city is more forgiving at the edges of the day. Early mornings give you Sassoon Dock and wholesale fish action, evenings give you Marine Drive recovery time. Build buffers — everything in Mumbai takes twenty minutes longer than Maps says during monsoon."
    ],
    bestTime: "November to February. Monsoon (June–September) floods plans, literally.",
    gettingAround: "Local trains for spine moves, kaali-peeli taxis and autos beyond the suburbs cutoff.",
    budgetNote: "Stay costs dominate; food and transit are cheap. Book hotels near a station, not near the sea.",
    keyAreas: [
      { name: "Crawford Market", knownFor: "imported goods, dry fruit, and household wholesale" },
      { name: "Lamington Road", knownFor: "computer parts, cameras, components, repair benches" },
      { name: "Zaveri Bazaar", knownFor: "gold and jewellery trade at national volume" },
      { name: "Linking Road, Bandra", knownFor: "street fashion, shoes, and bargain accessories" },
      { name: "Dadar Flower Market", knownFor: "pre-dawn flower wholesale, photography gold" }
    ],
    tips: [
      "Avoid local trains 8–11am and 5–9pm with luggage; the crowd is not negotiable.",
      "Lamington Road shops quote better prices for assembled lists than single parts.",
      "Monsoon plan: keep one indoor backup (museum, mall, café street) per half-day.",
      "Kokilaben and Lilavati are the reliable hospital pins to save for emergencies."
    ]
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    tagline: "Tech city with old-market bones — plan around traffic, win with neighbourhoods.",
    intro: [
      "Bengaluru is a neighbourhood city wearing a metro-city costume. Commercial Street and Chickpet handle traditional shopping, SP Road is the electronics counter-economy, Koramangala and Indiranagar carry the café and boutique scene. Distances look short on the map and feel long on the road — cluster everything.",
      "The payoff is liveability: parks between markets, filter coffee everywhere, and a food scene that covers darshini breakfasts to craft dinners. Weekday mornings are the secret window; the city's famous traffic is a 4pm-onwards phenomenon."
    ],
    bestTime: "Year-round mild; October–February is best. Carry a light layer for evenings.",
    gettingAround: "Namma Metro where it reaches, autos on meter apps, walking inside neighbourhoods.",
    budgetNote: "Mid-range city: café costs add up faster than transit or markets.",
    keyAreas: [
      { name: "Chickpet & Avenue Road", knownFor: "sarees, silk, wholesale textiles, book lanes" },
      { name: "SP Road", knownFor: "electronics, components, laptops at trade prices" },
      { name: "Commercial Street", knownFor: "fashion mix from street stalls to brand stores" },
      { name: "KR Market", knownFor: "flowers and produce wholesale before sunrise" },
      { name: "Indiranagar 100 Ft Road", knownFor: "cafés, breweries, and boutique shopping" }
    ],
    tips: [
      "Plan one zone per day; crossing town twice costs two hours minimum after 4pm.",
      "Mysore Silk showrooms near Chickpet beat airport-road tourist pricing.",
      "Darshini breakfast before market runs: fast, cheap, standing-only, excellent.",
      "Manipal and Fortis pins cover most emergency needs across the city."
    ]
  },
  {
    slug: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    tagline: "The pink city sells colour: block prints, gems, jootis, and forts before lunch.",
    intro: [
      "Jaipur compresses well: the walled city holds Johari Bazaar (jewellery), Bapu Bazaar (textiles and jootis), and Tripolia Bazaar (lac bangles, brassware) within walking distance of each other. Do forts in the morning — Amber, Nahargarh, Jaigarh — and bazaars in the late afternoon when the heat drops and the lights come on.",
      "Quality varies wildly with the lane. Government emporiums anchor your price sense; then the bazaars become fun instead of risky. For block prints and quilts, Sanganer and Bagru villages are the source if you have a spare half-day."
    ],
    bestTime: "October to March. Summer afternoons stop bazaar plans cold.",
    gettingAround: "Autos and e-rickshaws inside the walled city; cabs for the fort circuit.",
    budgetNote: "Bargaining city — open at half, settle around 60–70% in tourist-facing lanes.",
    keyAreas: [
      { name: "Johari Bazaar", knownFor: "gems, kundan and meenakari jewellery traditions" },
      { name: "Bapu Bazaar", knownFor: "textiles, jootis, and souvenir staples" },
      { name: "Tripolia Bazaar", knownFor: "lac bangles, brassware, and carpets" },
      { name: "MI Road", knownFor: "fixed-price stores and famous lassi stops" },
      { name: "Sanganer", knownFor: "block printing workshops and paper craft at source" }
    ],
    tips: [
      "Amber Fort by 8am beats both heat and tour-bus crowds.",
      "Ask for hallmarking on silver and gold; reputable Johari shops expect it.",
      "Composite fort tickets save real money if you cover three or more sites.",
      "Laal Maas dinner bookings fill up in season — reserve a day ahead."
    ]
  },
  {
    slug: "surat",
    name: "Surat",
    state: "Gujarat",
    tagline: "India's fabric engine — saree wholesale, diamond polish, and serious street food.",
    intro: [
      "Surat is a working trade city, and that is its charm. The textile markets around Ring Road — Millennium, New Textile Market, and dozens of neighbours — move saree volume that supplies half the country. Buyers come with lists and leave with bales; even retail visitors get wholesale-adjacent prices if they buy in small lots.",
      "Between market sessions, the food carries the day: locho, undhiyu in winter, and the Ghod Dod Road café strip. Diamond work is mostly B2B, but the scale shapes the city's rhythm — mornings are for trade, late evenings for eating out."
    ],
    bestTime: "November to February. Textile markets run year-round; summers are humid.",
    gettingAround: "Autos everywhere; the BRTS helps on main corridors. Markets cluster around Ring Road.",
    budgetNote: "Best saree price-to-quality ratio in the country if you compare three markets before buying.",
    keyAreas: [
      { name: "Ring Road textile belt", knownFor: "saree and dress material wholesale across linked markets" },
      { name: "New Textile Market", knownFor: "synthetics and daily-wear volume buying" },
      { name: "Chauta Bazaar", knownFor: "old-city retail, bangles, and festive shopping" },
      { name: "Ghod Dod Road", knownFor: "cafés, brands, and evening family outings" },
      { name: "Dumas Road", knownFor: "seaside snacks and late-night food runs" }
    ],
    tips: [
      "Carry GST details if buying in bulk; billed wholesale rates beat cash quotes.",
      "Market porters (mathadis) move your purchases between buildings for small tips.",
      "Sunday closures are common in textile markets — confirm before travelling.",
      "Try locho and surti khaman at morning stalls; they sell out before noon."
    ]
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    tagline: "Pearls at Charminar, biryani everywhere, and a tech city bolted on at HITEC.",
    intro: [
      "Hyderabad splits cleanly in two: the old city around Charminar — Laad Bazaar's bangles, pearl traders, and Mecca Masjid — and the new west of HITEC City and Gachibowli. Tourists underestimate the distance between them; it's a 45–90 minute hop depending on hour, so give each side its own half-day.",
      "Food is the through-line. Biryani arguments are a civic sport, Irani chai with Osmania biscuits is the correct afternoon break, and the old city's haleem season (Ramzan) reorganises the entire city's evenings."
    ],
    bestTime: "October to February. Summers are hot; monsoon evenings are pleasant.",
    gettingAround: "Metro covers the main axis; cabs for old-city-to-HITEC hops. Autos rule near Charminar.",
    budgetNote: "Pearls range hugely — fixed-price reputed stores first, bazaar bargains after.",
    keyAreas: [
      { name: "Laad Bazaar", knownFor: "lac bangles, bridal accessories beside Charminar" },
      { name: "Pearl market, Pathergatti", knownFor: "Hyderabadi pearls graded and strung to order" },
      { name: "Begum Bazaar", knownFor: "household wholesale and festival goods" },
      { name: "Banjara Hills Road No. 12", knownFor: "premium dining and boutiques" },
      { name: "Necklace Road", knownFor: "lakefront evenings and family time" }
    ],
    tips: [
      "Golconda Fort late afternoon, then Charminar at dusk when the lights rise.",
      "Ask pearl sellers for the scratch test and certification on bigger buys.",
      "Old-city lanes choke after 6pm; shop earlier, eat later.",
      "Paradise is the famous name; locals will route you to Shadab or Bawarchi."
    ]
  },
  {
    slug: "leh",
    name: "Leh",
    state: "Ladakh",
    tagline: "High-altitude planning city: acclimatise first, then the mountains open up.",
    intro: [
      "Leh is the one city where the first plan item is doing nothing. At 3,500 metres, your first 24–36 hours decide the whole trip: rest, hydrate, skip alcohol, and let your body catch up before Khardung La or Pangong plans. Altitude sickness ruins more Ladakh itineraries than weather does.",
      "The town itself is compact — the Main Bazaar, Tibetan refugee market, and old town walks cover shopping; monasteries like Thiksey and Hemis structure day trips. Fuel, permits, and a checked vehicle matter more here than anywhere else in India: distances are long, services are thin, and weather rewrites schedules."
    ],
    bestTime: "May to September. Roads from Manali/Srinagar open late spring; winter is expedition territory.",
    gettingAround: "Rented bikes and shared taxis; fix daily rates in town. Fuel up before every long leg.",
    budgetNote: "Permit fees, fuel margins, and season pricing add up — budget 20% over plains-India estimates.",
    keyAreas: [
      { name: "Main Bazaar", knownFor: "pashmina, apricot products, prayer wheels, last-stop supplies" },
      { name: "Tibetan Refugee Market", knownFor: "silver jewellery and turquoise bargaining" },
      { name: "Old Town & Leh Palace", knownFor: "heritage walk with valley views" },
      { name: "Changspa Road", knownFor: "cafés, travel agents, and trip-planning evenings" },
      { name: "Skara", knownFor: "quieter stays with mountain-facing guesthouses" }
    ],
    tips: [
      "Day 1: rest. Day 2: local monasteries. Day 3+: high passes. Do not invert this.",
      "Carry cash; ATMs queue up and card machines fade with connectivity.",
      "SNM Hospital in Leh handles altitude emergencies — save the pin before leaving town.",
      "Book Pangong/Nubra permits a day ahead through any Changspa agent."
    ]
  },
  {
    slug: "prayagraj",
    name: "Prayagraj",
    state: "Uttar Pradesh",
    tagline: "Sangam city — pilgrimage logistics, university-town energy, and old-school markets.",
    intro: [
      "Prayagraj organises itself around the Sangam, where the Ganga and Yamuna meet. Boat timing is everything: dawn rides give you mist, birds, and space; mid-day rides give you heat and queues. Civil Lines is the planned-city counterweight with coffee houses and bookstores from the university era.",
      "Markets here serve residents, not tourists, which keeps prices honest. Katra and Chowk cover daily shopping and street food; during Magh Mela (and the giant Kumbh cycles) the entire riverfront becomes a temporary city with its own maps — plan accommodation months out for those windows."
    ],
    bestTime: "October to March. Mela months transform the city — incredible, but book far ahead.",
    gettingAround: "E-rickshaws dominate short hops; autos for Sangam runs. Civil Lines is walkable.",
    budgetNote: "One of north India's cheapest city visits outside festival peaks.",
    keyAreas: [
      { name: "Sangam Ghats", knownFor: "boat rides, rituals, and dawn photography" },
      { name: "Civil Lines", knownFor: "coffee house culture, bookshops, evening strolls" },
      { name: "Katra Market", knownFor: "student-budget shopping and street snacks" },
      { name: "Chowk", knownFor: "old-city bazaar and traditional sweets" },
      { name: "Company Garden", knownFor: "green break with colonial-era walks" }
    ],
    tips: [
      "Fix boat prices on the ghat steps before stepping in — per-boat, not per-person.",
      "Anand Bhavan and the university area pair well as one afternoon walk.",
      "Try khasta-kachori breakfasts in Chowk before 9am.",
      "During Mela, trust the printed sector maps over GPS — roads change weekly."
    ]
  },
  {
    slug: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    tagline: "Ghats, silk, and the oldest morning routine in the world.",
    intro: [
      "Varanasi works in two shifts. Dawn belongs to the river: boat rides past the ghats, morning aartis, and the city waking up in layers. Evenings belong to Dashashwamedh Ghat's Ganga aarti, which you should see once from the steps and once from a boat. The middle of the day is for lanes — Vishwanath Gali, silk shops, and lassi stops.",
      "Banarasi silk is the serious purchase here, and the serious risk. Power-loom copies flood tourist lanes; handloom weaves come from workshops in Sarai Mohana and trusted Chowk-area houses. Ask to see the loom-side, check the reverse of the weave, and treat below-market prices as a warning, not a win."
    ],
    bestTime: "October to March. Dev Deepawali (November) is spectacular and packed.",
    gettingAround: "Walk the ghats end-to-end; autos to the station/airport. Lanes are pedestrian-only.",
    budgetNote: "Boat rides and food are cheap; real Banarasi silk is not — budget accordingly.",
    keyAreas: [
      { name: "Dashashwamedh Ghat", knownFor: "evening Ganga aarti, the city's main stage" },
      { name: "Assi Ghat", knownFor: "calmer mornings, cafés, yoga sessions" },
      { name: "Vishwanath Gali", knownFor: "temple lane shopping and street snacks" },
      { name: "Thateri Bazaar", knownFor: "brassware and ritual items" },
      { name: "Sarai Mohana", knownFor: "handloom silk weaving at source" }
    ],
    tips: [
      "Sunrise boat from Assi to Manikarnika covers the full ghat arc in one ride.",
      "GI-tagged shops and loom visits are the silk authenticity shortcut.",
      "Kachori-jalebi breakfast near Kachori Gali — go before 8:30am.",
      "Keep shoes you can remove fast; temples and many shops expect it."
    ]
  },
  {
    slug: "indore",
    name: "Indore",
    state: "Madhya Pradesh",
    tagline: "India's cleanest city eats better than almost anywhere — plan around food first.",
    intro: [
      "Indore is the rare city where the food map is the city map. Chappan Dukan's 56 shops run all day; Sarafa Bazaar flips from jewellery lanes to a midnight street-food market after 8pm — the only one of its kind in India. Between the two meals you have Rajwada's Holkar-era old city and the cloth markets around it.",
      "As a base, Indore is the launchpad for Ujjain's Mahakaleshwar (an hour away) and Mandu's monsoon-season plateau. The city itself is compact, organised, and proud of its cleanliness streak — markets close late and start late, so pace your day accordingly."
    ],
    bestTime: "October to March; monsoon adds Mandu day-trip magic.",
    gettingAround: "City buses and autos; everything central sits within a 5km radius of Rajwada.",
    budgetNote: "Street food economy — ₹500 covers a legendary eating day.",
    keyAreas: [
      { name: "Sarafa Bazaar", knownFor: "midnight street food over daytime jewellery lanes" },
      { name: "Chappan Dukan", knownFor: "56-shop snack strip, the city's food anchor" },
      { name: "Rajwada", knownFor: "Holkar palace and old-city shopping radius" },
      { name: "MT Cloth Market", knownFor: "fabric and garment wholesale" },
      { name: "Vijay Nagar", knownFor: "malls, cafés, and the new-city evening scene" }
    ],
    tips: [
      "Sarafa peaks 10pm–midnight; go hungry and graze, don't commit to one stall.",
      "Poha-jalebi is the breakfast ritual — any busy stall does it right.",
      "Ujjain early morning darshan beats the queue; combine with an Indore evening.",
      "Khajrana Ganesh temple Tuesdays are packed; park far and walk."
    ]
  },
  {
    slug: "ayodhya",
    name: "Ayodhya",
    state: "Uttar Pradesh",
    tagline: "Temple-town logistics: darshan timing, ghat evenings, and a city rebuilding around faith.",
    intro: [
      "Ayodhya's rhythm is set by the Ram Mandir darshan flow. Early slots move fastest; afternoons stretch with queues, especially weekends and festival windows. Lockers, footwear counters, and security lines add real time — arrive with minimal carry and an hour of buffer beyond what Maps suggests.",
      "Beyond the main temple, Hanuman Garhi's steps, Kanak Bhawan's calmer courtyards, and the Saryu ghats at sunset complete the circuit. The evening Saryu aarti at Naya Ghat is the city's gentlest hour. Infrastructure is new and still settling: hotels fill early, and street food clusters move — ask locally for the current best lanes."
    ],
    bestTime: "October to March. Ram Navami and Diwali (Deepotsav) are extraordinary and extremely crowded.",
    gettingAround: "E-rickshaws everywhere; the core temple circuit is walkable. Trains connect via Ayodhya Dham station.",
    budgetNote: "Stay prices spike on festivals — book weeks ahead or stay in Faizabad side.",
    keyAreas: [
      { name: "Ram Mandir complex", knownFor: "the main darshan, timed entry, locker logistics" },
      { name: "Hanuman Garhi", knownFor: "the steps-and-blessings stop before Ram Mandir, by custom" },
      { name: "Saryu Ghats / Naya Ghat", knownFor: "evening aarti and boat rides" },
      { name: "Kanak Bhawan", knownFor: "quieter darshan and architecture" },
      { name: "Ram ki Paidi", knownFor: "lit-up riverfront walks after dark" }
    ],
    tips: [
      "Hanuman Garhi first, then Ram Mandir — the traditional order, and the better queue maths.",
      "Phones and bags go into lockers at the mandir; carry only ID and offerings.",
      "Weekday early-morning slots are the calmest darshan windows.",
      "Saryu aarti at dusk needs a spot 30 minutes early on weekends."
    ]
  },
  {
    slug: "agra",
    name: "Agra",
    state: "Uttar Pradesh",
    tagline: "More than one monument: time the Taj, then let the city surprise you.",
    intro: [
      "Agra is a timing puzzle. The Taj Mahal at sunrise is a different building from the Taj at noon — softer light, thinner crowds, cooler walks. Book the earliest slot, then use the saved hours for Agra Fort and Mehtab Bagh's across-the-river sunset view, which most day-trippers never reach.",
      "The city beyond the tickets sells marble inlay (pietra dura), leather, and petha sweets. Inlay quality splits between artisan workshops and pushy showrooms — workshops near Tajganj demonstrate the stonework live, and that demonstration is your authenticity filter. Eat dinner in town; daytrippers funnel into highway buffets and miss the Mughlai kitchens."
    ],
    bestTime: "October to March. Friday closures at the Taj catch many visitors out.",
    gettingAround: "Autos and e-rickshaws; Tajganj is walkable. Fatehpur Sikri is a half-day add-on.",
    budgetNote: "Tickets are the fixed cost; everything else negotiates, especially inlay work.",
    keyAreas: [
      { name: "Tajganj", knownFor: "Taj gates, rooftop views, and artisan workshops" },
      { name: "Agra Fort", knownFor: "Mughal palace complex with Taj sightlines" },
      { name: "Mehtab Bagh", knownFor: "sunset Taj views across the Yamuna" },
      { name: "Sadar Bazaar", knownFor: "leather goods and evening food stalls" },
      { name: "Kinari Bazaar", knownFor: "old-city wedding and craft shopping" }
    ],
    tips: [
      "The Taj is closed on Fridays — build the whole itinerary around this.",
      "West gate queues at dawn move fastest; east gate suits pre-booked tickets.",
      "Real petha comes from Panchhi outlets, not lookalike storefronts.",
      "Mughlai dinner at a Tajganj rooftop beats the highway buffet circuit."
    ]
  }
];

export function getCityGuide(slug: string) {
  return cityGuides.find((guide) => guide.slug === slug) || null;
}
