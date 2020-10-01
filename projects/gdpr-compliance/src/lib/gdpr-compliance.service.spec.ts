import { DOCUMENT } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GdprComplianceService } from './gdpr-compliance.service';
import Spy = jasmine.Spy;

describe('GdprComplianceService', () => {
  const documentMock: Document = document;
  let documentCookieGetterSpy: Spy;
  let documentCookieSetterSpy: Spy;
  beforeEach(() => {
    documentCookieGetterSpy = spyOnProperty(documentMock, 'cookie', 'get').and.callThrough();
    documentCookieSetterSpy = spyOnProperty(documentMock, 'cookie', 'set').and.callThrough();
    TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      { provide: DOCUMENT, useFactory: () => documentMock }
    ]
  }); }
    );
  afterEach(() => {
      documentCookieGetterSpy.calls.reset();
      documentCookieSetterSpy.calls.reset();
    });
  it('should be created', () => {
    const service: GdprComplianceService = TestBed.get(GdprComplianceService);
    expect(service).toBeTruthy();
  });

  it('should check user is europen country', () => {
    const service: GdprComplianceService = TestBed.get(GdprComplianceService);
    expect(service.checkwhetherEuCountries('IN')).toEqual(true);
  });
  it('should check is vistior value their in cookie', () => {
    documentMock.cookie = '__ivc=24dc54f7-a839-46c7-8201-313be6a9dae5';
    const service: GdprComplianceService = TestBed.get(GdprComplianceService);
    expect( service.isCookieSet).toEqual(false);
    expect(service.getCookieValue('__ivc')).toEqual('24dc54f7-a839-46c7-8201-313be6a9dae5');
    expect(service.isCookieByNameExist('__ivc')).toEqual(true);
  });

  it('should check is set cookie work', () => {
    const service: GdprComplianceService = TestBed.get(GdprComplianceService);
    expect(service.isCookieExist.value).toEqual(false);
    expect( service.isCookieSet).toEqual(false);
    jasmine.clock().uninstall();
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('Sun, 15 Mar 2020 10:00:00 GMT'));
    // tslint:disable-next-line: max-line-length
    expect(service.setCookiesPolicy(service.createParams({cookie_consent: 'opt_in', userid: '1', productName: 'demo', expiry_date: 2})));
    expect(documentCookieSetterSpy).toHaveBeenCalledWith(
      // tslint:disable-next-line: max-line-length
      'privacy_policy_cookie=true;expires=Tue, 17 Mar 2020 10:00:00 GMT;path=/;domain=.researcher.life;secure;sameSite=LAX;');
    expect(service.isCookieExist.value).toEqual(true);
    jasmine.clock().uninstall();
  });
});

