import { Landmark, MapPin, TreePine, Umbrella, Utensils, type LucideIcon } from "lucide-react";

type CategoryStyle = { icon: LucideIcon; color: string; backgroundColor: string };

// Dark foregrounds on pale backgrounds keep small badge text easy to read.
export const categoryStyles = {
  sights: { icon: Landmark, color: "#115e59", backgroundColor: "#f0fdfa" },
  museums: { icon: Landmark, color: "#5b21b6", backgroundColor: "#f5f3ff" },
  parks: { icon: TreePine, color: "#166534", backgroundColor: "#f0fdf4" },
  restaurants: { icon: Utensils, color: "#9a3412", backgroundColor: "#fff7ed" },
  beaches: { icon: Umbrella, color: "#075985", backgroundColor: "#f0f9ff" },
  default: { icon: MapPin, color: "#334155", backgroundColor: "#f1f5f9" },
} satisfies Record<string, CategoryStyle>;

// Accept both friendly names and the dotted categories returned by Geoapify.
export function getCategoryStyle(category: string): CategoryStyle {
  const parts = category.trim().toLowerCase().split(".");
  if (parts.some(part => part === "beach" || part === "beaches")) return categoryStyles.beaches;
  if (parts.some(part => part === "museum" || part === "museums")) return categoryStyles.museums;
  if (parts.some(part => part === "park" || part === "parks")) return categoryStyles.parks;
  if (parts.some(part => part === "restaurant" || part === "restaurants")) return categoryStyles.restaurants;
  if (parts.some(part => ["tourism", "sights", "sight", "attractions", "attraction"].includes(part))) return categoryStyles.sights;
  return categoryStyles.default;
}
