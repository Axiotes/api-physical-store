import { LatLng } from './lat-lng.interface';

export interface DirectionsResponse {
  geocoded_waypoints: GeocodedWaypoint[];
  routes: Route[];
  status: string;
}

interface GeocodedWaypoint {
  geocoder_status: string;
  place_id: string;
  types: string[];
}

interface Route {
  bounds: Bounds;
  copyrights: string;
  legs: Leg[];
}

interface Bounds {
  northeast: LatLng;
  southwest: LatLng;
}

interface Leg {
  distance: TextValue;
  duration: TextValue;
  end_address: string;
  end_location: LatLng;
  start_address: string;
  start_location: LatLng;
  steps: Step[];
}

interface TextValue {
  text: string;
  value: number;
}

interface Step {
  distance: TextValue;
  duration: TextValue;
  end_location: LatLng;
  html_instructions: string;
  polyline: Polyline;
  start_location: LatLng;
  travel_mode: string;
  maneuver?: string;
}

interface Polyline {
  points: string;
}
