import { NgIf } from '@angular/common';
import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { RequestService } from '../../services/request.service';

type UploadState = 'waiting' | 'uploading' | 'failed' | 'succeded';

@Component({
  selector: 'picture-upload',
  standalone: true,
  imports: [
    NgIf,
  ],
  templateUrl: './picture-upload.component.html',
})
export class PictureUpload {
  private _requestService = inject(RequestService);
  private _isActive = false;
  protected uploadState: UploadState = 'waiting';
  protected canTakePicture = false;
  protected hasPicture = false;

  @ViewChild("player")
  private player: ElementRef<HTMLVideoElement> | undefined = undefined;

  @ViewChild("canvas")
  private canvas: ElementRef<HTMLCanvasElement> | undefined = undefined;

  @Input()
  set isActive(state: boolean) {
    this._isActive = state;
    if (state) this._startCamera()
    else if (this.player)
      this.player.nativeElement.srcObject = null
  }

  private async _startCamera() {
    if (this._isActive) {
      this.hasPicture = false;
      const videoStream = await navigator
        ?.mediaDevices
        ?.getUserMedia({
          video: true, audio: false
        })
        ?? null;

      if (videoStream && this.player) {
        this.player.nativeElement.srcObject = videoStream;
        this.player.nativeElement.addEventListener("canplay", () => this.enableTakingPicture(), { once: true });
        this.player.nativeElement.play();
      }
    }
  };

  private enableTakingPicture() {
    this.canTakePicture = true;
  }

  protected takePicture(_: Event) {
    this.hasPicture = true;
    this.canTakePicture = false;
    window.requestAnimationFrame(() => {
      if (this.canvas && this.player) {
        this.canvas.nativeElement.width = this.player.nativeElement.videoWidth
        this.canvas.nativeElement.height = this.player.nativeElement.videoHeight
        this.canvas.nativeElement
          .getContext("2d")
          ?.drawImage(
            this.player.nativeElement,
            0, 0,
            this.canvas.nativeElement.offsetWidth,
            this.canvas.nativeElement.offsetHeight
          );
      }
    })
  }

  protected async handleFileInput(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.item(0);
    if (file) {
      this.uploadState = 'uploading';
      try {
        // await this._requestService.uploadPicture(file);
        this.uploadState = 'succeded';
      } catch (err) {
        console.log(err);
        this.uploadState = 'failed';
      }
    }
  }
}
