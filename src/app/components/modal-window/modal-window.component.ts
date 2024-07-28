import { Component, ElementRef, ViewChild } from '@angular/core';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'modal-window',
  standalone: true,
  imports: [],
  templateUrl: './modal-window.component.html',
  styleUrl: './modal-window.component.css'
})
export class ModalWindowComponent {
  @ViewChild('modalActivationButton') private activationButton!: ElementRef;
  @ViewChild('modalCloseButton') private closeButton!: ElementRef;

  modalId: string = uuid().replaceAll('-', '');

  public show() {
    // Workaround to trigger bootstrap modal plugin's logic without using JS
    this.activationButton.nativeElement.click();
  }

  public hide() {
    // Workaround to trigger bootstrap modal plugin's logic without using JS
    this.closeButton.nativeElement.click();
  }
}
