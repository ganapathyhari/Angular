import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { AgGridAngular } from 'ag-grid-angular';
import { Subscription } from '../../../node_modules/rxjs';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonService } from '../common.service';
import { onlyNumbers, reportMonthFormatter, dateFormatter, isAlphaOnly, isAlphaNumeric, getErrorMessage } from '../validator';
import {
  BLANK, FALSE, TRUE, DATE_FORMAT, ID, REPORT_MONTH,
  CONTRACT_NO, DISC_TYPE, MBI, SUB_ID, FIRST_NAME, LAST_NAME, PLAN_VALUE,
  CMS_VALUE, ONE_HUNDRED, ONE_HUNDRED_SEVENTY, ONE_HUNDRED_FIFTY, ZERO,
  SELECT_CLIENT, SELECT_CONTRACT, ENTER_ATLEAST_ONE_FIELD, ENTER_DOB, REPORT_MONTH_FORMAT,
  ENTER_REPORT_MONTH_INVALID, ENTER_VALID_DOB, DOB, NEGATIVE_ONE, CLIENT_ID
} from 'src/common/constant';
import {
  CONTRACT_ID, REPORT_MONTH_CONDITION, MBI_CONDITION, SUB_ID_CONDITION,
  FIRST_NAME_CONDITION, LAST_NAME_CONDITION, BIRTH_DATE_CONDITION
} from 'src/common/url-constant';

@Component({
  selector: 'app-member-search',
  templateUrl: './member-search.component.html',
  styleUrls: ['./member-search.component.scss']
})
export class MemberSearchComponent implements OnInit {
  @ViewChild('agGrid', { static: FALSE }) agGrid: AgGridAngular;
  cellRenderer = function cellTitle(params) {
    return '<div class="disc" style="color: blue; text-decoration: underline; cursor: pointer;">' + params.value + '</div>';
  };
  columnDefs = [
    { headerName: ID, field: 'discId', width: ONE_HUNDRED },
    { headerName: REPORT_MONTH, field: 'reportMonth', width: ONE_HUNDRED_SEVENTY },
    { headerName: CONTRACT_NO, field: 'contractId', width: ONE_HUNDRED_FIFTY },
    { headerName: DISC_TYPE, field: 'discType', width: ONE_HUNDRED_FIFTY },
    { headerName: MBI, field: 'mbi', width: ONE_HUNDRED_FIFTY },
    { headerName: SUB_ID, field: 'subId', width: ONE_HUNDRED_FIFTY },
    { headerName: FIRST_NAME, field: 'firstName', width: ONE_HUNDRED_FIFTY },
    { headerName: LAST_NAME, field: 'lastName', width: ONE_HUNDRED_FIFTY },
    { headerName: PLAN_VALUE, field: 'planValue', width: ONE_HUNDRED_FIFTY },
    { headerName: CMS_VALUE, field: 'cmsValue', width: ONE_HUNDRED_FIFTY }
  ];
  rowData: any = [];
  defaultColumnDef: any;
  memberSearchForm: FormGroup;
  clientList: any = [];
  clientContractArr = [];
  clientBool: boolean = TRUE;
  contractBool: boolean = TRUE;
  showGrid: boolean = FALSE;
  contractList: any;
  errList: any = []
  clientContractMap: Map<string, Array<string>> = new Map();
  subscription: Subscription = new Subscription();

  constructor(private formBuilder: FormBuilder, private commonService: CommonService,
    private toastr: ToastrService) { }

  /**
  * Do onLoad of page functionality.
  * @returns void
  */
  ngOnInit(): void {
    this.populateContractMap();
    this.createForm();
    this.assignDefaultValues();
  }

  /**
  * Called on ngOnInit
  * To initialize Formgroup and Formcontrols.
  * @returns void
  */
  createForm(): void {
    this.memberSearchForm = this.formBuilder.group({
      client: [BLANK],
      reportMonth: [BLANK],
      contract: [BLANK],
      mbi: [BLANK],
      firstName: [BLANK],
      dob: [BLANK],
      lastName: [BLANK],
      subId: [BLANK]
    });
  }

  /**
   * define ag-grid columns default value
   * @returns void 
   */
  assignDefaultValues(): void {
    this.defaultColumnDef = {
      sortable: TRUE,
      editable: TRUE,
      suppressToolPanel: TRUE,
      suppressMenu: TRUE,
      resizable: TRUE
    }
  }

  /**
   * Get the selected row on selection of an Ag-grid row
   * @param event 
   * @returns void 
   */
  getSelectedRows(event): void {
    let rowVal = this.agGrid.api.getSelectedRows();
    rowVal[ZERO].id;
  }

  /**
 * populate contract list based on the client Id selected
 * @param event
 * @returns void 
 */
  getContractVal(event): void {
    let selVal = event.target.value
    if (selVal !== BLANK) {
      this.contractList = this.clientContractMap.get(selVal);
      this.contractBool = FALSE;
    }
    else {
      this.contractBool = TRUE;
    }
  }

  /**
   * This method is called on Submit button.
   * This is used to get the Members list matching the search parameters.
   * @returns void
   */
  submit(): void {
    this.rowData = [];
    this.errList = [];
    let client = this.memberSearchForm.controls['client'].value;
    let contractId = this.memberSearchForm.controls['contract'].value;
    let reportMonth = this.memberSearchForm.controls['reportMonth'].value;
    let mbi = this.memberSearchForm.controls['mbi'].value;
    let subId = this.memberSearchForm.controls['subId'].value;
    let firstName = this.memberSearchForm.controls['firstName'].value;
    let lastName = this.memberSearchForm.controls['lastName'].value;
    let dob = this.memberSearchForm.controls['dob'].value;
    if (client === BLANK) {
      this.errList.push(SELECT_CLIENT)
    } else if (contractId === BLANK) {
      this.errList.push(SELECT_CONTRACT)
    } else if (mbi === BLANK && subId === BLANK && firstName === BLANK && lastName === BLANK) {
      this.errList.push(ENTER_ATLEAST_ONE_FIELD)
    } else if (mbi === BLANK && subId === BLANK && (firstName !== BLANK || lastName !== BLANK) && dob === BLANK) {
      this.errList.push(ENTER_DOB)
    }
    if (reportMonth != BLANK)
      if (!moment(reportMonth, REPORT_MONTH_FORMAT, TRUE).isValid()) {
        this.errList.push(ENTER_REPORT_MONTH_INVALID)
      }
    if (dob !== BLANK) {
      if (!moment(dob, DATE_FORMAT, TRUE).isValid()) {
        this.errList.push(ENTER_VALID_DOB)
      }
    }
    if (this.errList.length === ZERO) {
      let url = CONTRACT_ID + contractId;
      if (reportMonth !== BLANK)
        url = url + REPORT_MONTH_CONDITION + reportMonth + NEGATIVE_ONE;
      if (mbi !== BLANK)
        url = url + MBI_CONDITION + mbi;
      if (subId !== BLANK)
        url = url + SUB_ID_CONDITION + subId;
      if (firstName !== BLANK)
        url = url + FIRST_NAME_CONDITION + firstName;
      if (lastName !== BLANK)
        url = url + LAST_NAME_CONDITION + lastName;
      if (dob !== BLANK)
        url = url + BIRTH_DATE_CONDITION + dob;
      let row = [];
      this.subscription = this.commonService.getMemberData(url).subscribe(res => {
        let memData = res;
        memData.forEach(details => {
          let value = {
            'discId': details.disc_Id,
            'reportMonth': details.report_Month,
            'contractId': details.contract_Id,
            'discType': details.disc_Code,
            'mbi': details.MBI,
            'subId': details.sub_Id,
            'firstName': details.first_Name,
            'lastName': details.last_Name,
            'planValue': details.plan_Value,
            'cmsValue': details.CMS_Value
          }
          row.push(value);
        });
        this.rowData = row;
        this.showGrid = TRUE;
      },
        err => {
          this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
        });
    }
  }

  /**
   * It is called when On load of the Member Search screen.
   * It create a map which has the array of contract for particular client.
   * @returns void
   */
  populateContractMap(): void {

    this.clientContractArr = [];
    this.contractList = [];
    this.subscription = this.commonService.getMemClientDefinition().subscribe(res => {
      if (res.length > ZERO) {
        this.clientList = this.filterListOfClient(res, CLIENT_ID);
        for (let i = ZERO; i < this.clientList.length; i++) {
          let list = res.filter(data => data.client_Id === this.clientList[i]);
          let contractList = [];
          list.forEach((element) => {
            contractList.push(element.contract_Id);
          });
          this.clientContractMap.set(this.clientList[i], contractList);
        }
      }
    },
      err => { 
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });

  }

  /**
    * It is used to filter the given list according to the given key.
    * @param array to filter.
    * @param key according to which array is filter.
   * @returns filteredList
   */
  filterListOfClient(list, key) {
    let filteredList = [];
    const map = new Map();
    for (const item of list) {
      if (!map.has(item[key])) {
        map.set(item[key], TRUE);
        filteredList.push(item[key]);
      }
    }
    return filteredList;
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
   * restricts only alphabets 
   * @param event 
   */
  isAlphaOnly(event) {
    isAlphaOnly(event)
  }

  /**
   * restricts only alphabets and numbers
   * @param event 
   * @returns boolean
   */
  isAlphaNumeric(event): boolean {
    return isAlphaNumeric(event);
  }

  /**
   * Formats the date field in its corresponding format according to the key
   * @param event 
   * @param key 
   * @returns void
   */
  dobAddFormatter(event, key): void {
    if (key == DOB) {
      dateFormatter(event)
    } else {
      reportMonthFormatter(event)
    }
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
