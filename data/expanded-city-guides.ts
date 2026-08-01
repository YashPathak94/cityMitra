import type { CityGuide } from "@/data/city-guides";

export const expandedCityGuides = [
  {
    slug: "manali",
    name: "Manali",
    state: "Himachal Pradesh",
    tagline: "Cedar forests, cafe lanes, temple mornings, and mountain plans that need a weather backup.",
    intro: [
      "Manali is not one trip but three neighbourhood moods. Mall Road is the practical centre for buses, woollens, pharmacies, and family movement. Old Manali is slower and younger, with footbridges, cafes, hostels, and the climb toward Manu Temple. Vashisht sits across the Beas with hot springs, village lanes, and the trail toward Jogini waterfall. Pick the mood before you pick the hotel.",
      "The big-ticket valleys are outside town. Solang, Atal Tunnel, Sissu, and seasonal Rohtang routes can consume a full day, and weather can change access without caring about your spreadsheet. Keep one town day, one mountain day, and one flexible day. That is a better Manali trip than racing through five photo stops from a taxi window."
    ],
    bestTime: "April to June for mild weather; September to early November for clearer, quieter days. Snow travel needs flexible dates.",
    gettingAround: "Walk within Old Manali or Mall Road; use local taxis or buses for Vashisht, Solang, Naggar, and tunnel-side routes.",
    budgetNote: "Stay and taxi rates jump on weekends and snow dates. Share a local cab only after confirming route, stops, and return time.",
    keyAreas: [
      { name: "Old Manali", knownFor: "hostels, cafe lanes, Manu Temple, and a younger evening scene" },
      { name: "Mall Road", knownFor: "transport, pharmacies, woollens, family dining, and everyday supplies" },
      { name: "Vashisht", knownFor: "temple lanes, hot springs, guesthouses, and the Jogini trail" },
      { name: "Dhungri", knownFor: "Hadimba Temple, cedar forest, and quieter heritage walks" },
      { name: "Solang side", knownFor: "seasonal snow, adventure operators, and high-traffic day trips" }
    ],
    localBrief: {
      title: "Manali works when the valley gets one full day",
      description:
        "The town is walkable; the attractions are not. Separate cafe-and-temple Manali from the Solang and tunnel circuit, then leave space for weather, traffic, and the simple pleasure of not spending the whole holiday inside a cab."
    },
    halfDayPlan: [
      "08:00 - Walk through Dhungri cedar forest and visit Hadimba Temple before group traffic arrives.",
      "10:00 - Continue toward Old Manali for breakfast and a slow Manu Temple lane walk.",
      "12:30 - Cross back toward Mall Road or the Beas without adding Solang to the same half-day.",
      "16:30 - Use Vashisht or a riverside cafe as the evening plan, subject to weather."
    ],
    localChecks: [
      "Verify road and weather status before Solang, Atal Tunnel, Sissu, or Rohtang-side travel.",
      "Use registered adventure operators and confirm insurance, helmet, and cancellation terms.",
      "Save the nearest hospital, fuel stop, and taxi contact before leaving the main town."
    ],
    tips: [
      "Old Manali looks close to Mall Road on the map; the uphill walk feels different with luggage.",
      "Do not book a snow-point package only from a street pitch. Compare the exact route and included gear.",
      "Carry a warm layer even after a sunny morning; valley shade changes temperature quickly.",
      "Treat the Beas and mountain roads with respect. Photo stops are not worth unsafe edges."
    ]
  },
  {
    slug: "shimla",
    name: "Shimla",
    state: "Himachal Pradesh",
    tagline: "A walking hill capital where heritage, public life, and steep shortcuts share the same ridge.",
    intro: [
      "Shimla makes more sense on foot than from a car. The Ridge, Mall Road, Lower Bazaar, Lakkar Bazaar, and the heritage buildings form one pedestrian spine where locals actually meet, shop, debate, and pause. The city's social life is visible: school groups, office workers, travellers, and families all share the same narrow ridge.",
      "Kufri and Mashobra are separate outings, not extensions of Mall Road. In town, give time to Gaiety Theatre, Christ Church, the Indian Institute of Advanced Study, and the old railway story. Shimla's achievement is not just being scenic; its mountain railway and built heritage show how an administrative hill town became a living state capital."
    ],
    bestTime: "March to June and October to November. Snowfall travel is beautiful but disruption-prone; monsoon needs landslide awareness.",
    gettingAround: "Walk the central ridge; use the lift or local buses for vertical movement and taxis for Kufri, Mashobra, or Naldehra.",
    budgetNote: "Central stays cost more but save repeated uphill taxi runs. Weekend parking and taxi time can erase a cheaper outer hotel.",
    keyAreas: [
      { name: "The Ridge", knownFor: "public life, mountain views, Christ Church, and cultural events" },
      { name: "Mall Road", knownFor: "pedestrian shopping, cafes, heritage facades, and evening walks" },
      { name: "Lower Bazaar", knownFor: "everyday local shopping, snacks, and less-polished city rhythm" },
      { name: "Summer Hill", knownFor: "university atmosphere, railway views, and quieter walks" },
      { name: "Mashobra side", knownFor: "forest stays, orchards, and slower day trips outside the core" }
    ],
    localBrief: {
      title: "Shimla is a vertical city, not a flat itinerary",
      description:
        "Two places can be close on the map and separated by a serious climb. Build the day along one elevation, use the public lift deliberately, and keep Kufri or Mashobra for a separate road loop."
    },
    halfDayPlan: [
      "08:30 - Begin at Viceregal Lodge or Summer Hill before returning toward the central ridge.",
      "11:00 - Walk the Ridge, Christ Church exterior, and Gaiety Theatre precinct.",
      "12:30 - Drop into Lower Bazaar for a local lunch rather than staying only on tourist-facing Mall Road.",
      "16:30 - Take the Jakhoo route only if weather, visibility, and walking comfort are good."
    ],
    localChecks: [
      "Confirm hotel vehicle access; many central properties require a final walk or porter.",
      "Check road conditions before Kufri and outer-ridge plans during snow or monsoon.",
      "Keep IGMC and the nearest pharmacy saved if travelling with children or seniors."
    ],
    tips: [
      "The Kalka-Shimla train is part of the trip, not merely transport; reserve early in peak season.",
      "Wear shoes with grip. Polished hill paths and rain are an unfriendly combination.",
      "Lower Bazaar gives a more human city picture than repeating Mall Road twice.",
      "Do not feed or provoke monkeys around Jakhoo; secure food and loose items."
    ]
  },
  {
    slug: "mussoorie",
    name: "Mussoorie",
    state: "Uttarakhand",
    tagline: "Ridge walks, Landour quiet, bookshop weather, and a rare winterline when the sky cooperates.",
    intro: [
      "Mussoorie stretches along a ridge, so the best plan is linear. Library end, Camel's Back Road, Kulri, Picture Palace, and Landour each have a distinct pace. Mall Road handles the classic family promenade; Landour rewards early walkers with forest bends, old homes, bakeries, and a quieter relationship with the hills.",
      "George Everest and Kempty Falls pull visitors in opposite directions and should not be crammed into one short outing. Mussoorie's deeper charm is not a checklist: it is rain moving across the Doon valley, conversations in small cafes, Tibetan influences around Happy Valley, and the winterline visible on some clear evenings."
    ],
    bestTime: "March to June and September to November. Monsoon is lush but slippery; winter can bring cold, fog, and occasional snow.",
    gettingAround: "Walk the ridge where possible; use local taxis for George Everest, Kempty, Happy Valley, and Cloud's End side.",
    budgetNote: "Weekend rooms and taxis carry a Delhi-getaway premium. Weekdays buy quieter walks as well as better value.",
    keyAreas: [
      { name: "Landour", knownFor: "forest walks, heritage homes, bakeries, and quieter ridge views" },
      { name: "Library end", knownFor: "taxi access, Mall Road entry, hotels, and George Everest connections" },
      { name: "Kulri Bazaar", knownFor: "central shopping, cafes, and evening foot traffic" },
      { name: "Happy Valley", knownFor: "Tibetan community, temples, gardens, and a calmer side of town" },
      { name: "Hathipaon", knownFor: "George Everest access, open views, and trail-oriented stays" }
    ],
    localBrief: {
      title: "Mussoorie is best read as one long ridge",
      description:
        "Plan from one end toward the other instead of zig-zagging by taxi. A Landour morning, ridge afternoon, and sunset viewpoint creates more memory and less traffic than collecting distant pins."
    },
    halfDayPlan: [
      "07:30 - Start in Landour for the quiet loop before visitor traffic rises.",
      "10:00 - Pause for breakfast and continue downhill toward Picture Palace or Kulri.",
      "12:00 - Walk a defined Mall Road section rather than covering it twice.",
      "16:30 - Choose either Camel's Back sunset or George Everest, not both."
    ],
    localChecks: [
      "Check fog and rain before committing to viewpoints.",
      "Confirm whether your hotel is reachable by vehicle and whether porter help is available.",
      "Keep water and basic medicines; steep walking can feel harder than the altitude number suggests."
    ],
    tips: [
      "Landour before 9 am feels like a different destination from weekend Mall Road.",
      "Use public bins and carry wrappers back; ridge litter travels downhill into forests.",
      "Kempty Falls is crowd-sensitive. Go early or choose a quieter ridge walk.",
      "Ask before photographing residents, school spaces, or inside religious sites."
    ]
  },
  {
    slug: "darjeeling",
    name: "Darjeeling",
    state: "West Bengal",
    tagline: "Tea, mountain rail, Nepali-speaking hill culture, and mornings ruled by cloud and Kanchenjunga.",
    intro: [
      "Darjeeling wakes early. Tiger Hill cars move before dawn, tea workers begin with the slopes, and the best mountain views often disappear behind cloud by breakfast. Build the city around mornings: Observatory Hill, Chowrasta, heritage walks, or a tea estate before the weather closes the frame.",
      "The town is shaped by Nepali, Tibetan, Bengali, and colonial histories, but it should not be reduced to tea and toy-train nostalgia. Listen for local music, try momo and thukpa alongside bakery classics, visit the Himalayan Mountaineering Institute, and understand why the Darjeeling Himalayan Railway remains both an engineering landmark and a fragile living system."
    ],
    bestTime: "March to May and October to November for clearer mountain views. Monsoon is misty and disruption-prone.",
    gettingAround: "Walk around Chowrasta and central lanes; use shared jeeps for estates, Ghoom, Tiger Hill, and regional transfers.",
    budgetNote: "Views and central access drive room rates. A cheaper steep-side stay may add porter and vehicle costs.",
    keyAreas: [
      { name: "Chowrasta", knownFor: "pedestrian social life, cafes, bookshops, and evening walks" },
      { name: "Ghoom", knownFor: "monasteries, railway heritage, and the Batasia loop side" },
      { name: "Lebong", knownFor: "tea slopes, lower-valley views, and quieter local movement" },
      { name: "Himalayan Mountaineering Institute side", knownFor: "mountain history, zoo, and a substantial half-day" },
      { name: "Tea estate belt", knownFor: "guided estate visits, tasting, and landscape context" }
    ],
    localBrief: {
      title: "Darjeeling gives its best views before breakfast",
      description:
        "Treat clear sky as a live opportunity. Move outdoor viewpoints early, keep museums and cafes as cloud backups, and leave generous road time because hill traffic and weather routinely rewrite arrival estimates."
    },
    halfDayPlan: [
      "06:30 - Use the first clear window for Observatory Hill or a booked estate experience.",
      "09:00 - Eat a local breakfast and walk Chowrasta before shopping traffic builds.",
      "10:30 - Choose the Mountaineering Institute and zoo cluster or a Ghoom railway loop.",
      "14:00 - Keep an indoor cafe, museum, or tea tasting ready if cloud closes in."
    ],
    localChecks: [
      "Verify toy-train operations and tickets through official railway channels.",
      "Confirm shared-jeep pickup point and luggage rules before regional transfers.",
      "Ask tea estates whether the visit includes a working factory, tasting, or only a viewpoint."
    ],
    tips: [
      "Tiger Hill is weather-dependent, not guaranteed; do not let one cloudy sunrise define the trip.",
      "Support locally produced tea and crafts, and ask where products were made.",
      "Keep cash for shared jeeps and small food counters.",
      "Road time from NJP or Bagdogra expands quickly during rain, traffic, or repair work."
    ]
  },
  {
    slug: "rishikesh",
    name: "Rishikesh",
    state: "Uttarakhand",
    tagline: "Yoga mornings, rafting afternoons, cafe bridges, and a river town that asks you to slow down respectfully.",
    intro: [
      "Rishikesh contains several versions of itself along the Ganga. Swarg Ashram and Ram Jhula lean toward ashrams, ghats, and long river walks. Tapovan is hostel, yoga-studio, and cafe territory. Shivpuri is the adventure launch side. Triveni Ghat belongs to the older city rhythm. Choose a base that matches the trip instead of assuming every bridge is ten minutes away.",
      "The city attracts seekers, weekend groups, international students, and adventure travellers at the same time. Its global yoga identity and Beatles Ashram history are real, but so are living religious customs. Dress and behave thoughtfully at ghats, choose authorised rafting operators, and leave loud party energy away from prayer spaces."
    ],
    bestTime: "February to April and September to November. Rafting seasons depend on river and official safety conditions.",
    gettingAround: "Walk within Tapovan or Swarg Ashram clusters; use autos for Triveni and registered transport for Shivpuri or outer routes.",
    budgetNote: "Hostels and ashram stays can be economical; wellness retreats and weekend river camps vary widely in what is included.",
    keyAreas: [
      { name: "Tapovan", knownFor: "hostels, yoga studios, cafes, rentals, and younger traveller energy" },
      { name: "Swarg Ashram", knownFor: "ashrams, river walks, Beatles Ashram, and quieter spiritual stays" },
      { name: "Ram Jhula", knownFor: "bridge-side movement, temples, markets, and Parmarth access" },
      { name: "Triveni Ghat", knownFor: "old-city aarti, local markets, and a different rhythm from Tapovan" },
      { name: "Shivpuri", knownFor: "authorised rafting launches, camps, and upriver adventure plans" }
    ],
    localBrief: {
      title: "Rishikesh is a cluster of intentions",
      description:
        "A yoga retreat, rafting weekend, temple visit, and laptop cafe trip need different bases. Pick the intention first, then let the river connect the day instead of commuting across every bridge."
    },
    halfDayPlan: [
      "06:30 - Begin with a booked yoga class or a quiet ghat walk.",
      "09:00 - Eat breakfast near your base and walk one river-bank cluster.",
      "11:00 - Visit Beatles Ashram or continue toward Ram Jhula without adding rafting casually.",
      "17:00 - Reach the chosen aarti ghat early and keep the evening respectful."
    ],
    localChecks: [
      "Book rafting only with authorised operators and confirm section, grade, equipment, and cancellation.",
      "Check bridge access and local traffic changes before setting out.",
      "Verify yoga teacher credentials and course inclusions before paying for multi-day programs."
    ],
    tips: [
      "Alcohol and non-vegetarian food rules vary, but the town's sacred character deserves consideration everywhere.",
      "A riverside cafe is not permission to enter unsafe water or climb restricted rocks.",
      "Keep separate footwear and a light shawl for ashram or temple visits.",
      "The Beatles Ashram is more rewarding with context; read about the music history before the walk."
    ]
  },
  {
    slug: "haridwar",
    name: "Haridwar",
    state: "Uttarakhand",
    tagline: "A living pilgrimage city where the Ganga enters the plains and every useful plan begins with crowd rhythm.",
    intro: [
      "Haridwar is built around faith in motion: pilgrims arriving by train, families carrying offerings, vendors preparing prasad, and volunteers managing flows toward the ghats. Har Ki Pauri is the emotional centre, but Kankhal, Mansa Devi, Chandi Devi, and quieter river sections reveal a broader city of ashrams and traditional learning.",
      "The evening aarti is powerful because it is worship, not a stage show. Arrive early, leave walking space, avoid pushing for a camera angle, and keep the river clean. During Kumbh, Kanwar season, and major bathing dates, normal travel logic does not apply; official advisories and pedestrian routes take priority."
    ],
    bestTime: "October to March for comfortable walking. Major festivals and bathing dates bring intense crowds and require special planning.",
    gettingAround: "Walk the Har Ki Pauri core; use e-rickshaws for town movement and ropeway or designated routes for hill temples.",
    budgetNote: "Simple stays and meals are widely available, but prices and access change sharply during major pilgrimage dates.",
    keyAreas: [
      { name: "Har Ki Pauri", knownFor: "Ganga aarti, bathing ghat, ceremonies, and the main pilgrimage flow" },
      { name: "Kankhal", knownFor: "Daksha Mahadev Temple, ashrams, and a quieter sacred precinct" },
      { name: "Mansa Devi side", knownFor: "hill-temple route, ropeway queues, and city views" },
      { name: "Upper Road", knownFor: "prasad, religious goods, budget food, and old-town movement" },
      { name: "Sapt Rishi side", knownFor: "ashrams, quieter river channels, and reflective visits" }
    ],
    localBrief: {
      title: "Haridwar planning is mostly crowd literacy",
      description:
        "Distances are short, but queues, barricades, ritual timings, and footwear storage define the day. Keep one temple circuit and one ghat session instead of treating sacred sites like a rapid checklist."
    },
    halfDayPlan: [
      "06:00 - Walk to Har Ki Pauri for the calmer morning river atmosphere.",
      "08:00 - Eat a simple breakfast and visit the old market while lanes are workable.",
      "10:00 - Choose either Mansa Devi or the Kankhal circuit for the late morning.",
      "17:00 - Return early for evening aarti and follow local crowd instructions."
    ],
    localChecks: [
      "Check official crowd and traffic advisories on festival and bathing dates.",
      "Keep valuables dry and secure; river steps can be wet and fast-moving.",
      "Confirm ropeway operation, queue, and return route before hill-temple plans."
    ],
    tips: [
      "Do not enter deep or fast water because others appear to be doing so.",
      "Use designated donation counters and be cautious with unsolicited ritual pressure.",
      "Carry minimal luggage around Har Ki Pauri and agree on a family meeting point.",
      "Photography should never interrupt aarti, bathing, grief rituals, or private prayer."
    ]
  },
  {
    slug: "ujjain",
    name: "Ujjain",
    state: "Madhya Pradesh",
    tagline: "Mahakal devotion, Shipra evenings, old astronomy, and a city whose daily clock begins before dawn.",
    intro: [
      "Ujjain runs on sacred time. Mahakaleshwar draws the largest flow, but the city opens outward through Mahakal Lok, Harsiddhi, Ram Ghat, Kal Bhairav, Sandipani Ashram, and the astronomical instruments at Vedh Shala. A meaningful visit connects temple practice, river life, learning, and the city's historic association with calendars and timekeeping.",
      "Early starts are normal here. If Bhasma Aarti is your purpose, use only official booking information and understand the dress, ID, and reporting requirements. If it is not, a calmer darshan plus Ram Ghat evening may be the better experience. Faith is not improved by exhaustion or aggressive queue behaviour."
    ],
    bestTime: "October to March. Shravan, Mahashivratri, and major religious dates bring exceptional crowds.",
    gettingAround: "Autos and e-rickshaws cover the temple circuit; keep the Mahakal core largely on foot.",
    budgetNote: "Temple-town basics are affordable; festival stays, priority services, and late transport need advance verification.",
    keyAreas: [
      { name: "Mahakaleshwar core", knownFor: "Jyotirlinga darshan, Mahakal Lok, lockers, and intense queue logistics" },
      { name: "Ram Ghat", knownFor: "Shipra aarti, ritual bathing, and evening city atmosphere" },
      { name: "Harsiddhi precinct", knownFor: "temple lamps, walkable sacred circuit, and festival energy" },
      { name: "Kal Bhairav side", knownFor: "distinct temple tradition and an outer-city route" },
      { name: "Vedh Shala", knownFor: "historic astronomical instruments and Ujjain's knowledge heritage" }
    ],
    localBrief: {
      title: "Ujjain is more than one famous queue",
      description:
        "Mahakal anchors the trip, but Ram Ghat, Harsiddhi, Vedh Shala, and old-city food give it dimension. Protect time for context instead of spending every hour chasing a faster darshan."
    },
    halfDayPlan: [
      "05:30 - Begin with the officially confirmed darshan plan and carry only permitted essentials.",
      "09:00 - Eat breakfast near the core and walk Mahakal Lok at an unhurried pace.",
      "11:00 - Visit Harsiddhi or Vedh Shala depending on heat and interest.",
      "17:30 - Reach Ram Ghat before the evening ritual and follow local guidance."
    ],
    localChecks: [
      "Use only official channels for Bhasma Aarti and special-entry information.",
      "Check temple rules for phones, bags, clothing, and identification.",
      "Confirm festival traffic diversions before booking a tight onward train or flight."
    ],
    tips: [
      "Ignore agents promising impossible access; verify every paid temple service.",
      "Vedh Shala makes the city story richer, especially for curious teenagers and science travellers.",
      "Keep footwear tokens and family meeting points organised.",
      "Respect ritual practices at Kal Bhairav even if they are unfamiliar to you."
    ]
  },
  {
    slug: "amritsar",
    name: "Amritsar",
    state: "Punjab",
    tagline: "Seva, memory, food, and a heritage core that asks visitors to arrive with humility.",
    intro: [
      "Amritsar's centre is a walk through living faith and difficult history. Sri Harmandir Sahib welcomes people across backgrounds, while the langar demonstrates service at extraordinary scale. Nearby, Jallianwala Bagh and the Partition Museum require time and emotional attention. Heritage Street connects these places physically, but the real connection is between memory, resilience, and community.",
      "The city is also loudly, generously Punjabi: breakfast kulchas, lassi, phulkari, old bazaars, and conversations that move quickly from directions to food advice. Go beyond a rushed Golden Temple photo. Cover your head, wash your feet, sit quietly by the sarovar, volunteer if appropriate, and let the city be more than a backdrop."
    ],
    bestTime: "October to March for comfortable walking. Gurpurab and major holidays are meaningful and very crowded.",
    gettingAround: "Walk the Golden Temple heritage core; use e-rickshaws for old-city lanes and cabs for outer attractions.",
    budgetNote: "Food and local movement can be affordable; central hotels charge for walkability during peak dates.",
    keyAreas: [
      { name: "Golden Temple core", knownFor: "darshan, sarovar, langar, seva, and round-the-clock spiritual atmosphere" },
      { name: "Heritage Street", knownFor: "pedestrian links to Jallianwala Bagh, Town Hall, food, and shopping" },
      { name: "Partition Museum side", knownFor: "oral histories, memory, and a serious cultural visit" },
      { name: "Hall Bazaar", knownFor: "phulkari, juttis, papad-warian, and local shopping" },
      { name: "Gobindgarh side", knownFor: "fort history, cultural programming, and family outings" }
    ],
    localBrief: {
      title: "Amritsar deserves listening time",
      description:
        "The Golden Temple, Jallianwala Bagh, and Partition Museum should not be reduced to photo stops. Keep the heritage core slow, leave the outer-city excursion flexible, and let food fill the spaces between history."
    },
    halfDayPlan: [
      "05:30 - Experience the Golden Temple before the day crowd and sit by the sarovar.",
      "08:00 - Eat breakfast in the old city, then return through Heritage Street.",
      "10:00 - Give focused time to Jallianwala Bagh and the Partition Museum.",
      "16:00 - Choose Gobindgarh Fort or another verified outer-city plan; confirm current operations first."
    ],
    localChecks: [
      "Cover your head, remove shoes, wash feet, and follow gurdwara conduct without treating it as costume.",
      "Check museum closing days and current border-area advisories before outer-city travel.",
      "Confirm whether photography is appropriate before filming people, prayer, or volunteer service."
    ],
    tips: [
      "The langar is hospitality and seva, not a free-food attraction; participate respectfully.",
      "Partition Museum content can be emotionally heavy. Do not rush directly into the next entertainment stop.",
      "Try one focused food trail instead of ordering every famous dish in one sitting.",
      "Buy phulkari with questions about material, stitch work, and place of production."
    ]
  }
] satisfies CityGuide[];
