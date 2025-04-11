import { LatLng } from "./lat-lng.interface";

export interface GeocodeResponse {
  results: GeoResult[];
  status: string;
}

interface GeoResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  types: string[];
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Geometry {
  location: LatLng;
  location_type: string;
  viewport: Viewport;
}

interface Viewport {
  northeast: LatLng;
  southwest: LatLng;
}
