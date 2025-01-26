import { years } from './constants/year.constant';

// If the manufacturer chooses to designate year, it is recommended that the year be indicated by the first character of the VIS. (10th character)
// The recommended code to be used when designating year is indicated in year.constant file.
export const getModelYear = (vin: string): {
  modelYear: string;
  possibleModelYears: number[]
} => {
  vin = vin.toUpperCase();
  const candidateModelYear = vin.substring(9, 10);
  const possibleModelYears = years[candidateModelYear as keyof typeof years];

  const validationCharacter = vin.substring(6, 7);

  // Check if the validationCharacter is a Number
  const modelYear: string = /^\d+$/.test(validationCharacter)
    ? possibleModelYears?.find((year) => year < 2010)?.toString() || '-'
    : possibleModelYears?.find((year) => year >= 2010)?.toString() || '-';

  return { modelYear, possibleModelYears }
};
