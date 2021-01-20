import { ToastrService } from 'ngx-toastr';
import { AgGridAngular } from 'ag-grid-angular/dist/agGridAngular';
import { Subscription } from '../../../node_modules/rxjs';
import * as moment from 'moment';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonService } from '../common.service';
import { Router } from '@angular/router';
import {
  BLANK, FALSE, TRUE, SPACE, UNDERSCORE,
  ZERO, LASTNAME, DISC_ID, ONE_THIRTY_SEVEN, DISC, QUEUE,
  MINUS_ONE, STARTSWITH, DISPDETAIL, AG_TEXT_FILTER, HEADER_NAME,
  CELL_RENDERER, WIDTH, FIELD, EXCEL_TIME_STAMP, MY_QUEUE, CONTRACT_ID_VAL, CLIENT_ID_VAL, ONE_HUNDRED, TWO_CHAR, THREE_CHAR, ONE_CHAR
} from 'src/common/constant';
import { NAVIGATE_PROCDETAIL } from 'src/common/url-constant';
import { getErrorMessage } from '../validator';

@Component({
  selector: 'app-my-queue',
  templateUrl: './my-queue.component.html',
  styleUrls: ['./my-queue.component.scss']
})
export class MyQueueComponent implements OnInit {
  @ViewChild('agGrid', { static: FALSE }) agGrid: AgGridAngular;
  customColumnDefsArr: any = [];
  columnDefs: any;
  rowData: any = [];
  defaultColumnDef: any = [];
  queueForm: FormGroup;
  columnArr: any;
  reconType: any = [];
  showGrid: boolean = FALSE;
  loader: boolean = FALSE;
  gridApi: any;
  subscription: Subscription = new Subscription();
  constructor(private formBuilder: FormBuilder, private commonService: CommonService,
    private toastr: ToastrService, private router: Router) { }

  /**
  * Do onLoad of page functionality.
  * @returns void
  */
  ngOnInit(): void {
    this.createForm();
    this.getReconType();
  }

  /**
  * Called on ngOnInit
  * To initialize Formgroup and Formcontrols.
  * @returns void
  */
  createForm(): void {
    this.queueForm = this.formBuilder.group({
      recon: [BLANK],
    });
  }

  /**
   * This method is to call service to get Processor List
   * based on the recon type selected
   * @returns void
   */
  getReconData(): void {
    this.columnArr = [];
    let reconId = this.queueForm.controls['recon'].value;
    if (reconId) {
      this.loader = TRUE;
      this.subscription = this.commonService.getRecon(reconId).subscribe(res => {
        if (res) {
          this.showGrid = TRUE;
          this.rowData = res;
          this.rowData.forEach(element => {
            this.columnArr = Object.keys(this.rowData[ZERO]);
            this.columnArr.forEach(column => {
              if (column === LASTNAME)
                element[column] = this.convertToTitleCase(element[column]);
            });
          });
          this.assignColumns();
          this.loader = FALSE;
        }
      },
        err => {
          this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
        });
    }
    else {
      this.showGrid = FALSE;
      this.rowData = [];
      this.columnDefs = [];
      this.defaultColumnDef = [];
    }
  }

  /**
   * This method is to get recon type list from service call
   *  @returns void
   */
  getReconType(): void {
    this.subscription = this.commonService.getReconTypeVal().subscribe(res => {
      this.reconType = res
      let reconId = this.commonService.reconId;
      if (this.commonService.reconId !== BLANK) {
        this.queueForm.controls['recon'].setValue(reconId);
        this.commonService.reconId = BLANK;
        this.getReconData();
      }
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });
  }

  /**
   * This method is to assign columns header based on the json object we get from service call
   *  @returns void
   */
  assignColumns(): void {
    this.customColumnDefsArr = [];
    for (let index in this.columnArr) {
      let customColumnDefs = {};
      if (this.validateColumn(index)) {
        if (this.columnArr[index].indexOf(UNDERSCORE) !== MINUS_ONE) {
          customColumnDefs[HEADER_NAME] = this.replaceUnderscore(this.columnArr[index]);
        } else if (this.columnArr[index] === this.columnArr[index].toLocaleUpperCase()) {
          customColumnDefs[HEADER_NAME] = this.columnArr[index].toLocaleUpperCase();
        } else {
          let headerFormatArr = this.columnArr[index].split(BLANK);
          headerFormatArr[ZERO] = headerFormatArr[ZERO].toLocaleUpperCase();
          let headerFormatVal = headerFormatArr.join(BLANK);
          customColumnDefs[HEADER_NAME] = headerFormatVal;
        }

        if (customColumnDefs[HEADER_NAME] === DISC_ID) {
          customColumnDefs[CELL_RENDERER] = params => {
            return '<div class="disc" style="color: blue; text-decoration: underline; cursor: pointer;">' + params.value + '</div>';
          }
        }
        customColumnDefs[FIELD] = this.columnArr[index];
        if (customColumnDefs[HEADER_NAME].length > 15) {
          customColumnDefs[WIDTH] = ONE_THIRTY_SEVEN + (customColumnDefs[HEADER_NAME].length * 2);
        } else if (customColumnDefs[HEADER_NAME] === CLIENT_ID_VAL || customColumnDefs[HEADER_NAME] === CONTRACT_ID_VAL || customColumnDefs[HEADER_NAME] === DISC_ID) {
          customColumnDefs[WIDTH] = ONE_HUNDRED;
        } else {
          customColumnDefs[WIDTH] = ONE_THIRTY_SEVEN;
        }
        this.customColumnDefsArr.push(customColumnDefs);
      }
    }
    this.columnDefs = this.customColumnDefsArr;

    this.defaultColumnDef = {
      sortable: TRUE,
      suppressToolPanel: TRUE,
      suppressMenu: TRUE,
      resizable: TRUE,
      filter: AG_TEXT_FILTER,
      filterParams: { defaultOption: STARTSWITH },
      component: { discpDetail: DISPDETAIL }
    }
  }

  validateColumn(index) {
    if (!((this.queueForm.controls['recon'].value === ONE_CHAR || this.queueForm.controls['recon'].value === TWO_CHAR) &&
      (this.columnArr[index] === 'PBP' || this.columnArr[index] === 'TRC_Received_Date' || this.columnArr[index] === 'transaction_Reply_Code' ||
        this.columnArr[index] === 'member_Status' || this.columnArr[index] === 'transaction_Date' ||
        this.columnArr[index] === 'CMS_Submission_Date' || this.columnArr[index] === 'TRC_205_Received_Date' || this.columnArr[index] === 'enrollment_Source')))
      if (!(this.queueForm.controls['recon'].value === THREE_CHAR &&
        (this.columnArr[index] === 'CMS_Value' || this.columnArr[index] === 'plan_Value' || this.columnArr[index] === 'disc_Code')))
        if ((this.queueForm.controls['recon'].value !== TWO_CHAR && this.columnArr[index] !== 'group_Id') || this.queueForm.controls['recon'].value === TWO_CHAR) {
          return true;
        }
    return false;
  }

  replaceUnderscore(header) {
    while (header.indexOf(UNDERSCORE) !== MINUS_ONE) {
      let headerFormatArr = header.replace(UNDERSCORE, SPACE).split(BLANK);
      headerFormatArr[ZERO] = headerFormatArr[ZERO].toLocaleUpperCase();
      let headerFormatVal = headerFormatArr.join(BLANK);
      header = headerFormatVal;
    }
    return header;
  }

  /**
   * This method is to make selected row as TRUE
   * @param event 
   *  @returns void
   */
  onRowSelected(event): void {
    if (event.node.selected) {
      event.data.selectedRow = TRUE;
    }
  }

  /**
   * Get the selected row on selection of row in Ag-grid and if the class name is 'disc' navigate to proc-detail page
   * @param event
   * @returns void 
   */
  getSelectedRows(event): void {
    let reconId = this.queueForm.controls['recon'].value;
    let rowVal = this.agGrid.api.getSelectedRows();
    if (rowVal) {
      let id = rowVal[ZERO].disc_Id;
      let discCode = rowVal[ZERO].disc_Code;
      if (event.target.className === DISC)
        this.router.navigate([NAVIGATE_PROCDETAIL, { id: id, reconId: reconId, discCode: discCode, screen: QUEUE }], { skipLocationChange: true });
    }
  }

  /**
   * Convert the header of Ag-grid column to Uppercase
   * @param value 
   * @returns string
   */
  convertToTitleCase(value): string {
    let headerFormatVal = BLANK;
    if (value != BLANK) {
      value = value.toLocaleLowerCase();
      let headerFormatArr = value.split(BLANK);
      headerFormatArr[ZERO] = headerFormatArr[ZERO].toLocaleUpperCase();
      headerFormatVal = headerFormatArr.join(BLANK);
    }
    return headerFormatVal;
  }

  exportToExcel() {
    let timeStamp = moment(new Date()).format(EXCEL_TIME_STAMP);
    const params = {
      allColums: true,
      fileName: MY_QUEUE + timeStamp
    }
    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.exportDataAsCsv(params);
    }

  }

  /**
  * This event is called internally by angular to do garbage collection.
  * This is used to clear the toaster and unsubcribe the subcription before leaving the page.
  * @returns void
  */
  ngOnDestroy(): void {
    this.toastr.clear();
    this.subscription.unsubscribe();
  }
}