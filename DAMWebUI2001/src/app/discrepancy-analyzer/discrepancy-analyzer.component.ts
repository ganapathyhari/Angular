import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PopupComponentComponent } from '../popup-component/popup-component.component';
import {
  ZERO} from 'src/common/constant';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-discrepancy-analyzer',
  templateUrl: './discrepancy-analyzer.component.html',
  styleUrls: ['./discrepancy-analyzer.component.scss']
})
export class DiscrepancyAnalyzerComponent implements OnInit {


  discAnalyzerForm: FormGroup;
  file: File;
  fileList: any;
  arrayBuffer: any;
  fieldList: any = [];

  constructor( private toastr: ToastrService, private _modalService: NgbModal) {

  }

  /**
  * Do onLoad of page functionality.
  * @returns void
  */
  ngOnInit(): void {
  }

  addNew() {
    let value = {
      'id': this.fieldList.length,
      'fieldName': ""
    }
    this.fieldList.push(value);
    setInterval(() => {
      (<HTMLInputElement>document.getElementById(value.id)).disabled = false;
    }, 100);

  }

  update(index) {
    console.log(index)
    console.log(document.getElementById(index));
    (<HTMLInputElement>document.getElementById(index)).disabled = false;
  }

  /**
  *  It is called when delete button is clicked.
  * It is used to delete the selected row by calling the service.
  * It delete the row only if we select ok in the delete confirmation popup.
  * @param event
  * @returns void
  */

  onDeleteRow(index): void {
    let modalRef = this._modalService.open(PopupComponentComponent);
    modalRef.componentInstance.closeModalEvent.subscribe((res) => {
      if (!res) {
        console.log(res)
        console.log(index)
        this.fieldList = this.fieldList.filter(item => item.id !== index);
        modalRef.close();
      }

    });

  }




  addfile(event) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = () => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      let arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      console.log(arraylist)
      this.fileList = [];
      console.log(this.fileList)
      let columnArr = Object.keys(arraylist[ZERO]);
      console.log(columnArr)
      columnArr.forEach((details, i) => {
        let value = {
          'id': this.fieldList.length + i,
          'fieldName': details
        }
        this.fieldList.push(value);
      });
    }
  }
  save(){
    console.log(this.fieldList)
  }
  /**
  * This event is called internally by angular to do garbage collection.
  * This is used to clear the toaster and unsubcribe the subcription before leaving the page.
  * @returns void
  */
  ngOnDestroy(): void {
    this.toastr.clear();
  }
}


