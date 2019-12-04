declare module "flix" {
  export interface Station {
    type?: string;
    id: string;
    name?: string;
    importance?: number;
  }

  export interface Leg {
    origin: Station | Station[];
    destination: Station | Station[];
    departure: string;
    arrival: string;
    operator: {
      type: string;
      id: string;
      name: string;
      url: string;
      address: string;
    };
    mode: string;
    public: boolean;
  }

  export interface Journey {
    type: string;
    id: string;
    legs: Leg[];
    status: string;
    borders: boolean;
    info: {
      title?: string;
      hint?: string;
      message?: string;
      warnings: string[];
    };
    price: {
      amount: number;
      currency: string;
      discounts?: string;
      saleRestriction: boolean;
      available: boolean;
      url: string;
    };
  }

  export interface JourneysOption {
    when: Date;
    interval: number;
    transfers: number;
  }

  export function journeys(
    origin: Station,
    destination: Station,
    options?: JourneysOption
  ): Promise<Journey[]>;

  export interface Region {
    type: string;
    id: string;
    name: string;
    location: {
      type: string;
      longitude: number;
      latitude: number;
      country: {
        name: string;
        code: string;
      };
    };
    class: string;
    stations: string[];
    connections: number[];
    slug: string;
  }

  export namespace regions {
    export function all(): any;
  }
}
