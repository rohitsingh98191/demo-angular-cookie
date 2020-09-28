import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { ICookieParams, IGeoIpParams } from './gdpr-compliance.interface';

/** @dynamic */
@Injectable({
  providedIn: 'root'
})
export class GdprComplianceService {
  private euCountries = [
    'AT',
    'BE',
    'BG',
    'CY',
    'CZ',
    'DK',
    'EE',
    'FI',
    'FR',
    'DE',
    'GR',
    'HU',
    'IE',
    'IT',
    'LV',
    'LT',
    'LU',
    'MT',
    'NL',
    'PL',
    'PT',
    'RO',
    'SK',
    'SI',
    'ES',
    'SE',
    'GB',
    'KR',
    'IN'
  ];

  public readonly isEuCountry =  new BehaviorSubject<boolean>(false);
  private readonly isInitializedLib = new BehaviorSubject<boolean>(false);
  public readonly isCookieExist = new BehaviorSubject<boolean>(false);
  public geoResponse =  new BehaviorSubject<IGeoIpParams | undefined>(undefined) ;

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document
    ) { }

  public getCurrentCountries(): Observable<IGeoIpParams> {
    return this.http.jsonp<IGeoIpParams>('https://geoip.cactusglobal.io/json/', 'callback');
  }

 private checkwhetherEuCountries(location) {
    if (this.euCountries.indexOf(location.country_code) > -1) {
     return this.isEuCountry.next(true);
    } else {
      return this.isEuCountry.next(false);
     }
  }

 public initAnalytics() {
  while (!this.isInitializedLib.value) {
    this.isInitializedLib.next(true);
    this.getCurrentCountries().toPromise().then((geolocation: IGeoIpParams) => {
        this.geoResponse.next(geolocation);
        this.checkwhetherEuCountries(geolocation as IGeoIpParams);
    }).catch(error => {
      return new Error(error);
    });
  }
  }

  public acceptcookiesPolicy(value: ICookieParams) {
      try {
        return new Promise((resolve , reject) => {
          if (!this.isCookieSet) {
            this.http.post(`account/api` , this.createParams(value)).toPromise().then(result => {
              resolve(result);
              this.setCookiesPolicy(this.createParams(value));
            }).catch(err => reject(err));
          }
        });
      } catch (err) {
     return  new Error(err);
      }
  }

  public setCookiesPolicy(value): void {
    this.document.cookie  = this.cookieFormat('privacy_policy_cookie', value);
    this.isCookieExist.next(true);
  }

  get isEuCountries(): boolean {
    return this.isEuCountry.value;
  }

  get isCookieLibIntilized(): boolean {
    return this.isInitializedLib.value;
  }

  get isCookieSet(): boolean {
    const data = this.isCookieByNameExist('privacy_policy_cookie');
    this.isCookieExist.next(data);
    return data;
  }

  public isCookieByNameExist(name: string): boolean {
    const cookieArr = this.document.cookie.split(';') ;
    for ( const i of cookieArr) {
      const cookiePair = i.split('=');
      if (name === cookiePair[0].trim()) {
          return !this.isNil(cookiePair[1]);
      }
  }
    return false;
  }

  public getCookieValue(name: string): string {
    const cookieArr = this.document.cookie.split(';') ;
    for ( const i of cookieArr) {
      const cookiePair = i.split('=');
      if (name === cookiePair[0].trim()) {
        return  this.safeDecodeURIComponent(cookiePair[1]);
      }
  }
    return '';
  }

 private isNil(obj: any): boolean {
    return obj === undefined || obj === null;
  }

  public createParams(value: ICookieParams): ICookieParams {
    return {
      ip_address : value.ip_address ? value.ip_address : this.getIpAddress(),
      cookie_consent: value.cookie_consent,
      productName : value.productName,
      userid: value.userid,
      expiry_date: value.expiry_date ? value.expiry_date : 365,
      visitorid: value.visitorid ? value.visitorid : this.getVisitorId()
    };
  }

  private getIpAddress(): string|null {
    return this.geoResponse.value ? this.geoResponse.value.ip : null;
  }

  private cookieFormat(name: string, value: ICookieParams): string {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(true)};`;
    if (value.expiry_date) {
      if (typeof value.expiry_date === 'number') {
        const dateExpires: Date = new Date(new Date().getTime() + value.expiry_date * 1000 * 60 * 60 * 24);
        cookieString += `expires=${dateExpires.toUTCString()};`;
      } else {
        cookieString += `expires=${value.expiry_date.toUTCString()};`;
      }
    }
    cookieString += `path=/;`;
    cookieString += 'domain=.researcher.life;';
    cookieString += 'secure;';
    cookieString += 'sameSite=' + 'LAX' + ';';
    return cookieString;
  }

  private getVisitorId() {
    return this.getCookieValue(`__ivc`);
  }

   private safeDecodeURIComponent(encodedURIComponent: string): string {
    try {
      return decodeURIComponent(encodedURIComponent);
    } catch {
      return encodedURIComponent;
    }
  }
}

