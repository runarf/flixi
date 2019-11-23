declare module "flix" {
  export interface Station {
    type?: string;
    id: string;
    name: string;
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
    origin: string,
    destination: string,
    options: JourneysOption
  ): Promise<Journey[]>;
}
