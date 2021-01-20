import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import {
  SUCCESSFUL_EXECUTION, FALSE, TRUE, BLANK, LOADED_SUCCESSFULLY,
  TWO_THOUSAND,  PUBLISH_ATTEST, TRIGGER_SYNC, IN_PROGRESS
} from 'src/common/constant';
import { getErrorMessage } from '../validator';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-execute-batch',
  templateUrl: './execute-batch.component.html',
  styleUrls: ['./execute-batch.component.scss']
})
export class ExecuteBatchComponent implements OnInit {

  subscription = new Subscription();

  constructor(public commonService: CommonService, private toastr: ToastrService) { }

  ngOnInit() {
    if (this.commonService.isExecuteBatch) {
      this.toastr.success(IN_PROGRESS, BLANK, { closeButton: FALSE, disableTimeOut: TRUE });
    }
  }

  /**
   * Service call is made to publish Attest
   * @returns void
   */
  publishAttest(): void {
    this.toastr.success(IN_PROGRESS, BLANK, { closeButton: FALSE, disableTimeOut: TRUE });
    this.commonService.isExecuteBatch = TRUE;
    this.subscription = this.commonService.executeBatch(PUBLISH_ATTEST).subscribe(res => {
      if (res === SUCCESSFUL_EXECUTION) {
        this.commonService.isExecuteBatch = FALSE;
        this.toastr.clear();
        this.toastr.success(LOADED_SUCCESSFULLY, BLANK, { timeOut: TWO_THOUSAND });
      } else {
        this.commonService.isExecuteBatch = FALSE;
        this.toastr.clear();
        this.toastr.error(res, BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      }
    }, err => {
      this.commonService.isExecuteBatch = FALSE;
      this.toastr.clear();
      this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
    });
  }
  /**
     * Service call is made to Trigger Sync
     * @returns void
     */
  triggerSync(): void {
    this.commonService.isExecuteBatch = TRUE;
    this.toastr.success(IN_PROGRESS, BLANK, { closeButton: FALSE, disableTimeOut: TRUE });
    this.subscription = this.commonService.executeBatch(TRIGGER_SYNC).subscribe(res => {
      if (res === SUCCESSFUL_EXECUTION) {
        this.commonService.isExecuteBatch = FALSE;
        this.toastr.clear();
        this.toastr.success(LOADED_SUCCESSFULLY, BLANK, { timeOut: TWO_THOUSAND });
      } else {
        this.commonService.isExecuteBatch = FALSE;
        this.toastr.clear();
        this.toastr.error(res, BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      }
    }, err => {
      this.commonService.isExecuteBatch = FALSE;
      this.toastr.clear();
      this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
    });
  }
}

