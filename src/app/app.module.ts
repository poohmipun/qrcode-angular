import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { QrCodeScannerComponent } from './qrcode-scanner/qrcode-scanner.component';

@NgModule({
  declarations: [AppComponent, QrCodeScannerComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
