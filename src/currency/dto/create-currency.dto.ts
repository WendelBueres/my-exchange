import { IsEnum, IsString } from 'class-validator';

enum EnumCurrency {
  'EUR' = 'EUR',
  'USD' = 'USD',
  'JPY' = 'JPY',
  'BGN' = 'BGN',
  'CZK' = 'CZK',
  'DKK' = 'DKK',
  'GBP' = 'GBP',
  'HUF' = 'HUF',
  'PLN' = 'PLN',
  'RON' = 'RON',
  'SEK' = 'SEK',
  'CHF' = 'CHF',
  'ISK' = 'ISK',
  'NOK' = 'NOK',
  'HRK' = 'HRK',
  'RUB' = 'RUB',
  'TRY' = 'TRY',
  'AUD' = 'AUD',
  'CAD' = 'CAD',
  'CNY' = 'CNY',
  'HKD' = 'HKD',
  'IDR' = 'IDR',
  'ILS' = 'ILS',
  'INR' = 'INR',
  'KRW' = 'KRW',
  'MXN' = 'MXN',
  'MYR' = 'MYR',
  'NZD' = 'NZD',
  'PHP' = 'PHP',
  'SGD' = 'SGD',
  'THB' = 'THB',
  'ZAR' = 'ZAR',
}
export class CreateCurrencyDto {
  @IsString()
  name: string;

  @IsEnum(EnumCurrency)
  iso4217: string;
}
