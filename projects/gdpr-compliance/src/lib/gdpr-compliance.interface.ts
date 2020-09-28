export interface ICookieParams {
  ip_address?: string;
  userid: string;
  visitorid?: string;
  cookie_consent: CookieConsent;
  expiry_date?: number | Date;
  deviceid?: string;
  productName: string ;
}

export type CookieConsent = 'cookie_opt' | 'cookie_out';

export interface IGeoIpParams {
  city: string;
  country_code: string;
  country_name: string;
  ip: string;
  latitude: number;
  longitude: number;
  metro_code: number;
  region_code: string;
  region_name: string;
  time_zone: string;
  zip_code: string;
}
