import { Component, OnInit } from '@angular/core';
import QrScanner from 'qr-scanner';

@Component({
  selector: 'app-qrcode-scanner',
  templateUrl: './qrcode-scanner.component.html',
  styleUrls: ['./qrcode-scanner.component.css'],
})
export class QrCodeScannerComponent implements OnInit {
  private scanner: QrScanner;
  video: HTMLVideoElement;
  videoContainer: HTMLElement;
  camQrResult: HTMLElement;
  camQrResultTimestamp: HTMLElement;

  constructor() {}

  ngOnInit(): void {
    this.video = document.getElementById('qr-video') as HTMLVideoElement;
    this.videoContainer = document.getElementById('video-container')!;
    this.camQrResult = document.getElementById('cam-qr-result')!;
    this.camQrResultTimestamp = document.getElementById(
      'cam-qr-result-timestamp'
    )!;

    const scannerOptions = {
      onDecodeError: (error: string) => {
        (this.camQrResult as any).textContent = error;
        this.camQrResult.style.color = 'inherit';
      },
      highlightScanRegion: true,
      highlightCodeOutline: true,
      scanRegionHighlightStyle: 'example-style-2', // Add this line
    };

    // Calculate the modified scan region
    const scanRegion = () => {
      const videoWidth = this.video.videoWidth;
      const videoHeight = this.video.videoHeight;
      const minDimension = Math.min(videoWidth, videoHeight);
      const reduction = 0.3;
      const scanRegionSize = minDimension * (1 - 2 * reduction);
      const x = (videoWidth - scanRegionSize) / 2;
      const y = (videoHeight - scanRegionSize) / 2;
      const width = scanRegionSize;
      const height = scanRegionSize;
      return { x, y, width, height };
    };
    this.scanner = new QrScanner(
      this.video,
      (result: any) => this.setResult(this.camQrResult, result),
      {
        ...scannerOptions,
        calculateScanRegion: scanRegion,
      } as any
    );

    this.scanner.start().then(() => {
      QrScanner.listCameras(true).then((cameras: any[]) =>
        cameras.forEach((camera: any) => {
          const option = document.createElement('option');
          option.value = camera.id;
          option.text = camera.label;
        })
      );
    });
  }

  setResult(label: HTMLElement, result: { data: string }) {
    console.log(result.data);
    label.textContent = result.data;
    this.camQrResultTimestamp.textContent = new Date().toString();
    label.style.color = 'green';
    clearTimeout((label as any).highlightTimeout);
    (label as any).highlightTimeout = setTimeout(
      () => ((label as any).style.color = 'inherit'),
      100
    );
  }
}
