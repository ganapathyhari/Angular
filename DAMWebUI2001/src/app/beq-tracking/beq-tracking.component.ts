
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgbDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular/dist/agGridAngular';
import { Subscription } from '../../../node_modules/rxjs';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonService } from '../common.service'
import { dateFormatter, onlyNumbers, getErrorMessage } from '../validator';
import {
  BLANK, FALSE, TRUE, DATE_FORMAT, START_DATE, END_DATE, FILE_CONTROL_NUMBER,
  CONTRACT_ID, REQUEST_JOB_ID, REQUEST_FILE_NAME, REQUEST_FILE_STATUS, REQUEST_FILE_CREATION_DATE,
  RESPONSE_JOB_ID, RESPONSE_FILE_NAME, RESPONSE_FILE_STATUS, RESPONSE_FILE_RECEIPT_DATE, REOLUTION_STATUS,
  ONE_HUNDRED_THIRTY, ONE_HUNDRED_TWENTY, ONE_HUNDRED_SEVENTY, TWO_HUNDRED_FIFTY, START_DATE_END_DATE_MANDATORY,
  END_DATE_BEFORE_START_DATE, START_DATE_INVALID, START_DATE_VALID_AFTER, END_DATE_INVALID, ONE, ZERO
} from 'src/common/constant';

@Component({
  selector: 'app-beq-tracking',
  templateUrl: './beq-tracking.component.html',
  styleUrls: ['./beq-tracking.component.scss']
})
export class BeqTrackingComponent implements OnInit {

  beqTrackingForm: FormGroup;
  @ViewChild('agGrid', { static: FALSE }) agGrid: AgGridAngular;
  @ViewChild('startDate', { static: FALSE }) startDate: NgbDatepicker;
  @ViewChild('endDate', { static: FALSE }) endDate: NgbDatepicker;
  rowData: any = [];
  columnDefs = [{ headerName: FILE_CONTROL_NUMBER, field: 'file_Ctrl_No', width: ONE_HUNDRED_THIRTY },
  { headerName: CONTRACT_ID, field: 'contract_Id', width: ONE_HUNDRED_TWENTY },
  { headerName: REQUEST_JOB_ID, field: 'req_Job_Id', width: ONE_HUNDRED_THIRTY },
  { headerName: REQUEST_FILE_NAME, field: 'beq_Req_File_Name', width: ONE_HUNDRED_SEVENTY },
  { headerName: REQUEST_FILE_STATUS, field: 'req_File_Status', width: ONE_HUNDRED_SEVENTY },
  { headerName: REQUEST_FILE_CREATION_DATE, field: 'req_File_Creation_Date', width: TWO_HUNDRED_FIFTY },
  { headerName: RESPONSE_JOB_ID, field: 'resp_Job_Id', width: ONE_HUNDRED_SEVENTY },
  { headerName: RESPONSE_FILE_NAME, field: 'beq_Resp_File_Name', width: ONE_HUNDRED_SEVENTY },
  { headerName: RESPONSE_FILE_STATUS, field: 'resp_File_Status', width: ONE_HUNDRED_SEVENTY },
  { headerName: RESPONSE_FILE_RECEIPT_DATE, field: 'resp_File_Rcpt_Date', width: TWO_HUNDRED_FIFTY },
  { headerName: REOLUTION_STATUS, field: 'resolution_Status', width: ONE_HUNDRED_SEVENTY }];

  errList: any = [];
  subscription: Subscription = new Subscription();
  constructor(private formBuilder: FormBuilder, private commonService: CommonService, private toastr: ToastrService) { }

  /**
  * Do onLoad of page functionality.
  * @returns void
  */
  ngOnInit(): void {
    this.getBeqTracking(START_DATE, END_DATE);
    this.createForm();
  }

  /**
  * Called on ngOnInit
  * To initialize Formgroup and Formcontrols.
  * @returns void
  */
  createForm(): void {
    this.beqTrackingForm = this.formBuilder.group({
      stDate: [BLANK],
      endDate: [BLANK]
    });
  }

  /** 
  * This method is to call service to get the BEQ Tracking table 
  * @returns void
  */
  getBeqTracking(stDate, endDate): void {
    let row = [];
    this.subscription = this.commonService.getBEQData(stDate, endDate).subscribe((res) => {
      let beqData = res;
      beqData.forEach(details => {
        let value = {
          'file_Ctrl_No': details.file_Ctrl_No,
          'contract_Id': details.contract_Id,
          'req_Job_Id': details.req_Job_Id,
          'beq_Req_File_Name': details.beq_Req_File_Name,
          'req_File_Status': details.req_File_Status,
          'req_File_Creation_Date': details.req_File_Creation_Date,
          'resp_Job_Id': details.resp_Job_Id,
          'beq_Resp_File_Name': details.beq_Resp_File_Name,
          'resp_File_Status': details.resp_File_Status,
          'resp_File_Rcpt_Date': details.resp_File_Rcpt_Date,
          'resolution_Status': details.resolution_Status
        }
        row.push(value);
      });
      this.rowData = row;
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });
  }

  /**
  * This method is called on click of filter button.
  * This method is to filter the BEQ Tracking table according to the start date and end date
  * and throws error message if any validation fails
  * @returns void
  */
  filter(): void {
    this.errList = [];
    let startDate = this.beqTrackingForm.controls['stDate'].value === BLANK ? BLANK : this.toDate(this.beqTrackingForm.controls['stDate'].value);
    let endDateVal = this.beqTrackingForm.controls['endDate'].value === BLANK ? BLANK : this.toDate(this.beqTrackingForm.controls['endDate'].value);
    let endDate = this.beqTrackingForm.controls['endDate'].value === BLANK ? BLANK : this.toEndDate(this.beqTrackingForm.controls['endDate'].value);
    if (!startDate || !endDateVal || startDate === BLANK || endDateVal === BLANK) {
      this.errList.push(START_DATE_END_DATE_MANDATORY)
    }
    else if (moment(endDateVal).isBefore(startDate)) {
      this.errList.push(END_DATE_BEFORE_START_DATE);
    } else {
      if (!moment(startDate, DATE_FORMAT, TRUE).isValid()) {
        this.errList.push(START_DATE_INVALID);
      } else if (moment(startDate).isBefore(START_DATE)) {
        this.errList.push(START_DATE_VALID_AFTER);
      }
      if (!moment(endDateVal, DATE_FORMAT, TRUE).isValid()) {
        this.errList.push(END_DATE_INVALID)
      }
    }
    if (this.errList.length === ZERO) {
      this.getBeqTracking(startDate, endDate)
    }
  }

  /**
  * This method is called on click of reset button.
  * This method is to reset the BEQ Tracking table with all records  
  * @returns void
  */
  reset(): void {
    this.errList = [];
    this.beqTrackingForm.controls['stDate'].setValue(BLANK);
    this.beqTrackingForm.controls['endDate'].setValue(BLANK);
    this.getBeqTracking(START_DATE, END_DATE);
  }

  /**
   * This method is to convert NgbDate to Date and format 
   * @param ngbDate 
   */
  toDate(ngbDate: NgbDateStruct) {
    return ngbDate ? moment(new Date(ngbDate.year, ngbDate.month - ONE, ngbDate.day)).format(DATE_FORMAT) : null;
  }

  /**
   * This method is to convert NgbDate to Date and format 
   * @param ngbDate 
   */
  toEndDate(ngbDate: NgbDateStruct) {
    return ngbDate ? moment(new Date(ngbDate.year, ngbDate.month - ONE, ngbDate.day + ONE)).format(DATE_FORMAT) : null;
  }

  /**
   * This method is to format DOB while entering value in the field
   * @param event 
   * @returns void
   */
  dobAddFormatter(event): void {
    dateFormatter(event)
  }

  /**
   * This method is to restrict only numbers
   * @param event
   * @returns boolean
   */
  restrict(event): boolean {
    return onlyNumbers(event)
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
