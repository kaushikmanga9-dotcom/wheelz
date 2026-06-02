export type FuelType = "Petrol" | "Diesel" | "CNG" | "EV" | "Hybrid" | string;
export type TransmissionType = "Manual" | "Automatic" | string;
export type AccidentHistory = "none" | "minor" | "major" | boolean;
export type ServiceHistory = "full" | "partial" | "missing" | boolean;
export type CityDemand = "low" | "medium" | "high" | number;

export type ValueScoreInput = {
  listedPrice: number;
  marketAveragePrice: number;
  kilometersDriven: number;
  carAgeYears: number;
  numberOfOwners: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  accidentHistory: AccidentHistory;
  serviceHistory: ServiceHistory;
  cityDemand: CityDemand;
};

export type DealLabel = "Great Deal" | "Good Deal" | "Fair Price" | "Overpriced";

export type ValueScoreResult = {
  score: number;
  dealLabel: DealLabel;
  explanation: string;
  breakdown: {
    price: number;
    kilometers: number;
    age: number;
    owners: number;
    fuelAndTransmission: number;
    accident: number;
    service: number;
    demand: number;
  };
};

const EXPECTED_KM_PER_YEAR = 12000;

export function calculateValueScore(input: ValueScoreInput): ValueScoreResult {
  validateInput(input);

  const priceScore = scorePrice(input.listedPrice, input.marketAveragePrice);
  const kilometersScore = scoreKilometers(input.kilometersDriven, input.carAgeYears);
  const ageScore = scoreAge(input.carAgeYears);
  const ownersScore = scoreOwners(input.numberOfOwners);
  const fuelAndTransmissionScore = scoreFuelAndTransmission(input.fuelType, input.transmission);
  const accidentScore = scoreAccident(input.accidentHistory);
  const serviceScore = scoreService(input.serviceHistory);
  const demandScore = scoreCityDemand(input.cityDemand);

  const rawScore =
    priceScore +
    kilometersScore +
    ageScore +
    ownersScore +
    fuelAndTransmissionScore +
    accidentScore +
    serviceScore +
    demandScore;

  const score = applyRiskCaps(Math.round(rawScore), input);
  const dealLabel = getDealLabel(score);

  return {
    score,
    dealLabel,
    explanation: buildExplanation(input, score, dealLabel),
    breakdown: {
      price: round(priceScore),
      kilometers: round(kilometersScore),
      age: round(ageScore),
      owners: round(ownersScore),
      fuelAndTransmission: round(fuelAndTransmissionScore),
      accident: round(accidentScore),
      service: round(serviceScore),
      demand: round(demandScore)
    }
  };
}

function scorePrice(listedPrice: number, marketAveragePrice: number) {
  const discountPercent = (marketAveragePrice - listedPrice) / marketAveragePrice;

  if (discountPercent >= 0.18) return 35;
  if (discountPercent >= 0.12) return 32;
  if (discountPercent >= 0.06) return 28;
  if (discountPercent >= 0) return 23;
  if (discountPercent >= -0.06) return 17;
  if (discountPercent >= -0.12) return 10;
  if (discountPercent >= -0.2) return 5;
  return 0;
}

function scoreKilometers(kilometersDriven: number, carAgeYears: number) {
  const expectedKm = Math.max(1, carAgeYears * EXPECTED_KM_PER_YEAR);
  const usageRatio = kilometersDriven / expectedKm;

  if (usageRatio <= 0.65) return 15;
  if (usageRatio <= 0.85) return 13;
  if (usageRatio <= 1.05) return 10;
  if (usageRatio <= 1.3) return 7;
  if (usageRatio <= 1.6) return 4;
  return 1;
}

function scoreAge(carAgeYears: number) {
  if (carAgeYears <= 2) return 10;
  if (carAgeYears <= 5) return 8;
  if (carAgeYears <= 8) return 5;
  if (carAgeYears <= 12) return 2;
  return 0;
}

function scoreOwners(numberOfOwners: number) {
  if (numberOfOwners <= 1) return 8;
  if (numberOfOwners === 2) return 5;
  if (numberOfOwners === 3) return 2;
  return 0;
}

function scoreFuelAndTransmission(fuelType: FuelType, transmission: TransmissionType) {
  const fuel = fuelType.toLowerCase();
  const gearbox = transmission.toLowerCase();

  const fuelScore =
    fuel === "ev" || fuel === "hybrid" ? 2.5 : fuel === "cng" ? 2.2 : fuel === "petrol" ? 2 : fuel === "diesel" ? 1.6 : 1.8;

  const transmissionScore = gearbox === "automatic" ? 2.5 : gearbox === "manual" ? 2 : 1.8;

  return fuelScore + transmissionScore;
}

function scoreAccident(accidentHistory: AccidentHistory) {
  const accident = normalizeAccident(accidentHistory);

  if (accident === "none") return 12;
  if (accident === "minor") return 7;
  return 0;
}

function scoreService(serviceHistory: ServiceHistory) {
  const service = normalizeService(serviceHistory);

  if (service === "full") return 10;
  if (service === "partial") return 5;
  return 0;
}

function scoreCityDemand(cityDemand: CityDemand) {
  const demand = normalizeDemand(cityDemand);
  return demand * 5;
}

function applyRiskCaps(score: number, input: ValueScoreInput) {
  let cappedScore = clamp(score, 0, 100);
  const accident = normalizeAccident(input.accidentHistory);
  const pricePremiumPercent = (input.listedPrice - input.marketAveragePrice) / input.marketAveragePrice;

  if (accident === "major") cappedScore = Math.min(cappedScore, 54);
  if (pricePremiumPercent >= 0.2) cappedScore = Math.min(cappedScore, 54);
  if (normalizeService(input.serviceHistory) === "missing") cappedScore = Math.min(cappedScore, 72);

  return cappedScore;
}

function getDealLabel(score: number): DealLabel {
  if (score >= 85) return "Great Deal";
  if (score >= 70) return "Good Deal";
  if (score >= 55) return "Fair Price";
  return "Overpriced";
}

function buildExplanation(input: ValueScoreInput, score: number, dealLabel: DealLabel) {
  const priceDifference = input.marketAveragePrice - input.listedPrice;
  const pricePercent = Math.abs(priceDifference / input.marketAveragePrice) * 100;
  const priceText =
    priceDifference > 0
      ? `It is priced about ${Math.round(pricePercent)}% below similar cars.`
      : priceDifference < 0
        ? `It is priced about ${Math.round(pricePercent)}% above similar cars.`
        : "It is priced close to the market average.";

  const expectedKm = Math.max(1, input.carAgeYears * EXPECTED_KM_PER_YEAR);
  const kmText =
    input.kilometersDriven <= expectedKm * 0.85
      ? "The kilometers driven are lower than expected for its age."
      : input.kilometersDriven <= expectedKm * 1.15
        ? "The kilometers driven are normal for its age."
        : "The kilometers driven are higher than expected for its age.";

  const accident = normalizeAccident(input.accidentHistory);
  const accidentText =
    accident === "none"
      ? "There is no accident history reported."
      : accident === "minor"
        ? "It has minor accident history, so the score is reduced slightly."
        : "It has major accident history, which strongly reduces the score.";

  const service = normalizeService(input.serviceHistory);
  const serviceText =
    service === "full"
      ? "A full service history improves confidence."
      : service === "partial"
        ? "A partial service history keeps the score moderate."
        : "Missing service history reduces buyer confidence.";

  return `${dealLabel} with a value score of ${score}/100. ${priceText} ${kmText} ${accidentText} ${serviceText}`;
}

function normalizeAccident(accidentHistory: AccidentHistory): "none" | "minor" | "major" {
  if (typeof accidentHistory === "boolean") return accidentHistory ? "major" : "none";
  const value = accidentHistory.toLowerCase();
  if (value === "minor") return "minor";
  if (value === "major") return "major";
  return "none";
}

function normalizeService(serviceHistory: ServiceHistory): "full" | "partial" | "missing" {
  if (typeof serviceHistory === "boolean") return serviceHistory ? "full" : "missing";
  const value = serviceHistory.toLowerCase();
  if (value === "partial") return "partial";
  if (value === "missing") return "missing";
  return "full";
}

function normalizeDemand(cityDemand: CityDemand) {
  if (typeof cityDemand === "number") {
    return clamp(cityDemand > 1 ? cityDemand / 100 : cityDemand, 0, 1);
  }

  const value = cityDemand.toLowerCase();
  if (value === "high") return 1;
  if (value === "medium") return 0.65;
  return 0.3;
}

function validateInput(input: ValueScoreInput) {
  if (input.listedPrice <= 0) throw new Error("listedPrice must be greater than zero.");
  if (input.marketAveragePrice <= 0) throw new Error("marketAveragePrice must be greater than zero.");
  if (input.kilometersDriven < 0) throw new Error("kilometersDriven cannot be negative.");
  if (input.carAgeYears < 0) throw new Error("carAgeYears cannot be negative.");
  if (input.numberOfOwners < 1) throw new Error("numberOfOwners must be at least 1.");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}
