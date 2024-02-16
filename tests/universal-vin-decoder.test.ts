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
      expect(getManufacturer('WDB')).toEqual('Mercedes-Benz');
      expect(getManufacturer('VF1')).toBe('Renault');
      expect(getManufacturer('KND')).toEqual('Kia SUV');
    });
  });

  describe('#Model Year', () => {
    test('Model Year is computed correctly.', () => {
      expect(getModelYear('W1N2476871W240290')).toEqual('2001');
    });
    test('Model Year is not defined by the manufacturer.', () => {
      expect(getModelYear('WBA11CM0X08C97826')).toEqual('-');
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
    //@ts-ignore
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
          manufacturer: 'BMW',
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
          manufacturer: 'BMW',
        },
      });
      expect(decodeVIN('WBAYH110105V51473')).toEqual({
        vin: 'WBAYH110105V51473',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'Germany',
          modelYear: '-',
          manufacturer: 'BMW',
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
          manufacturer: 'Toyota UK',
        },
      });
      expect(decodeVIN('NMTK33BXX0R132738')).toEqual({
        vin: 'NMTK33BXX0R132738',
        isValid: true,
        info: {
          region: 'Asia',
          country: 'Turkey',
          modelYear: '-',
          manufacturer: 'Toyota Türkiye',
        },
      });
      expect(decodeVIN('YARKBAC3200025492')).toEqual({
        vin: 'YARKBAC3200025492',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'Belgium',
          modelYear: '-',
          manufacturer: 'Toyota Belgium',
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
          manufacturer: 'Renault',
        },
      });
      expect(decodeVIN('VF1RJK00870326167')).toEqual({
        vin: 'VF1RJK00870326167',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'France',
          modelYear: '2007',
          manufacturer: 'Renault',
        },
      });
      expect(decodeVIN('VF1RJK00870326167')).toEqual({
        vin: 'VF1RJK00870326167',
        isValid: true,
        info: {
          region: 'Europe',
          country: 'France',
          modelYear: '2007',
          manufacturer: 'Renault',
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
          manufacturer: 'Kia',
        },
      });
      expect(decodeVIN('KNADA818AP6838826')).toEqual({
        vin: 'KNADA818AP6838826',
        isValid: true,
        info: {
          region: 'Asia',
          country: 'South Korea',
          modelYear: '1993',
          manufacturer: 'Kia',
        },
      });
      expect(decodeVIN('KNADA818ART907403')).toEqual({
        vin: 'KNADA818ART907403',
        isValid: true,
        info: {
          region: 'Asia',
          country: 'South Korea',
          modelYear: '1994',
          manufacturer: 'Kia',
        },
      });
    });
  });
});