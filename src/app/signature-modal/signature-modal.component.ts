import { Component, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-signature-modal',
  standalone: true, // Mark as standalone
  templateUrl: './signature-modal.component.html',
  styleUrls: ['./signature-modal.component.scss'],
  imports: [CommonModule, IonicModule] // Import necessary modules
})
export class SignatureModalComponent {
  @ViewChild('canvas', { static: true }) signaturePadElement: any;
  signaturePad!: SignaturePad;
  signatureData: string = '';

  constructor(
    private modalController: ModalController
  ) {}

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
  }

  clearSignature() {
    this.signaturePad.clear();
  }

  saveSignature() {
    this.signatureData = this.signaturePad.toDataURL();
    console.log('Signature Data URL:', this.signatureData);
  }

  dismiss() {
    this.modalController.dismiss();
  }
}