import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoCookieComponent } from './demo-cookie.component';

describe('DemoCookieComponent', () => {
  let component: DemoCookieComponent;
  let fixture: ComponentFixture<DemoCookieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoCookieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoCookieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
