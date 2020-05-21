import { Station } from "flix";
export interface Trip {
  departure: String;
  arrival: String;
  origin: Station[];
  destination: Station[];
  price: number;
  url: string;
  isDirect: boolean;
}
export interface ThereAndBackTrips {
  there: Trip[];
  back: Trip[];
}
