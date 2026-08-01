import { regionalCityEditorials } from "@/data/regional-city-editorials";

export type CityTheme = "hill" | "spiritual" | "heritage" | "culture" | "commerce";

export type CityEditorial = {
  label: string;
  themes: CityTheme[];
  heading: string;
  vibe: string;
  culture: string;
  people: string;
  contribution: string;
  respect: string;
  microMoments: string[];
  sources?: Array<{ label: string; href: string }>;
};

export const cityThemeLabels: Record<CityTheme, string> = {
  hill: "Hill resets",
  spiritual: "Spiritual cities",
  heritage: "Living heritage",
  culture: "Culture & food",
  commerce: "Markets & makers"
};

export const cityEditorials: Record<string, CityEditorial> = {
  delhi: {
    label: "Capital in layers",
    themes: ["heritage", "commerce", "culture"],
    heading: "Delhi does not have one personality, and that is the point.",
    vibe: "Fast, argumentative, generous, and unexpectedly tender once you step away from arterial roads.",
    culture: "Sultanate stone, Mughal lanes, refugee enterprise, government avenues, university canteens, and neighbourhood festivals coexist without blending into one neat story.",
    people: "Delhi confidence can sound abrupt. Ask a precise question and the same person may walk you to the correct metro gate.",
    contribution: "The city has repeatedly turned migration into new food, trade, language, and public culture.",
    respect: "Treat Old Delhi as a working neighbourhood, not a human backdrop. Ask before photographing vendors or worshippers.",
    microMoments: ["First chai before Chandni Chowk opens", "A quiet Lodhi Garden loop", "Metro doors opening onto a new version of the city"]
  },
  mumbai: {
    label: "Maximum momentum",
    themes: ["culture", "commerce", "heritage"],
    heading: "Mumbai's real luxury is movement with purpose.",
    vibe: "Restless, practical, rain-tested, ambitious, and held together by routines outsiders only notice when they fail.",
    culture: "Koli fishing roots, Parsi institutions, Marathi theatre, film dreams, migrant kitchens, and art-deco streets give the city more range than its skyline.",
    people: "Queues matter, time matters, and help is often delivered quickly without ceremony.",
    contribution: "Mumbai has shaped Indian cinema, finance, popular music, labour politics, and the idea of the self-made urban life.",
    respect: "Do not block commuter flows for photos. At the sea, respect tide warnings and monsoon barriers.",
    microMoments: ["Cutting chai between trains", "Rain arriving across Marine Drive", "A Fort street turning cinematic at dusk"]
  },
  bengaluru: {
    label: "Old city, new code",
    themes: ["culture", "commerce"],
    heading: "Bengaluru is most interesting where technology meets neighbourhood memory.",
    vibe: "Curious, caffeinated, multilingual, climate-blessed, and constantly negotiating with traffic.",
    culture: "Kannada theatre and literature, old pete markets, public gardens, darshini breakfasts, rock music, and startup culture all claim legitimate space.",
    people: "The city is full of builders and newcomers, but local language and neighbourhood history deserve more attention than an office commute gives them.",
    contribution: "Bengaluru helped make India a global technology and scientific-services centre while retaining influential public institutions and cultural scenes.",
    respect: "Learn a few Kannada courtesies, protect lake and park spaces, and do not treat every old neighbourhood as cheap real estate.",
    microMoments: ["Filter coffee at a standing counter", "Rain cooling Church Street", "A Sunday morning inside Cubbon Park"]
  },
  jaipur: {
    label: "Craft in colour",
    themes: ["heritage", "commerce", "culture"],
    heading: "Jaipur's colour is not decoration; it is a working design language.",
    vibe: "Regal without being silent, commercially sharp, craft-heavy, and best before the afternoon heat.",
    culture: "Gem cutting, block printing, miniature painting, lac work, architecture, and food traditions remain active livelihoods.",
    people: "Makers are often more interesting than showrooms. A patient conversation can reveal where the object came from and how it was made.",
    contribution: "Jaipur has carried regional craft knowledge into global design while its planned walled city remains a major urban heritage reference.",
    respect: "Do not bargain handmade work down to the price of a machine copy. Ask about material, labour, and origin.",
    microMoments: ["Morning light crossing Hawa Mahal", "A printer aligning a wooden block", "The Pink City cooling after sunset"]
  },
  surat: {
    label: "Trade with appetite",
    themes: ["commerce", "culture"],
    heading: "Surat is a production city that celebrates after the work is done.",
    vibe: "Commercially alert, food-obsessed, informal, and faster than its tourism reputation suggests.",
    culture: "Textile trade, diamond work, Gujarati enterprise, migrant labour, and inventive street food shape the everyday city.",
    people: "Business conversations start quickly, but relationships and repeat trust still move trade.",
    contribution: "Surat is an important global centre for diamond processing and one of India's most influential textile supply hubs.",
    respect: "Wholesale markets are workplaces. Keep passages clear, ask before filming, and understand minimum-order reality.",
    microMoments: ["Locho disappearing before noon", "Fabric samples moving across a counter", "A late drive toward Dumas snacks"]
  },
  hyderabad: {
    label: "Old city, future city",
    themes: ["heritage", "culture", "commerce"],
    heading: "Hyderabad switches centuries during a single cab ride.",
    vibe: "Warm, witty, food-serious, historically layered, and geographically split between old-city lanes and western tech corridors.",
    culture: "Dakhni language, Deccani architecture, pearl and bangle trades, Irani cafes, Telugu cinema, and contemporary technology all leave visible marks.",
    people: "Hospitality comes with strong opinions about biryani and an instinct to feed the visitor before finishing directions.",
    contribution: "The city has influenced Deccan arts and cuisine while becoming a major centre for technology, pharmaceuticals, and cinema.",
    respect: "Dress and photograph thoughtfully around mosques and old-city religious spaces. Markets are communities, not sets.",
    microMoments: ["Irani chai beside a newspaper", "Charminar lights after dusk", "A lake bridge reflecting the new skyline"]
  },
  leh: {
    label: "High-altitude humility",
    themes: ["hill", "culture", "spiritual"],
    heading: "Leh rewards the traveller who can slow down before looking around.",
    vibe: "Clear, dry, contemplative, physically demanding, and shaped by long distances.",
    culture: "Ladakhi Buddhist traditions, monastery life, mountain agriculture, military presence, and newer tourism economies meet in a fragile landscape.",
    people: "Local calm should not be mistaken for unlimited tourist tolerance; water, waste, roads, and healthcare all carry mountain constraints.",
    contribution: "Leh connects ancient trans-Himalayan cultural routes with contemporary high-altitude research, defence, and responsible-travel conversations.",
    respect: "Acclimatise, conserve water, carry waste back, and ask before photographing people or ceremonies.",
    microMoments: ["Apricot tea after a slow walk", "Prayer flags moving above the old town", "The first full breath that finally feels easy"]
  },
  prayagraj: {
    label: "Confluence city",
    themes: ["spiritual", "heritage", "culture"],
    heading: "Prayagraj is where pilgrimage logistics meet university-town thought.",
    vibe: "Ceremonial at the Sangam, conversational in Civil Lines, and transformed completely during the Kumbh cycle.",
    culture: "River pilgrimage, Hindi-Urdu literary history, political institutions, education, and mela organisation shape the city.",
    people: "The local instinct is to give route advice through landmarks, food stops, and the current state of traffic.",
    contribution: "Prayagraj has played a significant role in India's political, literary, legal, and pilgrimage history.",
    respect: "At the Sangam, distinguish worship and private ritual from public spectacle. Ask before close photography.",
    microMoments: ["Mist above a dawn boat", "A bakery pause in Civil Lines", "Mela roads returning to ordinary city life"]
  },
  varanasi: {
    label: "Living eternity",
    themes: ["spiritual", "heritage", "culture"],
    heading: "Varanasi is not frozen in time; it is constantly performing time.",
    vibe: "Intense, intimate, musical, devotional, commercial, and impossible to absorb at one speed.",
    culture: "Ghat rituals, classical music, Sanskrit learning, weaving, street food, akharas, and neighbourhood worship form a living system.",
    people: "Humour and argument live beside devotion. The city rewards curiosity but notices disrespect immediately.",
    contribution: "Varanasi has shaped Indian philosophy, music, religious learning, handloom traditions, and cultural imagination for generations.",
    respect: "Never photograph cremation rites or grieving families. Keep distance and dignity at Manikarnika and Harishchandra ghats.",
    microMoments: ["A boatman's first oar at sunrise", "Loom rhythm inside a weaving lane", "Tea served in clay after the aarti crowd"]
  },
  indore: {
    label: "Snack-powered confidence",
    themes: ["culture", "commerce", "heritage"],
    heading: "Indore turns civic pride and appetite into a daily performance.",
    vibe: "Friendly, entrepreneurial, tidy-minded, late-eating, and quick to recommend three better versions of your plan.",
    culture: "Holkar history, Malwa food, cloth trade, education, and night markets shape an unusually sociable city centre.",
    people: "Food advice is delivered with conviction, and public cleanliness has become part of local identity.",
    contribution: "Indore is widely recognised for urban cleanliness efforts and remains a major commercial and educational centre in central India.",
    respect: "Use bins, follow market hygiene rules, and remember food streets are working ecosystems after dark.",
    microMoments: ["Poha before the city speeds up", "Rajwada glowing into evening", "Sarafa changing jobs after jewellery shutters close"]
  },
  ayodhya: {
    label: "Faith under transformation",
    themes: ["spiritual", "heritage"],
    heading: "Ayodhya asks for patience while an ancient pilgrimage city changes quickly.",
    vibe: "Devotional, security-led, river-soft at dusk, and intensely busy around major dates.",
    culture: "Ramayana traditions, temple circuits, Saryu worship, akharas, devotional music, and local sweets shape the visit.",
    people: "Residents navigate crowds, construction, and faith economy every day; courtesy matters more than visitor urgency.",
    contribution: "Ayodhya holds a central place in Hindu sacred geography and continues to influence art, performance, pilgrimage, and public memory.",
    respect: "Follow security and phone rules without argument. Do not push for content inside prayer or queue spaces.",
    microMoments: ["Morning steps at Hanuman Garhi", "A quiet pause inside Kanak Bhawan", "Saryu lamps after sunset"]
  },
  agra: {
    label: "Beyond the postcard",
    themes: ["heritage", "commerce", "culture"],
    heading: "Agra improves the moment you stop treating it as a two-hour monument stop.",
    vibe: "Tourist-facing, craft-skilled, historically dense, and calmer across the Yamuna at sunset.",
    culture: "Mughal architecture, pietra-dura inlay, leather work, old bazaars, and rich kitchens remain visible beyond the Taj gates.",
    people: "The visitor economy can be persistent, but artisan conversations reveal a more grounded city.",
    contribution: "Agra's monuments and stone-inlay traditions have shaped global understanding of Mughal art and architecture.",
    respect: "Buy craft with questions, not assumptions. Avoid photographing artisans closely without permission.",
    microMoments: ["The Taj changing colour after dawn", "Stone pieces becoming a flower", "A rooftop tea after day-trippers leave"]
  },
  manali: {
    label: "Mountain social life",
    themes: ["hill", "culture"],
    heading: "Manali is better as a valley relationship than a snow-point transaction.",
    vibe: "Adventurous, cafe-friendly, forested, weather-led, and dramatically busier on weekends.",
    culture: "Kulluvi traditions, wooden temples, orchard economies, Tibetan influences, trekking culture, and seasonal tourism share the valley.",
    people: "Hospitality runs alongside practical mountain caution; local advice about roads and weather deserves attention.",
    contribution: "Manali is a major gateway for Himalayan adventure and has helped bring mountaineering, trekking, and mountain travel into mainstream Indian tourism.",
    respect: "Use registered operators, reduce plastic, and do not turn rivers, snow slopes, or road edges into reckless photo sets.",
    microMoments: ["Cedar quiet around Hadimba", "A bridge walk into Old Manali", "Weather clearing above Solang"],
    sources: [
      { label: "Incredible India: Manali", href: "https://www.incredibleindia.gov.in/en/himachal-pradesh/manali" },
      { label: "Incredible India: Solang", href: "https://www.incredibleindia.gov.in/en/himachal-pradesh/manali/solang-nullah" }
    ]
  },
  shimla: {
    label: "A capital on foot",
    themes: ["hill", "heritage", "culture"],
    heading: "Shimla's public life survives because its centre still belongs to walkers.",
    vibe: "Civic, nostalgic, steep, conversational, and unexpectedly urban beneath the hill-station image.",
    culture: "Himachali handloom, theatre, colonial-era institutions, state politics, mountain rail, and Lower Bazaar commerce overlap on the ridge.",
    people: "Residents climb what visitors call attractions; make room for ordinary life on narrow pedestrian paths.",
    contribution: "Shimla's built heritage and UNESCO-listed mountain railway document a distinctive chapter in Himalayan urban and transport history.",
    respect: "Keep pedestrian routes clear, manage waste, and avoid treating heritage buildings as disposable photo props.",
    microMoments: ["Coffee where writers once argued", "Cloud opening north of the Ridge", "A toy train rounding a hillside"],
    sources: [
      { label: "Himachal Tourism: Shimla", href: "https://himachaltourism.gov.in/destination/shimla/" },
      { label: "UNESCO: Kalka-Shimla Railway", href: "https://whc.unesco.org/en/decisions/1489" }
    ]
  },
  mussoorie: {
    label: "The long ridge",
    themes: ["hill", "heritage", "culture"],
    heading: "Mussoorie's best attraction is often the walk between attractions.",
    vibe: "Bookish, misty, weekend-busy, old-fashioned in places, and quietly beautiful before breakfast.",
    culture: "Garhwali life, Tibetan community history, cantonment heritage, schools, writers, and tourism all shape the ridge.",
    people: "Those serving a weekend crowd also live through water stress, traffic, and landslide seasons.",
    contribution: "Mussoorie has long influenced Indian hill education, writing, surveying history, and the cultural idea of a mountain retreat.",
    respect: "Walk softly through Landour neighbourhoods, keep noise low, and carry waste out of forest bends.",
    microMoments: ["Mist swallowing Camel's Back Road", "A bakery window in Landour", "Winterline colour over the Doon valley"],
    sources: [
      { label: "Uttarakhand Tourism: Mussoorie", href: "https://www.uttarakhandtourism.gov.in/destination/mussoorie" }
    ]
  },
  darjeeling: {
    label: "Tea and mountain memory",
    themes: ["hill", "heritage", "culture"],
    heading: "Darjeeling is a living hill community, not a colonial mood board.",
    vibe: "Early-rising, multilingual, tea-scented, cloud-sensitive, and musically alive.",
    culture: "Nepali-speaking hill culture, Tibetan and Bengali influences, tea labour histories, mountaineering, schools, and railway heritage all matter.",
    people: "Warmth is often direct and practical. Respect local identity instead of flattening everyone into a generic hill-station label.",
    contribution: "Darjeeling is globally associated with tea, Himalayan mountaineering, and a pioneering UNESCO-listed mountain railway.",
    respect: "Ask before photographing tea workers and residents. Buy with attention to origin and labour, not packaging alone.",
    microMoments: ["Kanchenjunga appearing without warning", "Steam and whistles near Ghoom", "Momo after a cold Chowrasta walk"],
    sources: [
      { label: "West Bengal Tourism: Darjeeling Railway", href: "https://www.wbtourism.gov.in/Heritage%20Tourism/details?id=63fca17bcec836803000e1ad&template_id=1" },
      { label: "UNESCO: Darjeeling Himalayan Railway", href: "https://whc.unesco.org/en/activities/760/" }
    ]
  },
  rishikesh: {
    label: "River, practice, adrenaline",
    themes: ["spiritual", "hill", "culture"],
    heading: "Rishikesh holds stillness and adventure on the same river.",
    vibe: "International, devotional, youthful, wellness-focused, and occasionally louder than its setting deserves.",
    culture: "Ashram learning, yoga lineages, river worship, Garhwali gateways, global seekers, and adventure businesses coexist.",
    people: "Teachers, pilgrims, guides, students, and residents use the same bridges for very different reasons.",
    contribution: "Rishikesh helped globalise modern yoga travel while becoming one of India's best-known river-adventure gateways.",
    respect: "Keep prayer spaces quiet, choose authorised operators, and do not confuse spiritual openness with permission to ignore local norms.",
    microMoments: ["First light on a quiet ghat", "Rafts returning below the bridges", "Evening lamps moving along the Ganga"],
    sources: [
      { label: "Uttarakhand Tourism: Rishikesh", href: "https://www.uttarakhandtourism.gov.in/destination/rishikesh" }
    ]
  },
  haridwar: {
    label: "Gateway of ritual",
    themes: ["spiritual", "heritage"],
    heading: "Haridwar is faith organised at city scale.",
    vibe: "Ceremonial, crowded, river-led, disciplined, and quieter than expected away from the main ghat.",
    culture: "Ganga worship, ashrams, Ayurveda, Sanskrit learning, pilgrimage trade, and seasonal melas guide the city's calendar.",
    people: "Residents are experts in crowd rhythm. Follow local directions instead of improvising around barricades.",
    contribution: "Haridwar is one of India's major pilgrimage centres and a gateway for Himalayan sacred routes and traditional wellness study.",
    respect: "Protect privacy at bathing and ritual areas, avoid river pollution, and treat aarti as worship rather than content.",
    microMoments: ["Morning bells before market noise", "A ropeway rising above the plains", "Hundreds of lamps reflected at dusk"],
    sources: [
      { label: "Uttarakhand Tourism: Haridwar", href: "https://uttarakhandtourism.gov.in/destination/haridwar" }
    ]
  },
  ujjain: {
    label: "The city of sacred time",
    themes: ["spiritual", "heritage", "culture"],
    heading: "Ujjain connects devotion, astronomy, and the ancient imagination of time.",
    vibe: "Pre-dawn, Shiva-centred, processional, scholarly beneath the surface, and intense on festival dates.",
    culture: "Jyotirlinga worship, Shipra ghats, akharas, Mahakal processions, Sanskrit learning, and astronomical heritage shape the city.",
    people: "Pilgrim hospitality sits beside strong ritual norms; observe first when a practice is unfamiliar.",
    contribution: "Ujjain has long been important to Indian sacred geography, astronomy, calendar traditions, and classical learning.",
    respect: "Use official booking systems, follow temple rules, and never let access anxiety turn into queue aggression.",
    microMoments: ["The old city awake before sunrise", "Shadows moving across Vedh Shala instruments", "Ram Ghat settling into evening"],
    sources: [
      { label: "Incredible India: Ujjain", href: "https://www.incredibleindia.gov.in/en/madhya-pradesh/ujjain/ujjain-the-temple-city-in-spotlight" },
      { label: "Incredible India: Vedh Shala", href: "https://www.incredibleindia.gov.in/en/madhya-pradesh/ujjain/vedshala" }
    ]
  },
  amritsar: {
    label: "Seva and memory",
    themes: ["spiritual", "heritage", "culture"],
    heading: "Amritsar feeds the visitor, then asks the visitor to remember.",
    vibe: "Devotional, generous, food-proud, historically heavy, and vividly social.",
    culture: "Sikh faith, langar and seva, Punjabi food, phulkari, old bazaars, Partition memory, and borderland history shape the city.",
    people: "Help often arrives with a food recommendation. Hospitality is generous, but sacred etiquette is non-negotiable.",
    contribution: "Amritsar is a global centre of Sikh faith and an essential place for understanding Punjab's cultural vitality and Partition history.",
    respect: "Cover your head and follow gurdwara conduct sincerely. Do not make grief, prayer, or seva into a performance.",
    microMoments: ["The sarovar before sunrise", "Hands working together in the langar", "A quiet pause inside the Partition Museum"],
    sources: [
      { label: "District Amritsar: Culture", href: "https://amritsar.nic.in/culture-heritage/" },
      { label: "Incredible India: Partition Museum", href: "https://www.incredibleindia.gov.in/en/punjab/amritsar/partition-museum" }
    ]
  },
  ...regionalCityEditorials
};

export function getCityEditorial(slug: string) {
  return cityEditorials[slug] || null;
}
