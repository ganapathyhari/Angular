import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from '../../../node_modules/rxjs';
import { AgGridAngular } from '../../../node_modules/ag-grid-angular';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonService } from '../common.service';
import { AssignDTO } from 'src/model/procListColumn';
import { onlyNumbers, filterList, getErrorMessage } from '../validator';
import {
  BLANK, FALSE, TRUE, OTHER, ZERO, FOUR, SIX,
  HYPEN, NO_UNASSIGNED_DISCREPANCIES_AVAILABLE, SELECT_RECON_TYPE,
  SELECT_DISCREPANCY_TYPE, SELECT_PROCESSOR, SELECT_CONTRACT, SELECT_TRC, SELECT_CLIENT,
  FALSE_STRING, ALL_SMALL, ASSIGNED_SUCCESSFULLY, TWO_THOUSAND, ENTER_QUANTITY,
  ENTER_QUANTITY_INVALID, QUANTITY_LESS_THAN_UNASSIGNED, TWO_HUNDRED_TEN, MINUS_ONE, COMMA,
  DISCREPENCY_CODE, UNASSIGNED_COUNT, DISCREPENCY_TODO, MULTIPLE, SPACE, TWO, TRANSACTION_REPLY_CODE, THREE_CHAR, TEN, SELECT_TR_CODE
} from 'src/common/constant';



@Component({
  selector: 'app-discrepancy-analysis-manager',
  templateUrl: './discrepancy-analysis-manager.component.html',
  styleUrls: ['./discrepancy-analysis-manager.component.scss']
})
export class DiscrepancyAnalysisManagerComponent implements OnInit {
  @ViewChild('agGrid', { static: FALSE }) agGrid: AgGridAngular;
  assignForm: FormGroup;
  otherFlag: boolean = FALSE;
  reconType: any = [];
  errList: any = [];
  processorErrorList: any = [];
  contractList: any;
  clientList: any;
  trcDateList: any = [];
  reportMonthList: any = [];
  processorNameList: any = [];
  processorDetailsList: any = [];
  discpCodeList: any = [];
  discpDetailsList: any = [];
  discp4RxDetailsList: any = [];
  clientContractArr: any = [];
  clientBool: boolean = TRUE;
  trcBool: boolean = TRUE;
  contractBool: boolean = TRUE;
  errorMessage: string = BLANK;
  errorFlag: boolean = FALSE;
  discpErrorMessage: string = BLANK;
  processorName: string = BLANK;
  loader: boolean = FALSE;
  rowData: GridModel[] = [];
  subscription: Subscription = new Subscription();
  rowSelection = MULTIPLE;
  columnDefs = [];
  reconId: any;
  selectedTrcDate: string = BLANK;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService
  ) { }

  /**
  * Do onLoad of page functionality.  
  * @returns void
  */
  ngOnInit(): void {
    this.contractList = [];
    this.clientList = [];
    this.getReconType();
    this.createForm();
  }

  /**
  * Called on ngOnInit
  * To initialize Formgroup and Formcontrols.
  * @returns void
  */
  createForm(): void {
    this.assignForm = this.formBuilder.group({
      reconcilation: [BLANK],
      unAssignTotal: [BLANK],
      client: [BLANK],
      contract: [BLANK],
      reportMonth: [BLANK],
      processorName: [BLANK],
      totalToDo: [BLANK],
      quantity: [BLANK],
      other: [BLANK],
      trcDate: [BLANK]
    });
  }

  /**
   * restricts only numbers
   * @param event 
   * @returns boolean
   */
  validateVal(event): boolean {
    return onlyNumbers(event)
  }

  /**
   * get recon type from service call
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
   * on change of recon type,clear and enable client and contract
   * @returns void
   */
  disableClientContr(): void {
    this.reconId = this.assignForm.controls['reconcilation'].value;
    this.assignForm.controls['client'].setValue(BLANK);
    this.assignForm.controls['contract'].setValue(BLANK);
    this.resetFields();
    this.setColumnName();
    this.clientContractArr = [];
    this.contractList = [];
    this.clientBool = TRUE;
    this.contractBool = TRUE;
    this.getClientContract();
  }

  setColumnName() {
    this.columnDefs = [];
    let reconId = this.assignForm.controls['reconcilation'].value;
    if (reconId === THREE_CHAR) {
      this.columnDefs = [{
        headerName: TRANSACTION_REPLY_CODE, field: 'discp_Code', width: TWO_HUNDRED_TEN, checkboxSelection: true,
      },
      {
        headerName: UNASSIGNED_COUNT, field: 'unassigned_Count', width: TWO_HUNDRED_TEN
      }, {
        headerName: DISCREPENCY_TODO, field: 'assign_Count', width: TWO_HUNDRED_TEN
      }]
    } else {
      this.columnDefs = [{
        headerName: DISCREPENCY_CODE, field: 'discp_Code', width: TWO_HUNDRED_TEN, checkboxSelection: true,
      },
      {
        headerName: UNASSIGNED_COUNT, field: 'unassigned_Count', width: TWO_HUNDRED_TEN
      },
      {
        headerName: DISCREPENCY_TODO, field: 'assign_Count', width: TWO_HUNDRED_TEN
      }];
    }
  }

  /**
   * call service to get client and contract based on the recon type selected
   * @returns void
   */
  getClientContract(): void {
    let reconId = this.assignForm.controls['reconcilation'].value;
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
  * This method is called on ngOnInit.
  * This is used to get the values for global reportmonth dropdown.
  * @returns void
  */
  getReportMonthValue(): void {
    this.reportMonthList = [];
    let contractId = this.assignForm.controls['contract'].value;
    if (contractId !== BLANK) {
      let reportMonthList = this.clientContractArr.filter(data => data.contract_Id === contractId)
      reportMonthList.forEach(details => {
        this.reportMonthList.push(details.report_Month);
      });
      this.reportMonthList = filterList(this.reportMonthList);
      let latestReportMonth = BLANK;
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
        }
      });
      if (latestReportMonth !== BLANK) {
        this.assignForm.controls['reportMonth'].setValue(latestReportMonth.substring(ZERO, FOUR) + HYPEN + latestReportMonth.substring(FOUR, SIX));
      }
    } else {
      this.assignForm.controls['reportMonth'].setValue(BLANK);
    }
  }

  /**
   * populate contract list based on the client Id selected
   * @param event 
   * @returns void
   */
  getContractVal(event): void {
    this.contractList = [];
    this.assignForm.controls['contract'].setValue(BLANK);
    this.resetFields();
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
   * called on change of contract,get discrepency details,latest report month value based on contract selected
   * @returns void
   */
  onChangeContract(): void {
    this.processorName = this.assignForm.controls['processorName'].value;
    this.resetFields();
    this.discpDetailsList = [];
    this.discp4RxDetailsList = [];
    this.processorDetailsList = [];
    if (this.reconId !== THREE_CHAR) {
      this.getReportMonthValue();
    }
    let contractId = this.assignForm.controls['contract'].value;
    let reconId = this.assignForm.controls['reconcilation'].value;
    if (contractId !== BLANK && reconId !== BLANK) {
      this.getDiscrepancyDetails(reconId, contractId);
    }
  }

  /**
   * Reset form values and flags
   * @returns void
   */
  resetFields(): void {
    this.otherFlag = FALSE;
    this.errorFlag = FALSE;
    this.discpErrorMessage = BLANK;
    this.errorMessage = BLANK;
    this.errList = [];
    this.rowData = [];
    this.processorErrorList = [];
    this.processorNameList = [];
    this.trcDateList = [];
    this.trcBool = TRUE;
    this.assignForm.controls['unAssignTotal'].setValue(BLANK);
    this.assignForm.controls['totalToDo'].setValue(BLANK);
    this.assignForm.controls['quantity'].setValue(BLANK);
    this.assignForm.controls['other'].setValue(BLANK);
    this.assignForm.controls['processorName'].setValue(BLANK);
    this.assignForm.controls['reportMonth'].setValue(BLANK);
    this.assignForm.controls['trcDate'].setValue(BLANK);
  }

  /**
   * Calculate assigned and unassigned count based on discrepancy code and processor name selected
   * @param processorName 
   * @param discpCode 
   * @returns void
   */
  calculateCount(processorName): void {
    if (processorName != BLANK) {
      let proc = this.processorNameList.filter(data => data.processor_Id === processorName)
      let procVal = proc.length === ZERO ? BLANK : processorName;
      this.assignForm.controls['processorName'].setValue(procVal);
      this.calculateAssignedCount(processorName);
    }
    if (processorName === BLANK) {
      this.assignForm.controls['totalToDo'].setValue(BLANK);
    }
    this.processorName = BLANK;

  }

  /**
   * Updates unassigned total
   * @returns void
   */
  updateUnassignedTotal(): void {
    let unAssignedTotal = ZERO;
    if (this.reconId !== THREE_CHAR) {
      this.discpDetailsList.forEach(discDetail => {
        unAssignedTotal += discDetail.unassigned_Count;
      });
    } else {
      this.discp4RxDetailsList.forEach(discDetail => {
        unAssignedTotal += discDetail.unassigned_Count;
      });
    }
    this.assignForm.controls['unAssignTotal'].setValue(unAssignedTotal);
  }

  /**
   * get processor details from service and calculate count 
   * @param reconId 
   * @param contractId 
   * @returns void
   */
  getProcessorDetails(reconId, contractId): void {
    this.subscription = this.commonService.getProcessorDetails(reconId, contractId).subscribe(res => {
      this.processorDetailsList = res;
      this.processorNameList = this.filterProcList(this.processorDetailsList);
      this.calculateCount(this.processorName);
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });
  }

  /**
   * To filter processor list with distinct values
   * @param list 
   * @returns any
   */
  filterProcList(list): any {
    let filteredList = [];
    const map = new Map();
    for (const item of list) {
      if (!map.has(item.processor_Id)) {
        map.set(item.processor_Id, TRUE);
        filteredList.push(item);
      }
    }
    return filteredList;
  }

  /**
   * call service to get discrepency details and reset all previously set form and flag values
   * @param reconID 
   * @param contractId 
   * @returns void
   */
  getDiscrepancyDetails(reconID, contractId): void {
    this.discpErrorMessage = BLANK;
    this.errList = [];
    this.processorErrorList = [];
    this.discpDetailsList = [];
    this.discp4RxDetailsList = [];
    this.clearFormGroup();
    this.subscription = this.commonService.getDiscrepancyDetails(reconID, contractId).subscribe(res => {
      this.discpDetailsList = res;
      if (res.length == ZERO) {
        this.rowData = [];
        this.discpErrorMessage = NO_UNASSIGNED_DISCREPANCIES_AVAILABLE;
        this.assignForm.controls['unAssignTotal'].setValue(BLANK);
      } else {
        if (this.reconId !== THREE_CHAR) {
          this.discpDetailsList.forEach(element => {
            this.discpCodeList.push(element.discp_Code);
          });
          this.discpCodeList = filterList(this.discpCodeList);
          this.rowData = this.discpDetailsList;
          this.updateUnassignedTotal();
          this.getProcessorDetails(reconID, contractId);
        } else {
          this.trcBool = FALSE;
          this.trcDateList = [];
          this.discpDetailsList.forEach(element => {
            this.trcDateList.push(element.trc_Received_Date.substring(ZERO, TEN));
          });
          this.trcDateList = filterList(this.trcDateList);
          this.get4RXDiscrepancy();
        }
      }
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      })
  }

  get4RXDiscrepancy() {
    let trcList = this.trcDateList.filter(data => data === this.selectedTrcDate)
    if (this.selectedTrcDate !== BLANK && trcList.length !== ZERO) {
      this.assignForm.controls['trcDate'].setValue(this.selectedTrcDate);
    }
    this.selectedTrcDate = BLANK;
    let trcDate = this.assignForm.controls['trcDate'].value;
    if (trcDate !== BLANK) {
      this.discp4RxDetailsList = [];
      this.discp4RxDetailsList = this.discpDetailsList.filter(data => data.trc_Received_Date.substring(ZERO, TEN) === trcDate)
      if (this.discp4RxDetailsList.length === ZERO) {

      }
      this.discp4RxDetailsList.forEach(element => {
        this.discpCodeList.push(element.discp_Code);
      });
      this.discpCodeList = filterList(this.discpCodeList);
      this.rowData = this.discp4RxDetailsList;
      if (this.processorName === BLANK) {
        this.processorName = this.assignForm.controls['processorName'].value;
      }
      this.updateUnassignedTotal();
      let contractId = this.assignForm.controls['contract'].value;
      this.getProcessorDetails(this.reconId, contractId);
    }
  }
  /**
   * update assigned count
   * @param event
   * @returns void
   */
  updateAssignedCount(event): void {
    let procId = event.target.value;
    this.calculateAssignedCount(procId);
  }

  /**
   * calculate assigned count and dicrepancy to do count
   * @param procId 
   * @returns void
   */
  calculateAssignedCount(procId): void {
    let assignedCount = ZERO;
    this.processorDetailsList.forEach(detail => {
      if (this.reconId !== THREE_CHAR) {
        if (detail.processor_Id == procId) {
          assignedCount += detail.assign_Count;
        }
      } else {
        let trcDate = this.assignForm.controls['trcDate'].value;
        if (detail.processor_Id == procId && detail.trc_Received_Date.substring(ZERO, TEN) === trcDate) {
          assignedCount += detail.assign_Count;
        }
      }
    });
    this.assignForm.controls['totalToDo'].setValue(assignedCount);
    this.updateAssignCount(procId);
  }

  /**
   * calculate  dicrepancy to do count and updates in ag grid
   * @param procId 
   * @returns void
   */
  updateAssignCount(procId) {   
    let filterList = this.processorDetailsList.filter(data => data.processor_Id === procId);
    if (this.reconId === THREE_CHAR) {
      let trcDate = this.assignForm.controls['trcDate'].value;
      if (trcDate !== BLANK)
        filterList = filterList.filter(data => data.trc_Received_Date.substring(ZERO, TEN) === trcDate);
    }
    this.rowData.forEach(details => {
      details.assign_Count = ZERO;
      filterList.forEach(detail => {
        if (detail.discp_Code == details.discp_Code) {
          details.assign_Count = detail.assign_Count;
        }
      });
    });
    if (this.agGrid) {
      this.agGrid.api.refreshCells();
    }
  }

  /**
   * set the otherFlag to TRUE if quantity is equal to "other"
   * else set the otherFlag to false if quantity is not equal to "other"
   * @param event 
   * @returns void
   */
  checkForOther(event): void {
    this.errorMessage = BLANK;
    this.errorFlag = FALSE;
    if (event.target.value == OTHER) {
      this.assignForm.controls['other'].setValue(BLANK);
      this.otherFlag = TRUE;
    } else {
      this.otherFlag = FALSE;
    }
  }

  /**
   * Validate mandatory fields
   * @returns void
   */
  validateFileds(selectedRowNodes?): void {
    if (this.assignForm.controls['reconcilation'].value === BLANK)
      this.errList.push(SELECT_RECON_TYPE);
    else if (this.assignForm.controls['client'].value === BLANK)
      this.errList.push(SELECT_CLIENT);
    else if (this.assignForm.controls['contract'].value === BLANK)
      this.errList.push(SELECT_CONTRACT);
    else if (this.reconId === THREE_CHAR && this.assignForm.controls['trcDate'].value === BLANK)
      this.errList.push(SELECT_TRC);
    else {
      this.validateProcessorAndDiscCode(selectedRowNodes)
    }
  }
  /**
   * 
   */
  validateProcessorAndDiscCode(selectedRowNodes?) {
    if (this.assignForm.controls['processorName'].value === BLANK)
      this.processorErrorList.push(SELECT_PROCESSOR);
    if (this.rowData.length > ZERO && selectedRowNodes.length <= ZERO)
      this.processorErrorList.push(this.reconId !== THREE_CHAR ? SELECT_DISCREPANCY_TYPE:SELECT_TR_CODE);
  }

  /**
   * call assign discrepency service if all validations passes
   * @returns void
   */
  assign(): void {
    var selectedRowNodes = this.agGrid ? this.agGrid.api.getSelectedNodes() : [];
    this.errList = [];
    this.processorErrorList = [];
    this.errorMessage = BLANK;
    this.validateFileds(selectedRowNodes);
    this.errorFlag = FALSE;
    if (this.errList.length === ZERO && this.processorErrorList.length === ZERO && this.discpErrorMessage === BLANK) {
      let assignDto = new AssignDTO();
      assignDto.recon_Id = this.assignForm.controls['reconcilation'].value;
      assignDto.contract = this.assignForm.controls['contract'].value;
      assignDto.discp_Code = selectedRowNodes.map(data => { return data.data.discp_Code; })
      let quantity = this.assignForm.controls['quantity'].value;
      if (quantity == OTHER) {
        let other = this.assignForm.controls['other'].value;
        this.validateQuantity(other, selectedRowNodes);
        assignDto.assign_Count = parseInt(this.assignForm.controls['other'].value);
        assignDto.all_Flag = FALSE_STRING;
      }
      else if (quantity == ALL_SMALL) {
        assignDto.assign_Count = ZERO;
        assignDto.all_Flag = ALL_SMALL.toUpperCase();
      } else {
        this.validateQuantity(quantity, selectedRowNodes);
        assignDto.assign_Count = parseInt(this.assignForm.controls['quantity'].value);
        assignDto.all_Flag = FALSE_STRING;
      }
      assignDto.processor_Id = this.assignForm.controls['processorName'].value;
      assignDto.manager_Id = this.commonService.user_Id;
      if (this.errorMessage === BLANK) {
        this.loader = TRUE;
        this.subscription = this.commonService.assignDiscrepancy(assignDto).subscribe(res => {
          if (res.ok) {
            if (this.reconId === THREE_CHAR) {
              this.selectedTrcDate = this.assignForm.controls['trcDate'].value;              
            }
            this.onChangeContract();
            this.clearFormGroup();
            this.loader = FALSE;
            this.toastr.success(ASSIGNED_SUCCESSFULLY, BLANK, { timeOut: TWO_THOUSAND });
          }
        },
          err => {
            this.loader = FALSE;
            this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
          });
      }
    }
  }

  /**
   * clear form values and flags
   * @returns void
   */
  clearFormGroup(): void {
    this.errorMessage = BLANK;
    this.otherFlag = FALSE;
    this.errorFlag = FALSE;
    this.processorNameList = [];
    this.discpCodeList = [];
    this.assignForm.controls['quantity'].setValue(BLANK);
    this.assignForm.controls['other'].setValue(BLANK);

  }

  /**
   * check for quantity field validation
   * @param quantity 
   * @returns void
   */
  validateQuantity(quantity, selectedRowNodes?): void {
    this.errorMessage = BLANK;
    if (quantity === BLANK) {
      this.errorMessage = ENTER_QUANTITY;
      this.errorFlag = TRUE;
    } else if (parseInt(quantity) === ZERO) {
      this.errorMessage = ENTER_QUANTITY_INVALID;
      this.errorFlag = TRUE;
    } else if (selectedRowNodes.length > ZERO) {
      this.errorMessage = QUANTITY_LESS_THAN_UNASSIGNED;
      if (this.reconId === THREE_CHAR) {
        this.errorMessage = this.errorMessage + SPACE + TRANSACTION_REPLY_CODE + SPACE;
      }
      for (let index = 0; index < selectedRowNodes.length; index++) {
        let unassignCount = selectedRowNodes[index].data.unassigned_Count;
        if (parseInt(quantity) > unassignCount) {
          this.errorMessage += selectedRowNodes[index].data.discp_Code + COMMA + SPACE;
          this.errorFlag = TRUE;
        }
      }
      if (this.errorMessage.lastIndexOf(COMMA) != MINUS_ONE) {
        this.errorMessage = this.errorMessage.substring(ZERO, this.errorMessage.length - TWO)
      } else {
        this.errorMessage = BLANK;
      }
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

export class GridModel {
  discp_Code: string
  unassigned_Count: string
  assign_Count?: number
}