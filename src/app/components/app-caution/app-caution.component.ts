import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ModalWindowComponent } from '../modal-window/modal-window.component';

@Component({
  selector: 'app-caution',
  standalone: true,
  imports: [ModalWindowComponent],
  templateUrl: './app-caution.component.html',
  styleUrl: './app-caution.component.css'
})
export class AppCautionComponent implements AfterViewInit {
  static readonly dontShowAgainKey = "appCautionDontShowAgain";

  @ViewChild('CautionModal') cautionModal!: ModalWindowComponent;

  ngAfterViewInit() {
    if (localStorage.getItem(AppCautionComponent.dontShowAgainKey) != null) {
      let dontShowAgain = localStorage.getItem(AppCautionComponent.dontShowAgainKey);
      if (dontShowAgain == true.toString()) {
        console.log("App caution was skipped");
        return;
      }
    }

    this.cautionModal.show();
  }

  closeAndRememberMyChoise() {
    localStorage.setItem(AppCautionComponent.dontShowAgainKey, true.toString());
    this.cautionModal.hide();
  }
}
