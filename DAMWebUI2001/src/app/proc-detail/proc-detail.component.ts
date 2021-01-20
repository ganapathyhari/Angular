import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from '../../../node_modules/rxjs';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../common.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProcDetailDTO } from 'src/model/procDetail';
import { DatePipe } from '@angular/common';
import {
  BLANK, TRUE, UPDATED_SUCCESSFULLY, TWO_THOUSAND,
  QUEUE, ZERO, SELECT_STATUS, SELECT_ACTION, MEMBER_SEARCH,
  US_DATEPIPE, DATE_FORMAT, REPORT_MONTH_ATTEST_FORMAT, ONE_CHAR, STATUS, REASON, ACTION, THREE_CHAR
} from 'src/common/constant';
import { NAVIGATE_MYQUEUE, NAVIGATE_MEMSEARCH } from 'src/common/url-constant';
import { getErrorMessage } from '../validator';

@Component({
  selector: 'app-proc-detail',
  templateUrl: './proc-detail.component.html',
  styleUrls: ['./proc-detail.component.scss']
})
export class ProcDetailComponent implements OnInit {
  datePipe = new DatePipe(US_DATEPIPE);
  procDetailForm: FormGroup;
  discpId;
  reconID;
  message: any;
  fromScreen: string;
  assignedTo: string = BLANK;
  subscription = new Subscription();
  actionValues: string[] = [];
  statusValues: string[] = [];
  reasonValues: string[] = [];
  errList: string[] = [];
  discCode: string;
  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder,
    private commonService: CommonService, private toastr: ToastrService, private router: Router) { }

  /**
  * Do onLoad of page functionality.
  * @returns void
  */
  ngOnInit(): void {
    this.createForm();
    this.getValuesFromRoute();
    this.populateDropdown();
  }

  /**
  * Called on ngOnInit
  * To initialize Formgroup and Formcontrols.
  * @returns void
  */
  createForm(): void {
    this.procDetailForm = this.formBuilder.group({
      contract: [BLANK],
      pbp: [BLANK],
      segment: [BLANK],
      mbi: [BLANK],
      subId: [BLANK],
      groupId: [BLANK],
      action: [BLANK],
      clientId: [BLANK],
      lastName: [BLANK],
      firstName: [BLANK],
      gender: [BLANK],
      dob: [BLANK],
      description: [BLANK],
      planValue: [BLANK],
      reason: [BLANK],
      startDate: [BLANK],
      endDate: [BLANK],
      months: [BLANK],
      aged: [BLANK],
      cmsValue: [BLANK],
      status: [BLANK],
      notes: [BLANK],
      discCode: [BLANK],
      trcReceivedDate: [BLANK],
      transDate: [BLANK],
      cmsSubDate: [BLANK],
      trc205ReceivedDate: [BLANK],
      enrollmentSource: [BLANK]
    });
  }

  populateDropdown() {
    this.actionValues = this.commonService.actionReasonStatusInfo.filter(data => data.param_id === ACTION);
    this.reasonValues = this.commonService.actionReasonStatusInfo.filter(data => data.param_id === REASON);
    this.statusValues = this.commonService.actionReasonStatusInfo.filter(data => data.param_id === STATUS);
  }
  /**
   * Get the value from previous page and call populateDetails method to populate the detail
   * @returns void
   */
  getValuesFromRoute(): void {
    this.activatedRoute.params.subscribe(params => {
      this.discpId = params.id;
      this.reconID = params.reconId;
      this.discCode = params.discCode;
      this.fromScreen = params.screen;
      this.commonService.reconId = params.reconId;
      this.populateDetails();
    });
  }


  /**
   * call the service to get the proc detail by passing recon id and disp code
   * @returns void
   */
  populateDetails(): void {
    this.subscription = this.commonService.getProcDetailDiscpData(this.reconID, this.discpId).subscribe(res => {
      this.fillValues(res);
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });
  }

  /**
   * Populate form values from the service call response
   * @param procDetail 
   * @returns void
   */
  fillValues(procDetail): void {
    this.procDetailForm.controls['contract'].setValue(procDetail.contract_Id);
    this.procDetailForm.controls['pbp'].setValue(procDetail.pbp);
    this.procDetailForm.controls['segment'].setValue(procDetail.segment);
    this.procDetailForm.controls['mbi'].setValue(procDetail.MBI);
    this.procDetailForm.controls['subId'].setValue(procDetail.sub_Id);
    this.procDetailForm.controls['groupId'].setValue(procDetail.group_Id);
    this.procDetailForm.controls['clientId'].setValue(procDetail.client_Id);
    this.assignedTo = procDetail.assigned_To;
    this.procDetailForm.controls['lastName'].setValue(procDetail.last_Name);
    this.procDetailForm.controls['firstName'].setValue(procDetail.first_Name);
    this.procDetailForm.controls['gender'].setValue(procDetail.gender);
    this.procDetailForm.controls['dob'].setValue(procDetail.birth_Date === BLANK ? BLANK : moment(procDetail.birth_Date).format(DATE_FORMAT));
    this.procDetailForm.controls['description'].setValue(procDetail.description);
    this.procDetailForm.controls['planValue'].setValue(procDetail.plan_Value);
    this.procDetailForm.controls['startDate'].setValue(procDetail.discp_Start_Date === BLANK ? BLANK : moment(procDetail.discp_Start_Date).format(DATE_FORMAT));
    this.procDetailForm.controls['endDate'].setValue(procDetail.discp_End_Date === BLANK ? BLANK : moment(procDetail.discp_End_Date).format(DATE_FORMAT));
    this.procDetailForm.controls['months'].setValue(procDetail.months);
    this.procDetailForm.controls['aged'].setValue(procDetail.discp_Age);
    this.procDetailForm.controls['cmsValue'].setValue(procDetail.CMS_Value);
    this.procDetailForm.controls['notes'].setValue(procDetail.note);
    this.procDetailForm.controls['action'].setValue(procDetail.action);
    this.procDetailForm.controls['reason'].setValue(procDetail.reason);
    this.procDetailForm.controls['status'].setValue(procDetail.status);
    this.procDetailForm.controls['discCode'].setValue(this.discCode);
    if (this.reconID === THREE_CHAR) {
      this.procDetailForm.controls['trcReceivedDate'].setValue(procDetail.TRC_Received_Date === BLANK ? BLANK : moment(procDetail.TRC_Received_Date).format(DATE_FORMAT));
      this.procDetailForm.controls['cmsValue'].setValue(procDetail.transaction_Reply_Code);
      this.procDetailForm.controls['months'].setValue(procDetail.member_Status);
      this.procDetailForm.controls['transDate'].setValue(procDetail.transaction_Date === BLANK ? BLANK : moment(procDetail.transaction_Date).format(DATE_FORMAT));
      this.procDetailForm.controls['cmsSubDate'].setValue(procDetail.CMS_Submission_Date === BLANK ? BLANK : moment(procDetail.CMS_Submission_Date).format(DATE_FORMAT));
      this.procDetailForm.controls['trc205ReceivedDate'].setValue(procDetail.TRC_205_Received_Date === BLANK ? BLANK : moment(procDetail.TRC_205_Received_Date).format(DATE_FORMAT));
      this.procDetailForm.controls['enrollmentSource'].setValue(procDetail.enrollment_Source);
    }
  }

  /**
   * Update action,reason,status,assigned,note values by calling the service
   * @returns void
   */
  update(): void {
    this.validateMandatoryFields();
    if (this.errList.length === ZERO) {
      let procDetails = new ProcDetailDTO();
      procDetails.discp_Action = this.procDetailForm.controls['action'].value;
      procDetails.discp_Id = this.discpId;
      procDetails.discp_Reason = this.procDetailForm.controls['reason'].value;
      procDetails.discp_Status = this.procDetailForm.controls['status'].value;
      procDetails.processor_Id = this.assignedTo;
      procDetails.recon_Id = this.reconID;
      procDetails.note = this.procDetailForm.controls['notes'].value;
      this.subscription = this.commonService.putProcDetailDiscpData(procDetails).subscribe(res => {
        if (res) {
          this.toastr.success(UPDATED_SUCCESSFULLY, BLANK, { timeOut: TWO_THOUSAND });
          this.router.navigateByUrl(NAVIGATE_MYQUEUE);
        }
      },
        err => {
          this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
        });
    }
  }

  /**
   * This method is to validate mandatory fields
   * @returns void
   */
  validateMandatoryFields(): void {
    this.errList = [];
    let action = this.procDetailForm.controls['action'].value;
    let status = this.procDetailForm.controls['status'].value;
    if (action === BLANK)
      this.errList.push(SELECT_ACTION);
    if (status === BLANK)
      this.errList.push(SELECT_STATUS);
  }

  /**
   * Navigate to my-queue screen or Member-search screen based on from-screen
   * @returns void
   */
  cancel(): void {
    this.errList = [];
    if (this.fromScreen === QUEUE)
      this.router.navigateByUrl(NAVIGATE_MYQUEUE);
    else if (this.fromScreen === MEMBER_SEARCH)
      this.router.navigateByUrl(NAVIGATE_MEMSEARCH);
  }

  /**
  * This event is called internally by angular to do garbage collection.
  * This is used to clear the toaster and unsubcribe the subcription before leaving the page.
  * @returns void
  */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
