
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from '../../../node_modules/rxjs';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonService } from '../common.service';
import { filterList, getErrorMessage } from '../validator';
import {
   BLANK, FALSE, TRUE, RECONCILATION_MANDATORY,
  REPORT_MONTH_MANDATORY, CONTRACT_ID_MANDATORY, CLIENT_ID_MANDATORY,
  EXECUTION_FAILED, EXPORT_FAILED, HYPEN, OUTPUT_FILE_PATH, EXPORTED_SUCCESSFULLY,
  ALL_SMALL, ZERO, FOUR, SIX, IN_PROGRESS
} from 'src/common/constant';

@Component({
  selector: 'app-export-recon',
  templateUrl: './export-recon.component.html',
  styleUrls: ['./export-recon.component.scss']
})
export class ExportReconComponent implements OnInit {
  exportReconForm: FormGroup;
  monthList: any = [];
  reportMonthList: any = [];
  reconType: any = [];
  clientContractArr: any = [];
  contractList: any = [];
  clientBool: boolean = TRUE;
  contractBool: boolean = TRUE;
  monthBool: boolean = TRUE;
  clientList: any = [];
  errList: any = [];
  fileText: string = BLANK;
  subscription: Subscription = new Subscription();

  constructor(private formBuilder: FormBuilder, public commonService: CommonService,
    private toastr: ToastrService) { }

  /**
  * Do onLoad of page functionality.
  * @returns void
  */
  ngOnInit(): void {
    if (this.commonService.isExport) {     
      this.toastr.success(IN_PROGRESS, BLANK, { closeButton: FALSE, disableTimeOut: TRUE });
    }
    this.getReconType();
    this.createForm();
  }

  /**
  * Called on ngOnInit
  * To initialize Formgroup and Formcontrols.
  * @returns void
  */
  createForm(): void {
    this.exportReconForm = this.formBuilder.group({
      reconcilation: [BLANK],
      reportMonth: [BLANK],
      clientId: [BLANK],
      contract: [BLANK]
    });
  }


  /**
  * This method is called on ngOnInit
  * This is used to call the service to get the values of recon dropdown.
  * @returns void
  */
  getReconType(): void {
    this.subscription = this.commonService.getReconTypeVal().subscribe(res => {
      this.reconType = res;
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      })
  }

  /**
  * This is used to clear client and contract list and disable client and contract field.
  * @returns void
  */
  disableClientContr(): void {
    this.clientContractArr = [];
    this.contractList = [];
    this.clientList = [];
    this.reportMonthList = [];
    this.clientBool = TRUE;
    this.contractBool = TRUE;
    this.monthBool = TRUE;
    this.exportReconForm.controls['clientId'].setValue(BLANK);
    this.exportReconForm.controls['reportMonth'].setValue(BLANK);
    this.exportReconForm.controls['contract'].setValue(BLANK);
    this.getClientContract();
  }

  /**
  * This is used to clear client and contract list and disable client and contract field.
  * @returns void
  */
  getClientContract(): void {   
   
    let reconId = this.exportReconForm.controls['reconcilation'].value;
    if (reconId !== BLANK) {
      this.subscription = this.commonService.getClientContractVal(reconId).subscribe(res => {
        this.clientBool = FALSE;        
        res.forEach((element, i) => {
          this.clientContractArr = res;
          this.clientList.push(res[i].client_Id);
        });
        this.clientList = filterList(this.clientList);
      },
        err => {
          this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
        });
    }
  }

  /**
   * Populate contract list having unique value based on client selected
   * @param event 
   * @returns void
   */
  getContractVal(event): void {
    this.monthBool=TRUE;
   this.contractList=[];
   this.monthList=[];
    this.exportReconForm.controls['contract'].setValue(BLANK);
    this.exportReconForm.controls['reportMonth'].setValue(BLANK);
    let selVal = event.target.value
    if (selVal !== BLANK) {
      let contractList = this.clientContractArr.filter(data => data.client_Id === selVal)
      contractList.forEach(details => {
        this.contractList.push(details.contract_Id);
      });
      this.contractList = filterList(this.contractList);
      this.contractBool = FALSE;
    }
    else {
      this.contractBool = TRUE;
    }
  }

  /**
  * This method is called on click of export button.
  * This is used to push the error in the errorlist if any validations fails.
  * If all validation passes,then call the service to export the recon.
  * @returns void
  */
  export(): void {
    this.errList = [];
    if (this.exportReconForm.controls['reconcilation'].value.trim() === BLANK)
      this.errList.push(RECONCILATION_MANDATORY);

    if (this.exportReconForm.controls['reportMonth'].value.trim() === BLANK)
      this.errList.push(REPORT_MONTH_MANDATORY);

    if (this.exportReconForm.controls['contract'].value.trim() === BLANK)
      this.errList.push(CONTRACT_ID_MANDATORY);

    if (this.exportReconForm.controls['clientId'].value === BLANK)
      this.errList.push(CLIENT_ID_MANDATORY);

    if (this.errList.length === ZERO) {
      this.fileText = BLANK;
      let reconId = this.exportReconForm.controls['reconcilation'].value;
      let reportMonth = this.exportReconForm.controls['reportMonth'].value;
      reportMonth = reportMonth.replace(HYPEN, BLANK);
      let contract_Id = this.exportReconForm.controls['contract'].value;
      let client_Id = this.exportReconForm.controls['clientId'].value;    
      this.toastr.success(IN_PROGRESS, BLANK, { closeButton: FALSE, disableTimeOut: TRUE });
      this.commonService.isExport = TRUE;
      this.subscription = this.commonService.exportRecon(reconId, reportMonth, contract_Id, client_Id).subscribe(res => {
        if (res === EXECUTION_FAILED) {
          this.toastr.clear();
          this.commonService.isExport = FALSE;
          this.toastr.error(EXPORT_FAILED, BLANK, { closeButton: TRUE, disableTimeOut: TRUE });         
        } else {
          this.commonService.isExport = FALSE;
          this.toastr.clear();
          let filePath = res;
          this.fileText = OUTPUT_FILE_PATH + filePath;
          this.toastr.success(EXPORTED_SUCCESSFULLY, BLANK, { timeOut: 2000 });
        }
      }, err => {
        this.commonService.isExport = FALSE;
        this.toastr.clear();
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });      
      });
    }
  }

  /**
  * This method is called on ngOnInit.
  * This is used to get the values for global reportmonth dropdown.
  * @returns void
  */
  getReportMonthValue(): void {
    this.reportMonthList = [];       
    this.monthList = [];    
    let contractId = this.exportReconForm.controls['contract'].value;
    if (contractId !== BLANK) {
      if (contractId === ALL_SMALL.toUpperCase()) {
        this.clientContractArr.forEach(details => {
          this.reportMonthList.push(details.report_Month);
        });
      } else {
        let reportMonthList = this.clientContractArr.filter(data => data.contract_Id === contractId)
        reportMonthList.forEach(details => {
          this.reportMonthList.push(details.report_Month);
        });
      }
      let latestReportMonth = BLANK;
      this.reportMonthList = filterList(this.reportMonthList);
      this.reportMonthList.forEach(details => {
        if (details !== BLANK) {
          let year = details.substring(ZERO, FOUR);
          let month = details.substring(FOUR, SIX);
          if (latestReportMonth === BLANK) {
            latestReportMonth = details;
          } else {
            if (moment(new Date(year, month)).isAfter(new Date(+latestReportMonth.substring(ZERO, FOUR), +latestReportMonth.substring(FOUR, SIX)))) {
              latestReportMonth = details;
            }
          }
          this.monthList.push(year + HYPEN + month);
        }
      });
      this.monthBool = FALSE;
      
      this.exportReconForm.controls['reportMonth'].setValue(latestReportMonth === BLANK ? BLANK:latestReportMonth.substring(ZERO, FOUR) + HYPEN + latestReportMonth.substring(FOUR, SIX));
    } else {
      this.monthBool = TRUE;
    }
  }

  /**
  * This method is called on click of reset button.
  * This is used to reset all the error list and formControl value.
  * @returns void
  */
  reset(): void {
    this.errList = [];
    this.contractList = [];
    this.monthList = [];
    this.fileText = BLANK;
    this.monthBool = TRUE;
    this.clientBool = TRUE;
    this.contractBool = TRUE;
    this.exportReconForm.controls['reconcilation'].setValue(BLANK);
    this.exportReconForm.controls['reportMonth'].setValue(BLANK);
    this.exportReconForm.controls['contract'].setValue(BLANK);
    this.exportReconForm.controls['clientId'].setValue(BLANK);
  }

}