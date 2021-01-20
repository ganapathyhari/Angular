import * as moment from 'moment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import {
  FALSE, BLANK, TRUE, DISCREPENCY_CODE, MULTIPLE, AG_TEXT_FILTER,
  STARTSWITH, ZERO, FOUR, SIX, HYPEN, TWO_THOUSAND, CLIENT, CONTRACT, SELECT_RECON_TYPE,
  SELECT_PROCESSOR, SELECT_DISCREPANCY_TYPE, UNASSIGNED_SUCCESSFULLY, QUANTITY_ERROR_MESSAGE,
  ENTER_QUANTITY_ERROR_MESSAGE, VALID_QUANTITY_ERROR_MESSAGE, PATTERN, TRANSACTION_REPLY_CODE, THREE_CHAR, TOTAL_UNASSIGNED, TOTAL_PENDING, PROCESSOR_QUEUED, QUANTITY, TEN, FIVE, SEVEN, EIGHT, HYPEN_REPLACEALL
} from 'src/common/constant';
import { CommonService } from '../common.service';
import { ToastrService } from 'ngx-toastr';
import { getErrorMessage, filterList, onlyNumbers } from '../validator';
import { Subscription } from 'rxjs';
import { ProcAssignDTO } from 'src/model/procListColumn';

@Component({
  selector: 'app-processor-management',
  templateUrl: './processor-management.component.html',
  styleUrls: ['./processor-management.component.scss']
})
export class ProcessorManagementComponent implements OnInit {
  @ViewChild('agGrid', { static: FALSE }) agGrid: AgGridAngular;
  processorMgmtForm: FormGroup;
  trcBool: boolean = TRUE;
  reconType: any = [];
  errList: any = [];
  reportMonthList: any = [];
  processorNameList: any = [];
  loader: boolean = FALSE;
  rowData: GridModel[] = [];
  unAssignDataArr: any = [];
  discpProcDetailsList: any = [];
  discp4RxDetailsList: any = [];
  processorBool: boolean = TRUE;
  processorErrorList: any = [];
  errorMessage: string = BLANK;
  errorFlag: boolean = FALSE;
  subscription: Subscription = new Subscription();
  rowSelection = MULTIPLE;
  variableHeight = 100;
  columnDefs = [];
  reconId: any;
  trcDateList: any;
  selectedTrcDate: string = BLANK;

  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.createForm();
    this.getReconType();
  }
  /**
  * Called on ngOnInit
  * To initialize Formgroup and Formcontrols.
  * @returns void
  */
  createForm(): void {
    this.processorMgmtForm = this.formBuilder.group({
      reconcilation: [BLANK],
      reportMonth: [BLANK],
      processorName: [BLANK],
      trcDate: [BLANK]
    });
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

  keyPress(event): void {
    if (!onlyNumbers(event.event)) {
      let string = event.event.target.value;
      if (string && string.length > 0) {
        event.event.target.value = string.substring(0, string.length - 1);
      }
    }

    this.agGrid.api.forEachNodeAfterFilterAndSort((element, index) => {
      if (event.rowIndex === index) {
        element.data.quantity = event.event.target.value;
        this.agGrid.api.updateRowData({ update: [element.data] });
      }
    });
  }
  /**
  *  This event is called internally by ag-grid when row values changes.
  * This is used to update the rowData
  * @param params of ag-grid
  * @returns void
  */
  onCellValueChanged(params: any): void {
    this.agGrid.api.updateRowData({ update: [params.data], addIndex: params.rowIndex });
  }

  /**
    * get called when a row in ag-grid is selected.
    * @param event
    * @returns void
    */
  getSelectedRows(event): void {
    this.agGrid.api.forEachNodeAfterFilterAndSort((element) => {
      if (!element.isSelected()) {
        element.data.quantity = BLANK;
        this.agGrid.api.updateRowData({ update: [element.data] });
      }
    });

    let selectedRowNodes = this.agGrid.api.getSelectedNodes();
    selectedRowNodes.forEach((element) => {
      if (event.data.client_id === element.data.client_id &&
        event.data.contract_id === element.data.contract_id &&
        event.data.discp_code === element.data.discp_code
      ) {

        this.agGrid.api.setFocusedCell(
          Number(event.rowIndex),
          'quantity'
        );
        this.agGrid.api.startEditingCell({
          rowIndex: Number(event.rowIndex),
          colKey: 'quantity'
        });
      }
    });

  }

  click(event): void {
    let selectedRowNodes = this.agGrid.api.getSelectedNodes();
    selectedRowNodes.forEach((element) => {
      if (event.data.client_id === element.data.client_id &&
        event.data.contract_id === element.data.contract_id &&
        event.data.discp_code === element.data.discp_code
      )
        this.agGrid.api.startEditingCell({
          rowIndex: Number(event.rowIndex),
          colKey: 'quantity'
        });
    });
  }

  /**
     * on change of recon type,clear and enable client and contract
     * @returns void
     */
  disableClientContr(): void {
    this.reconId = this.processorMgmtForm.controls['reconcilation'].value;
    this.resetFields();
    this.setColumnName();
    this.unAssignDataArr = [];
    this.processorNameList = [];
    this.trcDateList = [];
    this.processorMgmtForm.controls['processorName'].setValue(BLANK);
    this.processorMgmtForm.controls['trcDate'].setValue(BLANK);
    this.processorBool = TRUE;
    this.trcBool = TRUE;
    this.getUnassignDetail();
  }

  setColumnName() {
    this.columnDefs = [];
    let reconId = this.processorMgmtForm.controls['reconcilation'].value;
    if (reconId === THREE_CHAR) {
      this.columnDefs = [{ checkboxSelection: true, headerName: BLANK, field: 'selected', width: 38 },
      {
        headerName: CLIENT, field: 'client_id', width: 85,
        sortable: TRUE, filter: AG_TEXT_FILTER,
        filterParams: { defaultOption: STARTSWITH }
      },
      {
        headerName: CONTRACT, field: 'contract_id', width: 97,
        sortable: TRUE, filter: AG_TEXT_FILTER,
        filterParams: { defaultOption: STARTSWITH }
      },
      {
        headerName: TRANSACTION_REPLY_CODE, field: 'discp_code', width: 127,
        sortable: TRUE, filter: AG_TEXT_FILTER,
        filterParams: { defaultOption: STARTSWITH }
      },
      {
        headerName: TOTAL_UNASSIGNED, field: 'tot_unassign', width: 112,
        sortable: TRUE, filter: AG_TEXT_FILTER,
        filterParams: { defaultOption: STARTSWITH }
      },
      {
        headerName: TOTAL_PENDING, field: 'tot_pend_work', width: 87,
        sortable: TRUE, filter: AG_TEXT_FILTER,
        filterParams: { defaultOption: STARTSWITH }
      },
      {
        headerName: PROCESSOR_QUEUED, field: 'proc_pend', width: 108,
        sortable: TRUE, filter: AG_TEXT_FILTER,
        filterParams: { defaultOption: STARTSWITH }
      },
      {
        headerName: QUANTITY, field: 'quantity', width: 86, editable: TRUE,
        cellEditor: 'agTextCellEditor'
      },
      {
        field: 'assign_to', hide: true
      }];
    } else {
      this.columnDefs = [{ checkboxSelection: true, headerName: BLANK, field: 'selected', width: 38 },
      {
        headerName: CLIENT, field: 'client_id', width: 85,
        sortable: TRUE, filter: AG_TEXT_FILTER,
        filterParams: { defaultOption: STARTSWITH }
      },
      {
        headerName: CONTRACT, field: 'contract_id', width: 97,
        sortable: TRUE, filter: AG_TEXT_FILTER,
        filterParams: { defaultOption: STARTSWITH }
      },
      {
        headerName: DISCREPENCY_CODE, field: 'discp_code', width: 127,
        sortable: TRUE, filter: AG_TEXT_FILTER,
        filterParams: { defaultOption: STARTSWITH }
      },
      {
        headerName: 'Total Unassigned', field: 'tot_unassign', width: 112,
        sortable: TRUE, filter: AG_TEXT_FILTER,
        filterParams: { defaultOption: STARTSWITH }
      },
      {
        headerName: 'Total Pending', field: 'tot_pend_work', width: 87,
        sortable: TRUE, filter: AG_TEXT_FILTER,
        filterParams: { defaultOption: STARTSWITH }
      },
      {
        headerName: 'Processor Queued', field: 'proc_pend', width: 108,
        sortable: TRUE, filter: AG_TEXT_FILTER,
        filterParams: { defaultOption: STARTSWITH }
      },
      {
        headerName: 'Quantity', field: 'quantity', width: 86, editable: TRUE,
        cellEditor: 'agTextCellEditor'
      },
      {
        field: 'assign_to', hide: true
      }];
    }
  }

  /**
   * call service to get client and contract based on the recon type selected
   * @returns void
   */
  getUnassignDetail(): void {
    let reconId = this.processorMgmtForm.controls['reconcilation'].value;
    if (reconId !== BLANK) {
      this.unAssignDataArr = [];
      this.subscription = this.commonService.getUnassignDetail(reconId).subscribe(res => {
        this.rowData = [];
        this.processorBool = FALSE;
        this.unAssignDataArr = res;
        res.forEach((element) => {
          this.processorNameList.push(element.assign_name);
        });
        this.processorNameList = filterList(this.processorNameList);
        if (this.reconId !== THREE_CHAR)
          this.getReportMonthValue();
        else
          this.getTrcDateList();
      },
        err => {
          this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
        });
    }
  }

  getTrcDateList(): void {
    this.processorMgmtForm.controls['trcDate'].setValue(BLANK);
    this.trcBool = FALSE;
    this.discp4RxDetailsList = [];
    this.trcDateList = [];
    let processorName = this.processorMgmtForm.controls['processorName'].value;
    if (processorName !== BLANK) {
      this.discpProcDetailsList = this.unAssignDataArr.filter(data => data.assign_name === processorName)
      this.discpProcDetailsList.forEach(details => {
        this.trcDateList.push(details.trc_Received_Date.substring(ZERO, FOUR) + HYPEN + details.trc_Received_Date.substring(FOUR, SIX) + HYPEN + details.trc_Received_Date.substring(SIX, EIGHT));
      });
      this.trcDateList = filterList(this.trcDateList);
      this.filterDiscrepancy();
    }

  }

  filterDiscrepancy() {
    let trcList = this.trcDateList.filter(data => data === this.selectedTrcDate)
    if (this.selectedTrcDate !== BLANK && trcList.length !== ZERO) {
      this.processorMgmtForm.controls['trcDate'].setValue(this.selectedTrcDate);
    }
    this.selectedTrcDate = BLANK;
    let trcDate = this.processorMgmtForm.controls['trcDate'].value;
    this.discp4RxDetailsList = this.discpProcDetailsList.filter(data => data.trc_Received_Date.substring(ZERO, EIGHT) === trcDate.replace(HYPEN_REPLACEALL, BLANK));
    this.rowData = this.discp4RxDetailsList;
    this.variableHeight = this.rowData.length === 0 ? 100 : (this.rowData.length + 1) * 39.5;
  }

  /**
  * This method is called on ngOnInit.
  * This is used to get the values for global reportmonth dropdown.
  * @returns void
  */
  getReportMonthValue(): void {
    this.reportMonthList = [];
    let processorName = this.processorMgmtForm.controls['processorName'].value;
    if (processorName !== BLANK) {
      let reportMonthList = this.unAssignDataArr.filter(data => data.assign_name === processorName)
      this.rowData = reportMonthList;
      this.variableHeight = this.rowData.length === 0 ? 100 : (this.rowData.length + 1) * 39.5;
      reportMonthList.forEach(details => {
        this.reportMonthList.push(details.report_mon);
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
        this.processorMgmtForm.controls['reportMonth'].setValue(latestReportMonth.substring(ZERO, FOUR) + HYPEN + latestReportMonth.substring(FOUR, SIX));
      }
    } else {
      this.processorMgmtForm.controls['reportMonth'].setValue(BLANK);
    }
  }

  /**
   * called on change of processor,get discrepency details,latest report month value based on processor selected
   * @returns void
   */
  onChangeProcessor(): void {
    this.resetFields();
    if (this.reconId !== THREE_CHAR)
      this.getReportMonthValue();
    else
      this.getTrcDateList();
  }


  /**
   * Reset form values and flags
   * @returns void
   */
  resetFields(): void {
    this.errorFlag = FALSE;
    this.errorMessage = BLANK;
    this.errList = [];
    this.rowData = [];
    this.processorErrorList = [];
    this.processorMgmtForm.controls['reportMonth'].setValue(BLANK);
    this.processorMgmtForm.controls['trcDate'].setValue(BLANK);
  }
  /**
   * call unassign discrepency service if all validations passes
   * @returns void
   */
  assign(indicator: string) {
    let procAssignDTO: ProcAssignDTO[] = [];
    var selectedRowNodes = this.agGrid ? this.agGrid.api.getSelectedNodes() : [];
    this.errList = [];
    this.processorErrorList = [];
    this.errorMessage = BLANK;
    this.errorFlag = FALSE;
    this.validateFileds(selectedRowNodes);
    if (this.errList.length === ZERO && this.processorErrorList.length === ZERO) {
      selectedRowNodes.forEach(detail => {
        let assignDto = new ProcAssignDTO();
        assignDto.recon_id = this.processorMgmtForm.controls['reconcilation'].value;
        assignDto.contract = detail.data.contract_id;
        assignDto.discp_Code = detail.data.discp_code
        let reportMonth = this.reconId !== THREE_CHAR ? this.processorMgmtForm.controls['reportMonth'].value : this.processorMgmtForm.controls['trcDate'].value;
        assignDto.report_mon = reportMonth.replace(HYPEN_REPLACEALL, BLANK);
        if ((detail.data.quantity === undefined || detail.data.quantity === BLANK) && !this.errorFlag) {
          this.errorMessage = ENTER_QUANTITY_ERROR_MESSAGE
          this.errorFlag = TRUE;
        }
        else if ((Number(detail.data.quantity) === 0 || !PATTERN.test(detail.data.quantity)) && !this.errorFlag) {
          this.errorMessage = VALID_QUANTITY_ERROR_MESSAGE
          this.errorFlag = TRUE;
        }
        else if (detail.data.quantity > detail.data.proc_pend && !this.errorFlag) {
          this.errorMessage = QUANTITY_ERROR_MESSAGE;
          this.errorFlag = TRUE;
        }
        assignDto.assign_cnt = detail.data.quantity;
        assignDto.processor_id = detail.data.assign_to;
        assignDto.manager_id = this.commonService.user_Id;
        assignDto.assign_ind = indicator;
        procAssignDTO.push(assignDto)

      });

      if (this.errorMessage === BLANK) {
        this.loader = TRUE;
        this.subscription = this.commonService.unAssignDiscrepancy(procAssignDTO).subscribe(res => {
          if (res.ok) {
            if (this.reconId === THREE_CHAR) {
              this.selectedTrcDate = this.processorMgmtForm.controls['trcDate'].value;
            }
            this.getUnassignDetail();
            this.agGrid.api.refreshCells();
            this.loader = FALSE;
            this.toastr.success(UNASSIGNED_SUCCESSFULLY, BLANK, { timeOut: TWO_THOUSAND });
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
   * Validate mandatory fields
   * @returns void
   */
  validateFileds(selectedRowNodes?): void {
    if (this.processorMgmtForm.controls['reconcilation'].value === BLANK)
      this.errList.push(SELECT_RECON_TYPE);
    else if (this.processorMgmtForm.controls['processorName'].value === BLANK)
      this.errList.push(SELECT_PROCESSOR);
    else {
      this.validateProcessorAndDiscCode(selectedRowNodes)
    }
  }
  /**
   * Validate Discrepancy selected
   * @returns void
   */
  validateProcessorAndDiscCode(selectedRowNodes?) {
    if (this.rowData.length > ZERO && selectedRowNodes.length <= ZERO)
      this.processorErrorList.push(SELECT_DISCREPANCY_TYPE);
  }
}

export class GridModel {
  discp_code: string
  client_id: string
  contract_id: string
  tot_unassign?: any
  tot_pend_work?: any
  proc_pend: any
  quantity?: any
  assign_to?: any
}