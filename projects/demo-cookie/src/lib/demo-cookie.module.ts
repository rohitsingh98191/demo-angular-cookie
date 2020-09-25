import { NgModule } from '@angular/core';
import { DemoCookieComponent } from './demo-cookie.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { DemoCookieService } from './demo-cookie.service';

@NgModule({
  declarations: [DemoCookieComponent],
  imports: [
    HttpClientModule, HttpClientJsonpModule
  ],
  exports: [DemoCookieComponent],
  providers: [DemoCookieService]
})
export class DemoCookieModule {
 }
