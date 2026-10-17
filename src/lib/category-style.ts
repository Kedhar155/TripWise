import { Landmark, MapPin, TreePine, Umbrella, Utensils, type LucideIcon } from "lucide-react";

type CategoryStyle = { icon: LucideIcon; color: string; backgroundColor: string; singular: string; plural: string };

// Dark foregrounds on pale backgrounds keep small badge text easy to read.
export const categoryStyles = {
  sights: { singular: "sight", plural: "sights", icon: Landmark, color: "#115e59", backgroundColor: "#f0fdfa" },
  museums: { singular: "museum", plural: "museums", icon: Landmark, color: "#5b21b6", backgroundColor: "#f5f3ff" },
  parks: { singular: "park", plural: "parks", icon: TreePine, color: "#166534", backgroundColor: "#f0fdf4" },
  restaurants: { singular: "restaurant", plural: "restaurants", icon: Utensils, color: "#9a3412", backgroundColor: "#fff7ed" },
  beaches: { singular: "beach", plural: "beaches", icon: Umbrella, color: "#075985", backgroundColor: "#f0f9ff" },
  default: { singular: "other place", plural: "other places", icon: MapPin, color: "#334155", backgroundColor: "#f1f5f9" },
} satisfies Record<string, CategoryStyle>;

// Accept both friendly names and the dotted categories returned by Geoapify.
export function getCategoryKey(category: string): keyof typeof categoryStyles {
  const parts = category.trim().toLowerCase().split(".");
  if (parts.some(part => part === "beach" || part === "beaches")) return "beaches";
  if (parts.some(part => part === "museum" || part === "museums")) return "museums";
  if (parts.some(part => part === "park" || part === "parks")) return "parks";
  if (parts.some(part => part === "restaurant" || part === "restaurants")) return "restaurants";
  if (parts.some(part => ["tourism", "sights", "sight", "attractions", "attraction"].includes(part))) return "sights";
  return "default";
}

export function getCategoryStyle(category: string): CategoryStyle {
  return categoryStyles[getCategoryKey(category)];
}
