import { decodeVIN, splitVIN, validateVIN } from '../src/vin';
import { getManufacturer } from '../src/manufacturer';
import { getCountry, getRegion } from '../src/country-region';
import { getModelYear } from '../src/year';

describe('Universal VIN Decoder', () => {
  describe('#Region', () => {
    test('Region should be Europe', () => {
      expect(getRegion('S1K')).toBe('Europe');
      expect(getRegion('W1K')).toBe('Europe');
    });
    test('Region should be Asia', () => {
      expect(getRegion('KNA')).toBe('Asia');
      expect(getRegion('NMT')).toBe('Asia');
    });
  });
  describe('#Country', () => {
    test('Country should be Germany', () => {
      expect(getCountry('W1K')).toBe('Germany');
    });
    test('Country should be Turkey', () => {
      expect(getCountry('NMT')).toBe('Turkey');
    });
  });

  describe('#Manufacturer', () => {
    test('Manufacturers are loaded correctly.', () => {
      expect(getManufacturer('WDB')).toEqual('Mercedes-Benz & Maybach');
      expect(getManufacturer('VF1')).toBe(
        'Renault & Eagle Medallion made by Renault',
      );
      expect(getManufacturer('KND')).toEqual('Kia SUV/MPV & Hyundai Entourage');

      // Scraped manufacturers
      expect(getManufacturer('516')).toEqual('Autocar truck');
      expect(getManufacturer('7A8')).toEqual('NZ Transport Agency (pre-2009)');
      expect(getManufacturer('97N')).toEqual('Triumph Motorcycles Ltd');
    });
  });

  describe('#Model Year', () => {
    test('Model Year is computed correctly.', () => {
      expect(getModelYear('W1N2476871W240290')).toEqual({
        modelYear: '2001',
        possibleModelYears: [
          2001,
          2031
        ]
      });
    });
    test('Model Year is not defined by the manufacturer.', () => {
      expect(getModelYear('WBA11CM0X08C97826')).toEqual({ modelYear: '-' });
    });
  });

  describe('#Validate VIN', () => {
    test('VIN is validated correctly.', () => {
      expect(validateVIN('W1K3FBCB3PN300965')).toEqual({
        isValid: true,
      });
      expect(validateVIN('W1K3FCB3PN30096545')).toEqual({
        isValid: false,
        error: 'VIN must be 17 characters long',
      });
      expect(validateVIN('W1K3FICB3PN300965')).toEqual({
        isValid: false,
        error: 'VIN contain only letters & numbers except from I, O and Q',
      });
    });
    //@ts-expect-error VIN must be a string
    expect(validateVIN(['W1K3FBCB3PN300965'])).toEqual({
      isValid: false,
      error: 'VIN must be a string',
    });
  });

  describe('#Split VIN', () => {
    test('VIN is splitted correctly to ISO format.', () => {
      expect(splitVIN('W1k3fbcb3pn300965')).toEqual({
        wmi: 'W1K',
        vds: '3FBCB3',
        vis: 'PN300965',
        modelYear: 'P',
      });
      expect(splitVIN('NMTK33BXX0R132738')).toEqual({
        wmi: 'NMT',
        vds: 'K33BXX',
        vis: '0R132738',
        modelYear: '0',
      });
    });
  });

  describe('#Decode VIN', () => {
    test('Mercedes VINs are decoded correctly', () => {
      expect(decodeVIN('W1k3fbcb3pn300965')).toEqual({
        vin: 'W1K3FBCB3PN300965',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'Germany',
          modelYear: '2023',
          manufacturer: 'Mercedes-Benz car',
          possibleModelYears: [
            1993,
            2023
          ],
        },
      });
      expect(decodeVIN('W1N2476871W240290')).toEqual({
        vin: 'W1N2476871W240290',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'Germany',
          modelYear: '2001',
          manufacturer: 'Mercedes-Benz SUV',
          possibleModelYears: [
            2001,
            2031
          ],
        },
      });
      expect(decodeVIN('W1K3F8CB3PN299204')).toEqual({
        vin: 'W1K3F8CB3PN299204',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'Germany',
          modelYear: '2023',
          manufacturer: 'Mercedes-Benz car',
          possibleModelYears: [
            1993,
            2023
          ],
        },
      });
    });
    test('BMW VINs are decoded correctly', () => {
      expect(decodeVIN('WBA11CM0X08C97826')).toEqual({
        vin: 'WBA11CM0X08C97826',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'Germany',
          modelYear: '-',
          manufacturer: 'BMW car',
        },
      });
      // At 10th digit 0, which is invalid
      expect(decodeVIN('WBAYN910405V54715')).toEqual({
        vin: 'WBAYN910405V54715',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'Germany',
          modelYear: '-',
          manufacturer: 'BMW car',
        },
      });
      expect(decodeVIN('WBAYH110105V51473')).toEqual({
        vin: 'WBAYH110105V51473',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'Germany',
          modelYear: '-',
          manufacturer: 'BMW car',
        },
      });
    });
    test('Toyota VINs are decoded correctly', () => {
      expect(decodeVIN('SB1K93BE20E317259')).toEqual({
        vin: 'SB1K93BE20E317259',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'United Kingdom',
          modelYear: '-',
          manufacturer: 'Toyota Manufacturing UK',
        },
      });
      expect(decodeVIN('NMTK33BXX0R132738')).toEqual({
        vin: 'NMTK33BXX0R132738',
        isValid: true,
        info: {
          region: 'Asia',
          country: 'Turkey',
          modelYear: '-',
          manufacturer: 'Toyota Motor Manufacturing Turkey',
        },
      });
      expect(decodeVIN('YARKBAC3200025492')).toEqual({
        vin: 'YARKBAC3200025492',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'Belgium',
          modelYear: '-',
          manufacturer:
            'Toyota Motor Europe (based in Belgium) used for Toyota ProAce & Toyota ProAce City',
        },
      });
    });
    test('Renault VINs are decoded correctly', () => {
      expect(decodeVIN('VF1RJK00170468036')).toEqual({
        vin: 'VF1RJK00170468036',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'France',
          modelYear: '2007',
          manufacturer: 'Renault & Eagle Medallion made by Renault',
          possibleModelYears: [
            2007,
            2037
          ],
        },
      });
      expect(decodeVIN('VF1RJK00870326167')).toEqual({
        vin: 'VF1RJK00870326167',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'France',
          modelYear: '2007',
          manufacturer: 'Renault & Eagle Medallion made by Renault',
          possibleModelYears: [
            2007,
            2037
          ],
        },
      });
      expect(decodeVIN('VF1RJK00870326167')).toEqual({
        vin: 'VF1RJK00870326167',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'France',
          modelYear: '2007',
          manufacturer: 'Renault & Eagle Medallion made by Renault',
          possibleModelYears: [
            2007,
            2037
          ],
        },
      });
    });
    test('Citroen VINs are decoded correctly', () => {
      expect(decodeVIN('VR7EFYHYCMN520985')).toEqual({
        vin: 'VR7EFYHYCMN520985',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'France',
          modelYear: '2021',
          manufacturer: 'Citroën',
          possibleModelYears: [
            1991,
            2021,
          ],
        },
      });
      expect(decodeVIN('VR7EFYHT2PN547380')).toEqual({
        vin: 'VR7EFYHT2PN547380',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'France',
          modelYear: '2023',
          manufacturer: 'Citroën',
          possibleModelYears: [
            1993,
            2023,
          ],
        },
      });
      expect(decodeVIN('VR7EFYHT2PJ708414')).toEqual({
        vin: 'VR7EFYHT2PJ708414',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'France',
          modelYear: '2023',
          manufacturer: 'Citroën',
          possibleModelYears: [
            1993,
            2023,
          ],
        },
      });
    });
    test('KIA VINs are decoded correctly', () => {
      expect(decodeVIN('KNADA818AP6839219')).toEqual({
        vin: 'KNADA818AP6839219',
        isValid: true,
        info: {
          region: 'Asia',
          country: 'South Korea',
          modelYear: '1993',
          manufacturer: 'Kia car',
          possibleModelYears: [
            1993,
            2023,
          ],
        },
      });
      expect(decodeVIN('KNADA818AP6838826')).toEqual({
        vin: 'KNADA818AP6838826',
        isValid: true,
        info: {
          region: 'Asia',
          country: 'South Korea',
          modelYear: '1993',
          manufacturer: 'Kia car',
          possibleModelYears: [
            1993,
            2023,
          ],
        },
      });
      expect(decodeVIN('KNADA818ART907403')).toEqual({
        vin: 'KNADA818ART907403',
        isValid: true,
        info: {
          region: 'Asia',
          country: 'South Korea',
          modelYear: '1994',
          manufacturer: 'Kia car',
          possibleModelYears: [
            1994,
            2024,
          ],
        },
      });
    });
    test('Honda VUNs are decoded correctly', () => {
      expect(decodeVIN('JHMGK3770HX000000')).toEqual({
        info: {
          country: "Japan",
          manufacturer: "Honda car",
          modelYear: "1987",
          possibleModelYears: [
           1987,
           2017,
         ],
         region: "Asia",
        },
        isValid: true,
        vin: "JHMGK3770HX000000",
      });
    })
  });
});
