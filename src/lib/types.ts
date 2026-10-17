export const categories = {
  all: "All places",
  attractions: "Attractions",
  restaurants: "Restaurants",
  cafes: "Cafés",
  parks: "Parks",
  museums: "Museums",
} as const;
export type Category = keyof typeof categories;
export type Place = {
  id: string;
  name: string;
  address: string;
  category: string;
  latitude: number;
  longitude: number;
  distance?: number;
  website?: string;
  phone?: string;
  openingHours?: string;
};
export type ItineraryItem = {
  id: string;
  visitor_id: string;
  place_id: string;
  name: string;
  address: string;
  category: string;
  latitude: number;
  longitude: number;
  created_at: string;
};
