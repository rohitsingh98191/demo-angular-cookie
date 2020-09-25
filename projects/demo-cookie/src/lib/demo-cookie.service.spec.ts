import { DOCUMENT } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DemoCookieService } from './demo-cookie.service';
import Spy = jasmine.Spy;

describe('DemoCookieService', () => {
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
  })}
    );
  afterEach(() => {
      documentCookieGetterSpy.calls.reset();
      documentCookieSetterSpy.calls.reset();
    });
  it('should be created', () => {
    const service: DemoCookieService = TestBed.get(DemoCookieService);
    expect(service).toBeTruthy();
  });

  it('should get all initialized value false', () => {
      const service: DemoCookieService = TestBed.get(DemoCookieService);
      expect(service.isCookieLibIntilized).toBeFalsy();
      expect(service.isEuCountries).toEqual(false);
  } );

  it('should initialized a library', () => {
    const service: DemoCookieService = TestBed.get(DemoCookieService);
    service.initAnalytics();
    expect(service.isCookieLibIntilized).toEqual(true);
  });

  it('should check user is europen country', () => {
    const service: DemoCookieService = TestBed.get(DemoCookieService);
    service.initAnalytics();
    expect(service.isCookieLibIntilized).toEqual(true);
    expect(service.isEuCountries).toEqual(false);
  });
  it('should check is vistior value their in cookie', () => {
    documentMock.cookie = '__ivc=24dc54f7-a839-46c7-8201-313be6a9dae5';
    const service: DemoCookieService = TestBed.get(DemoCookieService);
    expect( service.isCookieSet).toEqual(false);
    expect(service.getCookieValue('__ivc')).toEqual('24dc54f7-a839-46c7-8201-313be6a9dae5');
    expect(service.isCookieByNameExist('__ivc')).toEqual(true);
  });

  it('should check is set cookie work', () => {
    const service: DemoCookieService = TestBed.get(DemoCookieService);
    expect(service.isCookieExist.value).toEqual(false);
    expect( service.isCookieSet).toEqual(false);
    jasmine.clock().uninstall();
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('Sun, 15 Mar 2020 10:00:00 GMT'));
    // tslint:disable-next-line: max-line-length
    expect(service.setCookiesPolicy(service.createParams({cookie_consent: 'cookie_opt', userid: '1', productName: 'demo', expiry_date: 2})));
    expect(documentCookieSetterSpy).toHaveBeenCalledWith(
      // tslint:disable-next-line: max-line-length
      'privacy_policy_cookie=true;expires=Tue, 17 Mar 2020 10:00:00 GMT;path=/;domain=.researcher.life;secure;sameSite=LAX;');
    expect(service.isCookieExist.value).toEqual(true);
    jasmine.clock().uninstall();
  });
});

