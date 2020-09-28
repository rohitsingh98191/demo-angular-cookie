import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { GdprComplianceService } from './gdpr-compliance.service';

@NgModule({
  imports: [
    HttpClientModule, HttpClientJsonpModule
  ],
  providers: [GdprComplianceService]
})
export class GdprComplianceModule {
 }
