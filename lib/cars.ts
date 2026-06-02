export type Car = {
  id: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  location: string;
  mileage: number;
  fuel: "Petrol" | "Diesel" | "CNG" | "EV";
  transmission: "Manual" | "Automatic";
  ownership: "1st owner" | "2nd owner" | "3rd owner" | "4th+ owner";
  valueScore: number;
  marketDelta: number;
  added: string;
  bodyType: "Hatchback" | "Sedan" | "SUV" | "EV";
  color: string;
  sourcePlatform: string;
  sourceListingUrl: string;
  dealerName: string;
  insuranceValid: boolean;
  serviceHistory: "full" | "partial" | "missing";
  accidentHistory: "none" | "minor" | "major";
  imageUrls: string[];
  priceDropped: boolean;
  imagePosition: string;
  highlights: string[];
  inspection: {
    engine: number;
    exterior: number;
    tyres: number;
    documents: number;
  };
};

export const cars: Car[] = [
  {
    id: "honda-city-zx-cvt",
    brand: "Honda",
    model: "City",
    variant: "ZX CVT",
    year: 2021,
    price: 1085000,
    location: "Bengaluru",
    mileage: 29000,
    fuel: "Petrol",
    transmission: "Automatic",
    ownership: "1st owner",
    valueScore: 94,
    marketDelta: -72000,
    added: "Today",
    bodyType: "Sedan",
    color: "Silver",
    sourcePlatform: "Cars24",
    sourceListingUrl: "https://www.cars24.com/",
    dealerName: "Cars24 Whitefield Hub",
    insuranceValid: true,
    serviceHistory: "full",
    accidentHistory: "none",
    imageUrls: [],
    priceDropped: true,
    imagePosition: "74% 64%",
    highlights: ["Dealer warranty", "Full service history", "No accident record"],
    inspection: { engine: 97, exterior: 91, tyres: 88, documents: 100 }
  },
  {
    id: "hyundai-i20-asta",
    brand: "Hyundai",
    model: "i20",
    variant: "Asta",
    year: 2022,
    price: 840000,
    location: "Pune",
    mileage: 18400,
    fuel: "Petrol",
    transmission: "Manual",
    ownership: "1st owner",
    valueScore: 91,
    marketDelta: -48000,
    added: "Today",
    bodyType: "Hatchback",
    color: "Black",
    sourcePlatform: "Spinny",
    sourceListingUrl: "https://www.spinny.com/",
    dealerName: "Spinny Pune",
    insuranceValid: true,
    serviceHistory: "partial",
    accidentHistory: "none",
    imageUrls: [],
    priceDropped: false,
    imagePosition: "50% 64%",
    highlights: ["Low mileage", "Premium audio", "Fresh tyres"],
    inspection: { engine: 94, exterior: 89, tyres: 93, documents: 100 }
  },
  {
    id: "kia-seltos-htx",
    brand: "Kia",
    model: "Seltos",
    variant: "HTX",
    year: 2020,
    price: 1295000,
    location: "Hyderabad",
    mileage: 42600,
    fuel: "Diesel",
    transmission: "Manual",
    ownership: "1st owner",
    valueScore: 89,
    marketDelta: -61000,
    added: "Yesterday",
    bodyType: "SUV",
    color: "White",
    sourcePlatform: "Dealer Direct",
    sourceListingUrl: "https://www.cardekho.com/",
    dealerName: "Prime Auto Hyderabad",
    insuranceValid: true,
    serviceHistory: "missing",
    accidentHistory: "minor",
    imageUrls: [],
    priceDropped: true,
    imagePosition: "35% 64%",
    highlights: ["Top inspected", "New battery", "Zero loan pending"],
    inspection: { engine: 92, exterior: 86, tyres: 84, documents: 100 }
  },
  {
    id: "skoda-slavia-tsi",
    brand: "Skoda",
    model: "Slavia",
    variant: "1.0 TSI Style",
    year: 2023,
    price: 1320000,
    location: "Delhi NCR",
    mileage: 12900,
    fuel: "Petrol",
    transmission: "Automatic",
    ownership: "1st owner",
    valueScore: 88,
    marketDelta: -36000,
    added: "2 days ago",
    bodyType: "Sedan",
    color: "Silver",
    sourcePlatform: "CarTrade",
    sourceListingUrl: "https://www.cartrade.com/",
    dealerName: "NCR Premium Cars",
    insuranceValid: true,
    serviceHistory: "partial",
    accidentHistory: "none",
    imageUrls: [],
    priceDropped: false,
    imagePosition: "70% 64%",
    highlights: ["Under warranty", "Low km", "Ceramic coated"],
    inspection: { engine: 96, exterior: 90, tyres: 89, documents: 100 }
  },
  {
    id: "maruti-baleno-alpha",
    brand: "Maruti Suzuki",
    model: "Baleno",
    variant: "Alpha",
    year: 2022,
    price: 715000,
    location: "Mumbai",
    mileage: 21200,
    fuel: "Petrol",
    transmission: "Manual",
    ownership: "1st owner",
    valueScore: 86,
    marketDelta: -28000,
    added: "3 days ago",
    bodyType: "Hatchback",
    color: "Black",
    sourcePlatform: "Cars24",
    sourceListingUrl: "https://www.cars24.com/",
    dealerName: "Cars24 Thane Hub",
    insuranceValid: true,
    serviceHistory: "missing",
    accidentHistory: "none",
    imageUrls: [],
    priceDropped: true,
    imagePosition: "49% 64%",
    highlights: ["City driven", "High resale", "Verified owner"],
    inspection: { engine: 91, exterior: 87, tyres: 82, documents: 99 }
  },
  {
    id: "tata-nexon-xz-plus",
    brand: "Tata",
    model: "Nexon",
    variant: "XZ Plus",
    year: 2021,
    price: 975000,
    location: "Chennai",
    mileage: 33800,
    fuel: "Diesel",
    transmission: "Manual",
    ownership: "2nd owner",
    valueScore: 84,
    marketDelta: -21000,
    added: "4 days ago",
    bodyType: "SUV",
    color: "White",
    sourcePlatform: "OLX Autos",
    sourceListingUrl: "https://www.olx.in/cars/",
    dealerName: "Chennai Certified Motors",
    insuranceValid: true,
    serviceHistory: "partial",
    accidentHistory: "none",
    imageUrls: [],
    priceDropped: false,
    imagePosition: "34% 64%",
    highlights: ["5-star safety", "Service package", "Clean insurance"],
    inspection: { engine: 88, exterior: 84, tyres: 86, documents: 98 }
  }
];

export const formatPrice = (value: number) => {
  if (value >= 100000) {
    const lakh = value / 100000;
    return `Rs ${lakh.toFixed(lakh >= 10 ? 2 : 1)}L`;
  }

  return `Rs ${value.toLocaleString("en-IN")}`;
};

export const formatKm = (value: number) => `${value.toLocaleString("en-IN")} km`;

export const getCarById = (id: string) => cars.find((car) => car.id === id) ?? cars[0];

export const valueTone = (score: number) => {
  if (score >= 90) return "text-emerald-700 bg-emerald-50 border-emerald-100";
  if (score >= 84) return "text-blue-700 bg-blue-50 border-blue-100";
  return "text-amber-700 bg-amber-50 border-amber-100";
};
