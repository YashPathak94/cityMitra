import { imageForTheme } from "@/lib/category-images";

// Blog infrastructure only — these two posts are placeholders so the section
// isn't empty. Replace/extend with the real posts migrated from the GoDaddy
// blog (paste the content or the post URLs and they'll be swapped in here).
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO date
  author: string;
  coverImage: string;
  tags: string[];
  body: string[]; // paragraphs
};

export const blogPosts: BlogPost[] = [
  {
    slug: "fund-your-next-trip-smarter",
    title: "5 Ways to Fund Your Next Trip Without Feeling the Pinch",
    excerpt:
      "A trip doesn't have to mean draining your savings in one go. Here are five practical ways Indian travellers plan and pay for a trip well ahead of time.",
    date: "2026-06-01",
    author: "CityMitra Team",
    coverImage: imageForTheme("flight"),
    tags: ["Travel Planning", "Budgeting"],
    body: [
      "Most trips get funded the same last-minute way: a chunk of savings, a credit card swipe, and some post-trip regret. It doesn't have to be that way if you start planning even a few months out.",
      "Start with the number, not the destination. Once you know roughly what a trip costs — flights, stay, food, local travel — you can reverse-engineer a monthly saving target instead of hoping the money shows up.",
      "Automate a small, boring, recurring transfer into a short-term fund the moment you decide to travel. The earlier you start, the smaller that monthly number needs to be.",
      "Use card rewards deliberately, not accidentally. Many Indian travel and cashback cards return 2-5% on travel bookings — that's real money back on flights and hotels you were booking anyway.",
      "Compare transport modes honestly. Flights aren't always faster once you count airport time; trains and buses can be meaningfully cheaper on routes under 6-8 hours.",
      "Finally, keep the plan visible. CityMitra's Travel Plan calculator does the destination-to-savings-plan math for you, so the number stays real instead of aspirational."
    ]
  },
  {
    slug: "exploring-local-markets-india",
    title: "The Real Way to Explore a Local Market in an Indian City",
    excerpt:
      "Wholesale markets, sarees, electronics, street food — every Indian city has a market district that rewards a bit of local knowledge. Here's how to actually explore one well.",
    date: "2026-05-18",
    author: "CityMitra Team",
    coverImage: imageForTheme("market"),
    tags: ["City Guides", "Shopping"],
    body: [
      "Every Indian city has at least one market district that locals swear by and visitors usually stumble into by accident. Knowing which lane sells what saves hours of wandering.",
      "Go early or go late — markets between 12pm and 4pm are often at their most crowded and least negotiable. Early morning or early evening tends to be calmer and better for bargaining.",
      "Know the specialty before you go. A market known for textiles isn't necessarily your best bet for electronics, even if a few stalls carry both. Ask locally or check a city guide first.",
      "Carry small denominations. Wholesale and street markets move fast, and stalls not breaking large notes is one of the most common (and avoidable) friction points.",
      "Use a map, not memory, to get back. Market lanes rarely follow a grid, and it's easy to lose your bearings after twenty minutes of browsing.",
      "CityMitra's city guides list the actual market clusters worth visiting per city, with what each one is genuinely known for, so you're not guessing on the ground."
    ]
  }
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
