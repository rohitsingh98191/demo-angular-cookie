export interface ICookieParams {
  ip_address?: string;
  user_id?: string;
  bigint_visitor_id?: string;
  consent_value: CookieConsent;
  expiry_date?: number | Date;
  deviceid?: string;
  product_name: string ;
  device_id?: string;
}

export type CookieConsent = 'opt_in' | 'opt_out';

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
