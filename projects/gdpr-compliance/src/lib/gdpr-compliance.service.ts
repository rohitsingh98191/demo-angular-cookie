import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { ICookieParams } from './gdpr-compliance.interface';
import { environment } from './environment';

/** @dynamic */
@Injectable({
  providedIn: 'root',
})
export class GdprComplianceService {
  private euCountries = environment.euCountryList;
  public readonly isCookieExist = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {}

  public checkwhetherEuCountries(countryCode: string): boolean {
    if (this.euCountries.indexOf(countryCode.toUpperCase()) > -1) {
      return true;
    } else {
      return false;
    }
  }

  public acceptcookiesPolicy(value: ICookieParams) {
    try {
      return new Promise((resolve, reject) => {
        if (!this.isCookieSet) {
          this.http
            .post(environment.cookieUrl, this.createParams(value))
            .toPromise()
            .then((result) => {
              resolve(result);
              this.setCookiesPolicy(this.createParams(value));
            })
            .catch((err) => reject(err));
        }
      });
    } catch (err) {
      return new Error(err);
    }
  }

  public setCookiesPolicy(value): void {
    this.document.cookie = this.cookieFormat(environment.policy_name, value);
    this.isCookieExist.next(true);
  }

  get isCookieSet(): boolean {
    const data = this.isCookieByNameExist(environment.policy_name);
    this.isCookieExist.next(data);
    return data;
  }

  public isCookieByNameExist(name: string): boolean {
    const cookieArr = this.document.cookie.split(';');
    for (const i of cookieArr) {
      const cookiePair = i.split('=');
      if (name === cookiePair[0].trim()) {
        return !this.isNil(cookiePair[1]);
      }
    }
    return false;
  }

  public getCookieValue(name: string): string {
    const cookieArr = this.document.cookie.split(';');
    for (const i of cookieArr) {
      const cookiePair = i.split('=');
      if (name === cookiePair[0].trim()) {
        return this.safeDecodeURIComponent(cookiePair[1]);
      }
    }
    return ``;
  }

  private isNil(obj: any): boolean {
    return obj === undefined || obj === null;
  }

  public createParams(value: ICookieParams): ICookieParams {
    return {
      ip_address: value.ip_address ? value.ip_address : null,
      cookie_consent: value.cookie_consent,
      productName: value.productName,
      userid: value.userid ? value.userid : null,
      expiry_date: value.expiry_date ? value.expiry_date : 365,
      visitorid: value.visitorid ? value.visitorid : this.getVisitorId,
    };
  }

  private cookieFormat(name: string, value: ICookieParams): string {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      true
    )};`;
    if (value.expiry_date) {
      if (typeof value.expiry_date === 'number') {
        const dateExpires: Date = new Date(
          new Date().getTime() + value.expiry_date * 1000 * 60 * 60 * 24
        );
        cookieString += `expires=${dateExpires.toUTCString()};`;
      } else {
        cookieString += `expires=${value.expiry_date.toUTCString()};`;
      }
    }
    cookieString += `path=/;`;
    cookieString += `domain=${environment.domain};`;
    cookieString += `secure;`;
    cookieString += `sameSite=LAX;`;
    return cookieString;
  }

  private get getVisitorId(): string {
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
