import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeScannerComponent } from './qrcode-scanner.component';

describe('QrcodeScannerComponent', () => {
  let component: QrcodeScannerComponent;
  let fixture: ComponentFixture<QrcodeScannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QrcodeScannerComponent]
    });
    fixture = TestBed.createComponent(QrcodeScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
