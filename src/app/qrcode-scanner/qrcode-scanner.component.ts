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
  camHasCamera: HTMLElement;
  camList: HTMLSelectElement;
  camHasFlash: HTMLElement;
  flashToggle: HTMLElement;
  flashState: HTMLElement;
  camQrResult: HTMLElement;
  camQrResultTimestamp: HTMLElement;
  fileSelector: HTMLInputElement;
  fileQrResult: HTMLElement;

  constructor() {}

  ngOnInit(): void {
    this.video = document.getElementById('qr-video') as HTMLVideoElement;
    this.videoContainer = document.getElementById('video-container')!;
    this.camHasCamera = document.getElementById('cam-has-camera')!;
    this.camList = document.getElementById('cam-list') as HTMLSelectElement;
    this.camHasFlash = document.getElementById('cam-has-flash')!;
    this.flashToggle = document.getElementById('flash-toggle')!;
    this.flashState = document.getElementById('flash-state')!;
    this.camQrResult = document.getElementById('cam-qr-result')!;
    this.camQrResultTimestamp = document.getElementById(
      'cam-qr-result-timestamp'
    )!;
    this.fileSelector = document.getElementById(
      'file-selector'
    ) as HTMLInputElement;
    this.fileQrResult = document.getElementById('file-qr-result')!;

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

    const updateFlashAvailability = () => {
      this.scanner.hasFlash().then((hasFlash: boolean) => {
        this.camHasFlash.textContent = hasFlash.toString();
        this.flashToggle.style.display = hasFlash ? 'inline-block' : 'none';
      });
    };

    // Inside the ngOnInit() method
    const highlightStyleSelect = document.getElementById(
      'scan-region-highlight-style-select'
    ) as HTMLSelectElement;
    highlightStyleSelect.addEventListener('change', () => {
      const selectedStyle = highlightStyleSelect.value;
      this.updateHighlightStyle(selectedStyle);
    });

    this.scanner.start().then(() => {
      updateFlashAvailability();
      QrScanner.listCameras(true).then((cameras: any[]) =>
        cameras.forEach((camera: any) => {
          const option = document.createElement('option');
          option.value = camera.id;
          option.text = camera.label;
          this.camList.add(option);
        })
      );
    });

    QrScanner.hasCamera().then((hasCamera: boolean) => {
      this.camHasCamera.textContent = hasCamera.toString();
    });
  }
  updateHighlightStyle(style: string) {
    // Remove any existing highlight styles
    this.videoContainer.classList.remove('example-style-1', 'example-style-2');

    // Add the selected highlight style
    if (style === 'example-style-1') {
      this.videoContainer.classList.add('example-style-1');
    } else if (style === 'example-style-2') {
      this.videoContainer.classList.add('example-style-2');
    }
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
