import { NgbActiveModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';

import { Component, Output, EventEmitter } from '@angular/core';
import { FALSE } from 'src/common/constant';

@Component({
  selector: 'app-popup-component',
  templateUrl: './popup-component.component.html',
  styleUrls: ['./popup-component.component.scss']
})
export class PopupComponentComponent  {

  @Output() closeModalEvent = new EventEmitter<boolean>();

  constructor(public modal: NgbActiveModal) { }

  /**
   * close the popup
   * @param event 
   */
  onCloseModal(event):void{
    this.closeModalEvent.emit(FALSE);  
  }
}
