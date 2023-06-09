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
        (this.camQrResult as any).textContent = error; // Cast to 'any'
        this.camQrResult.style.color = 'inherit';
      },
      highlightScanRegion: true,
      highlightCodeOutline: true,
    };

    this.scanner = new QrScanner(
      this.video,
      (result: any) => this.setResult(this.camQrResult, result),
      scannerOptions as any
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
    label.style.color = 'teal';
    clearTimeout((label as any).highlightTimeout);
    (label as any).highlightTimeout = setTimeout(
      () => ((label as any).style.color = 'inherit'),
      100
    );
  }

  // Add event listeners and other methods here based on the remaining code
}
