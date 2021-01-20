import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from '../../../node_modules/rxjs';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonService } from '../common.service';
import { onlyNumbers, reportMonthFormatter, getErrorMessage } from '../validator';
import {
  BLANK, FALSE, TRUE, HYPEN, COPY_PASTE_FILE,
  REPORT_MONTH_FORMAT, FILE_LOAD_INPROGRESS, SUCCESSFUL_EXECUTION,
  LOADED_SUCCESSFULLY, TWO_THOUSAND, ONE_HUNDRED, ENTER_REPORT_MONTH_INVALID, FILE_NAME_FORMAT_MESSAGE
} from 'src/common/constant';

@Component({
  selector: 'app-load-recon',
  templateUrl: './load-recon.component.html',
  styleUrls: ['./load-recon.component.scss']
})
export class LoadReconComponent implements OnInit {
  loadReconForm: FormGroup;
  loader: boolean = FALSE;
  file: any;
  fileText: string = BLANK;
  filePath: string = BLANK;
  fileCopy: string = COPY_PASTE_FILE;
  isLoad: boolean = TRUE;
  errList = [];
  fileNameFormat = FILE_NAME_FORMAT_MESSAGE;

  subscription = new Subscription();
  constructor(private formBuilder: FormBuilder, public commonService: CommonService, private toastr: ToastrService) { }

  /**
  * Do onLoad of page functionality.
  * @returns void
  */
  ngOnInit(): void {
    this.createForm();
    if (this.commonService.fileLoad) {
      this.toastr.success(FILE_LOAD_INPROGRESS, BLANK, { closeButton: FALSE, disableTimeOut: TRUE });
    }
  }


  /**
  * Called on ngOnInit
  * To initialize Formgroup and Formcontrols.
  * @returns void
  */
  createForm(): void {
    this.loadReconForm = this.formBuilder.group({
      reportMonth: [BLANK]
    });
  }

  /**
   * Get path from service call on click of get path button
   * @returns void
   */
  getPath(): void {
    this.loader = TRUE;
    this.filePath = BLANK;
    this.subscription = this.commonService.getInputFilePath().subscribe(res => {
      this.filePath = res === null ? BLANK : res;
      this.fileText = this.fileCopy + this.filePath;
    })

    this.isLoad = FALSE;
    setTimeout(() => { this.loader = FALSE }, ONE_HUNDRED)
  }

  /**
   * Service call is made to load the file placed in the given path on click of upload file button
   * @returns void
   */
  loadFile(): void {
    this.errList = [];
    let reportMonth = this.loadReconForm.controls['reportMonth'].value;
    if (moment(reportMonth, REPORT_MONTH_FORMAT, TRUE).isValid()) {
      this.isLoad = TRUE;     
      reportMonth = reportMonth.replace(HYPEN, BLANK);
      this.toastr.success(FILE_LOAD_INPROGRESS, BLANK, { closeButton: FALSE, disableTimeOut: TRUE });
      this.commonService.fileLoad = TRUE;
      this.subscription = this.commonService.uploadFile(this.filePath, reportMonth).subscribe(res => {
        if (res === SUCCESSFUL_EXECUTION) {
          this.commonService.fileLoad = FALSE;
          this.toastr.clear();
          this.toastr.success(LOADED_SUCCESSFULLY, BLANK, { timeOut: TWO_THOUSAND });
          this.fileText = BLANK;
        } else {
          this.commonService.fileLoad = FALSE;
          this.toastr.clear();
          this.toastr.error(res, BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
        }
      }, err => {
        this.commonService.fileLoad = FALSE;
        this.toastr.clear();
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });       
      });
    } else {
      this.errList.push(ENTER_REPORT_MONTH_INVALID);
    }
  }

  /**
   * Cancel the loading of file
   * @returns void
   */
  cancel(): void {
    this.fileText = BLANK;
    this.isLoad = TRUE;
  }

  /**
   * restrict only numbers
   * @param event 
   * @returns boolean
   */
  validateVal(event): boolean {
    return onlyNumbers(event)
  }

  /**
   * Format the report month in 'yyyy-MM-dd' format
   * @param event
   * @returns void 
   */
  reportFormatter(event): void {
    reportMonthFormatter(event)
  }

}