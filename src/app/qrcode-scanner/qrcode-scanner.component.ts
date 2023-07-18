import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import QrScanner from 'qr-scanner';

@Component({
  selector: 'app-qrcode-scanner',
  templateUrl: './qrcode-scanner.component.html',
  styleUrls: ['./qrcode-scanner.component.css'],
})
export class QrCodeScannerComponent implements OnInit {
  private scanner: QrScanner;
  @ViewChild('qrVideo', { static: true }) qrVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('videoContainer', { static: true })
  videoContainer: ElementRef<HTMLElement>;
  @ViewChild('camQrResult', { static: true })
  camQrResult: ElementRef<HTMLElement & { highlightTimeout: NodeJS.Timeout }>;
  @ViewChild('camQrResultTimestamp', { static: true })
  camQrResultTimestamp: ElementRef<
    HTMLElement & { highlightTimeout: NodeJS.Timeout }
  >;

  constructor() {}

  ngOnInit(): void {
    console.log(QrScanner);

    const scannerOptions = {
      onDecodeError: (error: string) => {
        this.camQrResult.nativeElement.textContent = error;
        this.camQrResult.nativeElement.style.color = 'inherit';
      },
      highlightScanRegion: true,
      highlightCodeOutline: true,
    };

    // Calculate the modified scan region
    const scanRegion = () => {
      const videoWidth = this.qrVideo.nativeElement.videoWidth;
      const videoHeight = this.qrVideo.nativeElement.videoHeight;
      const minDimension = Math.min(videoWidth, videoHeight);
      const reduction = 0.35;
      const scanRegionSize = minDimension * (1 - 2 * reduction);
      const x = (videoWidth - scanRegionSize) / 2;
      const y = (videoHeight - scanRegionSize) / 2;
      const width = scanRegionSize;
      const height = scanRegionSize;
      return { x, y, width, height };
    };
    this.scanner = new QrScanner(
      this.qrVideo.nativeElement,
      (result: any) => this.setResult(this.camQrResult.nativeElement, result),
      {
        ...scannerOptions,
        calculateScanRegion: scanRegion,
      } as any
    );

    this.scanner.start().then(() => {
      QrScanner.listCameras().then((cameras: any[]) =>
        cameras.forEach((camera: any) => {
          const option = document.createElement('option');
          option.value = camera.id;
          option.text = camera.label;
        })
      );
    });
  }

  setResult(
    label: HTMLElement & { highlightTimeout: NodeJS.Timeout },
    result: { data: string }
  ) {
    console.log(result.data);
    label.textContent = result.data;
    this.camQrResultTimestamp.nativeElement.textContent = new Date().toString();
    label.style.color = 'green';
    clearTimeout(label.highlightTimeout);
    label.highlightTimeout = setTimeout(
      () => (label.style.color = 'inherit'),
      100
    ) as NodeJS.Timeout;
  }
}
