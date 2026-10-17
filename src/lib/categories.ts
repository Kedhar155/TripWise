import { BedDouble, Drama, Landmark, MapPin, ShoppingBag, TreePine, Umbrella, Utensils, type LucideIcon } from "lucide-react";

type MainCategory = {
  label: string; icon: LucideIcon; color: string; backgroundColor: string;
  singular: string; plural: string; geoapify: readonly string[];
  aliases: readonly string[]; priority: number;
};

// One catalog for search, classification, badges, filters, and saved trips.
// Prefixes include descendants. Priority resolves places with several tags:
// e.g. a museum tagged tourism + entertainment is still Museums and Culture.
export const categories = {
  sights: { label: "Sights and Tourism", singular: "sight", plural: "sights", icon: Landmark, color: "#115e59", backgroundColor: "#f0fdfa", geoapify: ["tourism", "heritage", "religion"], aliases: ["attractions", "attraction", "sight"], priority: 10 },
  museums: { label: "Museums and Culture", singular: "museum or cultural place", plural: "museums and cultural places", icon: Landmark, color: "#5b21b6", backgroundColor: "#f5f3ff", geoapify: ["entertainment.museum", "entertainment.culture"], aliases: ["museum"], priority: 90 },
  parks: { label: "Parks and Nature", singular: "park or nature spot", plural: "parks and nature spots", icon: TreePine, color: "#166534", backgroundColor: "#f0fdf4", geoapify: ["leisure.park", "leisure.picnic", "natural", "national_park"], aliases: ["park"], priority: 80 },
  restaurants: { label: "Restaurants and Cafes", singular: "restaurant or cafe", plural: "restaurants and cafes", icon: Utensils, color: "#9a3412", backgroundColor: "#fff7ed", geoapify: ["catering"], aliases: ["restaurant", "cafes", "cafe"], priority: 70 },
  beaches: { label: "Beaches", singular: "beach", plural: "beaches", icon: Umbrella, color: "#075985", backgroundColor: "#f0f9ff", geoapify: ["beach"], aliases: ["natural.beach"], priority: 100 },
  entertainment: { label: "Entertainment", singular: "entertainment spot", plural: "entertainment spots", icon: Drama, color: "#9d174d", backgroundColor: "#fdf2f8", geoapify: ["entertainment", "leisure.playground", "leisure.spa", "sport"], aliases: [], priority: 60 },
  shopping: { label: "Shopping", singular: "shop", plural: "shops", icon: ShoppingBag, color: "#854d0e", backgroundColor: "#fefce8", geoapify: ["commercial"], aliases: [], priority: 50 },
  accommodation: { label: "Accommodation", singular: "place to stay", plural: "places to stay", icon: BedDouble, color: "#3730a3", backgroundColor: "#eef2ff", geoapify: ["accommodation", "camping"], aliases: [], priority: 40 },
  other: { label: "Other", singular: "other place", plural: "other places", icon: MapPin, color: "#334155", backgroundColor: "#f1f5f9", geoapify: ["amenity", "rental", "service"], aliases: ["default"], priority: 0 },
} as const satisfies Record<string, MainCategory>;

export type Category = keyof typeof categories;
export const categoryEntries = Object.entries(categories) as [Category, MainCategory][];
export const allCategories = { label: "All", icon: MapPin };

export function getCategoryKey(value: string | readonly string[]): Category {
  const tags = (typeof value === "string" ? [value] : value).map(tag => tag.trim().toLowerCase());
  let result: Category = "other";
  let priority = -1;
  for (const [key, entry] of categoryEntries) {
    if (entry.priority > priority && tags.some(tag => tag === key || entry.aliases.includes(tag) || entry.geoapify.some(prefix => tag === prefix || tag.startsWith(`${prefix}.`)))) {
      result = key;
      priority = entry.priority;
    }
  }
  return result;
}

export function getCategoryStyle(value: string | readonly string[]) {
  return categories[getCategoryKey(value)];
}

export function geoapifyCategories(selected: readonly Category[]) {
  const prefixes = [...new Set(selected.flatMap(key => [...categories[key].geoapify]))];
  // Broader selected prefixes already include their children.
  return prefixes.filter(prefix => !prefixes.some(parent => parent !== prefix && prefix.startsWith(`${parent}.`))).join(",");
}

// Old bookmarked API URLs remain valid; aliases live beside their category.
export function parseCategory(value: string): Category | undefined {
  return categoryEntries.find(([key, entry]) => key === value || entry.aliases.includes(value))?.[0];
}
