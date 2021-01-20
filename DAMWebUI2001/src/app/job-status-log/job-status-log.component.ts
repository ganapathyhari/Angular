import { ToastrService } from 'ngx-toastr';
import { NgbDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Subscription } from '../../../node_modules/rxjs';

import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular/dist/agGridAngular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonService } from '../common.service'
import { onlyNumbers, dateFormatter, getErrorMessage } from '../validator';
import {
  BLANK, FALSE, TRUE, DATE_FORMAT, JOB_INSTANCE_ID, CONTRACT_ID,
  PROGRAM_ID, JOB_NAME, FILE_NAME, FILE_STATUS, JOB_START, JOB_END, JOB_STATUS, JOB_USER,
  ONE_HUNDRED_FIFTY, ONE_HUNDRED, ONE_HUNDRED_TWENTY, ONE_HUNDRED_TEN, TWO_HUNDRED_FIFTY,
  ONE_HUNDRED_SIXTY_FIVE, FIVE_HUNDRED, START_DATE_END_DATE_MANDATORY, END_DATE_BEFORE_START_DATE,
  START_DATE_INVALID, END_DATE_INVALID, ONE, NGB_DATE_FORMAT, ZERO, AG_TEXT_FILTER, STARTSWITH
} from 'src/common/constant';

@Component({
  selector: 'app-job-status-log',
  templateUrl: './job-status-log.component.html',
  styleUrls: ['./job-status-log.component.scss']
})
export class JobStatusLogComponent implements OnInit {
  jobStatusForm: FormGroup;
  @ViewChild('agGrid', { static: FALSE }) agGrid: AgGridAngular;
  @ViewChild('stDate', { static: FALSE }) stDate: NgbDatepicker;
  @ViewChild('endDate', { static: FALSE }) endDate: NgbDatepicker;
  jobStatusData: any;
  rowData: any = [];
  columnDefs = [{ headerName: JOB_INSTANCE_ID, field: 'jobInstanceId', width: ONE_HUNDRED_FIFTY },
  { headerName: CONTRACT_ID, field: 'contractId', width: ONE_HUNDRED },
  { headerName: PROGRAM_ID, field: 'programId', width: ONE_HUNDRED },
  { headerName: JOB_NAME, field: 'jobName', width: TWO_HUNDRED_FIFTY },
  { headerName: FILE_NAME, field: 'fileName', width: FIVE_HUNDRED },
  { headerName: FILE_STATUS, field: 'fileStatus', width: ONE_HUNDRED_TWENTY },
  { headerName: JOB_START, field: 'jobStart', width: ONE_HUNDRED_SIXTY_FIVE },
  { headerName: JOB_END, field: 'jobEnd', width: ONE_HUNDRED_SIXTY_FIVE },
  { headerName: JOB_STATUS, field: 'status', width: ONE_HUNDRED_TEN },
  { headerName: JOB_USER, field: 'jobUser', width: ONE_HUNDRED_FIFTY }];
  defaultColumnDef: any = [];
  jobData: any;
  errList: any = []
  subscription: Subscription = new Subscription;
  constructor(private formBuilder: FormBuilder, private commonService: CommonService, private toastr: ToastrService) { }

  /**
  * Do onLoad of page functionality.
  * @returns void
  */
  ngOnInit(): void {
    this.getJobStatusLog();
    this.createForm();
    this.defaultColumnDef = {
      sortable: TRUE,
      suppressToolPanel: TRUE,
      suppressMenu: TRUE,
      resizable: TRUE,
      filter: AG_TEXT_FILTER,
      filterParams: { defaultOption: STARTSWITH }
    }

  }


  /**
  * This method created the formgroup jobStatusForm.
  * @returns void
  */
  createForm(): void {
    this.jobStatusForm = this.formBuilder.group({
      stDate: [BLANK],
      endDate: [BLANK]
    });
  }

  /**
* This method is called on ngOnInit.
* This method is used to call the service to create rowdata of job log status data.
* @returns void
*/
  getJobStatusLog(): void {
    let row = [];
    this.subscription = this.commonService.getJobStatusLog().subscribe((res) => {
      this.jobData = res;
      this.jobData.forEach(details => {
        let value = {
          'jobInstanceId': details.jobInstanceId,
          'contractId': details.contractId,
          'programId': details.programId,
          'jobName': details.jobName,
          'fileName': details.fileName,
          'jobStart': details.jobStart,
          'jobEnd': details.jobEnd,
          'status': details.status ? details.status.toLocaleUpperCase() : BLANK,
          'fileStatus': details.fileStatus,
          'jobUser': details.jobUser
        }
        row.push(value);
      });
      this.jobData = row;
      this.rowData = row;
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });
  }

  /**
  * This method is called on click of filter button.
  * This method is to filter the job log status table according to the start date and end date
  * and throws error message if any validation fails
  * @returns void
  */
  filter(): void {
    this.errList = []
    let stDate = this.jobStatusForm.controls['stDate'].value === BLANK ? BLANK : this.toDate(this.jobStatusForm.controls['stDate'].value);
    let endDateVal = this.jobStatusForm.controls['endDate'].value === BLANK ? BLANK : this.toDate(this.jobStatusForm.controls['endDate'].value);
    let endDate = this.jobStatusForm.controls['endDate'].value === BLANK ? BLANK : this.toEndDate(this.jobStatusForm.controls['endDate'].value);
    if (!stDate || !endDate || stDate === BLANK || endDate === BLANK) {
      this.errList.push(START_DATE_END_DATE_MANDATORY)
    }
    else if (moment(endDateVal).isBefore(stDate)) {
      this.errList.push(END_DATE_BEFORE_START_DATE);
    } else {
      if (!moment(stDate, DATE_FORMAT, TRUE).isValid()) {
        this.errList.push(START_DATE_INVALID)
      }
      if (!moment(endDateVal, DATE_FORMAT, TRUE).isValid()) {
        this.errList.push(END_DATE_INVALID)
      }
    }
    if (this.errList.length === ZERO) {
      let row = [];
      this.jobData.forEach(details => {
        if (moment(new Date(details.jobEnd)).isAfter(stDate) &&
          moment(new Date(details.jobEnd)).isSameOrBefore(endDate)) {
          let value = {
            'jobInstanceId': details.jobInstanceId,
            'contractId': details.contractId,
            'programId': details.programId,
            'jobName': details.jobName,
            'fileName': details.fileName,
            'jobStart': details.jobStart,
            'jobEnd': details.jobEnd,
            'status': details.status ? details.status.toLocaleUpperCase() : BLANK,
            'fileStatus': details.fileStatus,
            'jobUser': details.jobUser
          }
          row.push(value);
        }
      });
      this.rowData = row;
    }
  }

  /**
  * This method is used to format the endDate in MM-DD-YYYY format if startDate is not null
  * @returns Date
  */
  toDate(ngbDate: NgbDateStruct) {
    return ngbDate ? moment(new Date(ngbDate.year, ngbDate.month - ONE, ngbDate.day)) : null;
  }

  /**
  * This method is used to format the endDate in MM-DD-YYYY format if endDate is not null
  * @returns Date
  */
  toEndDate(ngbDate: NgbDateStruct) {
    return ngbDate ? moment(new Date(ngbDate.year, ngbDate.month - ONE, ngbDate.day + ONE)).format(NGB_DATE_FORMAT) : null;
  }


  /**
  * This method is used call on keyup event of 
  * ngbDatepicker start date and end date to format it in MM-DD-YYYY format when typed manually. 
  * @returns void
  */
  dobAddFormatter(event): void {
    dateFormatter(event)
  }

  /**
  * This method is used call on keypress event of 
  * ngbDatepicker start date and end date to ensure only number is typed manually.
  * @returns void
  */
  restrict(event): boolean {
    return onlyNumbers(event);
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