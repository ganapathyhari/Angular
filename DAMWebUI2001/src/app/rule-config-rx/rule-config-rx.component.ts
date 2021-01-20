import { Subscription } from '../../../node_modules/rxjs';
import { ToastrService } from 'ngx-toastr';
import { AgGridAngular } from 'ag-grid-angular';
import { IsColumnFuncParams } from '../../../node_modules/ag-grid-community/dist/lib/entities/colDef';
import { NgbModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../common.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PopupComponentComponent } from '../popup-component/popup-component.component';
import { addRuleRxDTO, updateRuleRxDTO } from 'src/model/ruleConfig';
import {
  SERVER_ERROR, BLANK, FALSE, TRUE, FULL_ROW, AG_TEXT_FILTER,
  DROPDOWN_VALUES, CONTRACT, RULE_NAME, RUN_INDICATOR, AG_CELL_EDITOR,
  RADIO, UPDATED_SUCCESSFULLY, INVALID_SELECT, HTTPERROR, DELETED_SUCCESSFULLY,
  SELECT, ADDED_SUCCESSFULLY, INVALID_COMBINATION, INVALID_DATA, UNDEFINED, NULL,
  RADIOBUTTON, TRUE_WORD, CHECKED, ONE, ZERO, TWO_THOUSAND, FIFTY,
  TWO_HUNDRED, CLIENT_ID, DISABLED, SELECT_AG_CELL_EDIT_INPUT, RULE_DESCRIPTION, THREE_HUNDRED_FIFTY, ONE_HUNDRED_NINETY, ONE_HUNDRED_FIFTY, AND_OR_DROPDOWN_VALUES, STATUS_DROPDOWN_VALUES, SYSTEM_DROPDOWN_VALUES, INVALID_COMBINATION_RX, ONE_HUNDRED_SIXTY, ONE_HUNDRED_EIGHTY, TWO_HUNDRED_TWENTY
} from 'src/common/constant';
import { getErrorMessage } from '../validator';

@Component({
  selector: 'app-rule-config-rx',
  templateUrl: './rule-config-rx.component.html',
  styleUrls: ['./rule-config-rx.component.scss']
})
export class RuleConfigRxComponent implements OnInit {
  @ViewChild('agGrid', { static: FALSE }) agGrid: AgGridAngular;
  systemValuesList = [];
  statusValuesList = [];
  rowData = [];
  ruleDefRowData = [];
  clientBool: boolean = TRUE;
  showGrid: boolean = FALSE;
  ruleConfigForm: FormGroup;
  radioCellRenderer: any;
  columnDefs = [];
  ruleDefColumnDefs = [];
  radioMap: Map<Number, boolean> = new Map();
  enableSave: boolean = FALSE;
  editType: string;
  errorMessage: string = BLANK;
  loader = FALSE;
  ruleConfigData: any = [];
  clientContractMap: Map<string, Array<string>> = new Map();
  clientRuleNameMap: Map<string, Array<string>> = new Map();
  RuleDescriptionMap: Map<string, Array<string>> = new Map();
  ruleSubscription = new Subscription;
  updateSubscription = new Subscription;
  deleteSubscription = new Subscription;
  addSubscription = new Subscription;
  disableAdd: boolean = FALSE;
  selectedData: any = NULL;
  // oldData: any = NULL;
  constructor(public commonService: CommonService, private toastr: ToastrService, private formBuilder: FormBuilder, private _modalService: NgbModal) {
    this.radioCellRenderer = function cellTitle(params) {
      let index = params.rowIndex
      let cellValue = '<div class="disc"><input id="' + index + '" name="radioButton" type="radio"></div>';
      return cellValue;
    };
  }

  /**
  * Do onLoad of page functionality.
  * @returns void
  */
  ngOnInit(): void {
    this.getSystemStatusValues();
    this.editType = FULL_ROW;
    this.getRuleConfig();
    this.assignColumnDefinition();
    //this.populateContractMap();

    this.showGrid = TRUE;
  }

  /**
   * define ag-grid column definition
   * @returns void
   */
  assignColumnDefinition(): void {
    this.columnDefs = [
      {
        headerName: BLANK, cellRenderer: this.radioCellRenderer, field: RADIO, width: FIFTY
      },
      {
        headerName: 'Tranasaction Reply Code', field: 'trcReplyCode', width: TWO_HUNDRED_TWENTY, editable: TRUE, sortable: TRUE, filter: AG_TEXT_FILTER,
      },
      {
        headerName: 'System', field: 'system', width: ONE_HUNDRED_SIXTY, editable: TRUE, cellEditor: AG_CELL_EDITOR, sortable: TRUE, filter: AG_TEXT_FILTER,
      },
      {
        headerName: 'Status', field: 'status', width: ONE_HUNDRED_SIXTY, editable: TRUE, cellEditor: AG_CELL_EDITOR, sortable: TRUE, filter: AG_TEXT_FILTER,
      }];
    this.ruleConfigForm = this.formBuilder.group({
      client: [BLANK]
    });
  }
  onGridReady() {
    this.agGrid.api.getColumnDef('system').cellEditorParams = {
      values: this.systemValuesList
    }
    this.agGrid.api.getColumnDef('status').cellEditorParams = {
      values: this.statusValuesList
    }
  }
  /** 
   * This method is called on change of a value in a client id dropdown.
   * It create rowdata for ag-grid to display.
   
   * @return void
  */
  getRuleConfigData(): void {
    let rowCont = [];
    this.ruleConfigData.forEach((details) => {
      let value = {
        'ruleId': details.rule_Id,
        'trcReplyCode': details.trcReplyCode,
        'system': details.system,
        'status': details.status,
        'old': TRUE
      }
      rowCont.push(value);
    });
    this.rowData = rowCont;
    this.rowData.forEach(element => {
      this.radioMap.set(element.ruleId, FALSE);
    });
    console.log(this.radioMap)
    this.showGrid = TRUE;
  }
  /**
  * get called when a row in ag-grid is selected.
  * If the event target value is radioButton then make the fields editable.
  * Depending on whether its an old or new record show update or save button.
  * @param event
  * @returns void
  */
  getSelectedRows(event): void {

    let selectedRowNodes = this.agGrid.api.getSelectedNodes();
    if (event.target.name == RADIOBUTTON) {
      //this.oldData = NULL;
      this.clearMap();
      this.radioMap.set(Number(selectedRowNodes[ZERO].data.ruleId), TRUE);
      this.agGrid.api.stopEditing();
      this.agGrid.api.startEditingCell({
        rowIndex: Number(selectedRowNodes[ZERO].rowIndex),
        colKey: 'trcReplyCode'
      });
      if (selectedRowNodes[ZERO].data.old) {
        this.enableSave = FALSE;
        //let oldData = selectedRowNodes[ZERO].data;
        //this.oldData = oldData;
        //console.log(this.oldData)
      } else {
        this.enableSave = TRUE;
      }
      this.disableSelect();
    }
  }

  /**
* get called when a row in ag-grid is selected and update button is clicked.
* Check few validations and then call the service to update the row if all validation passes.
* @returns void
*/
  update(): void {
    this.agGrid.api.stopEditing();
    this.errorMessage = BLANK;
    let selectedData;
    console.log(this.radioMap);
    this.radioMap.forEach((value, key) => {
      if (value == TRUE) {
        let rowData = this.getRowData()
        rowData.forEach(function (data) {
          if (data.ruleId === key) {
            selectedData = data;
          }
        });
      }
    });
    if (selectedData) {
      // if (this.selectedData === this.oldData) {
      //   this.errorMessage = "No Changes"
      // } else {
      this.validateRow(selectedData);
      // }
      if (this.errorMessage == BLANK) {
        let updateRuleConfig = new updateRuleRxDTO;
        updateRuleConfig.rule_Id = selectedData.ruleId;
        updateRuleConfig.trcReplyCode = selectedData.trcReplyCode;
        updateRuleConfig.system = selectedData.system;
        updateRuleConfig.status = selectedData.status;
        console.log(updateRuleConfig)
        this.updateSubscription = this.commonService.updateRuleConfigRx(updateRuleConfig).subscribe((res) => {
          if (res.ok) {
            this.getRuleConfig();
            let nodes: NodeListOf<HTMLInputElement> = document.getElementsByName(RADIOBUTTON) as NodeListOf<HTMLInputElement>;
            for (let i = ZERO; i < nodes.length; i++) {
              nodes[i].checked = FALSE;
            }
            this.clearMap();
            this.toastr.success(UPDATED_SUCCESSFULLY, BLANK, { timeOut: TWO_THOUSAND });
            this.getRuleConfig();
          }
        },
          err => {
            this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
          });
      } else {
        // console.log(this.ruleConfigData.filter(data => data.rule_Id === selectedData.ruleId)[0])
        let oldValue = this.ruleConfigData.filter(data => data.rule_Id === selectedData.ruleId)[0];
        selectedData.trcReplyCode = oldValue.trcReplyCode
        selectedData.system = oldValue.system
        selectedData.status = oldValue.status
        this.agGrid.api.updateRowData({ update: [selectedData] });
        // console.log(this.oldData)
        // this.agGrid.api.updateRowData({ update: [this.oldData] });
        // this.oldData = NULL;
        let selectedRowNodes = this.agGrid.api.getSelectedNodes();
        this.agGrid.api.startEditingCell({
          rowIndex: Number(selectedRowNodes[ZERO].rowIndex),
          colKey: 'trcReplyCode'
        });

      }
    }
    else {
      this.errorMessage = INVALID_SELECT
    }
  }

  /**
  * Clear radioMap which is used to find whether for a particular row index,the corresponding radio button is on/off.
  * @returns void
  */
  clearMap(): void {
    this.radioMap.forEach((value, key) => {
      if (value == TRUE) {
        this.radioMap.set(key, FALSE);
      }
    });
  }



  /**
* It is called when add button is clicked.
* It is used to add new row in ad-grid with each field is a dropdown with the corresponding values.
* It select the corresponding radio button.
* @returns void
*/
  onAddRow(): void {
    this.errorMessage = BLANK;
    var rowDataItem = this.createNewRowData();
    this.agGrid.api.updateRowData({ add: [rowDataItem] });
    this.clearMap();
    let rowCount = ZERO;
    this.agGrid.api.forEachNode(function (node) {
      rowCount++;
    })
    this.radioMap.set(0, TRUE);
    this.agGrid.api.stopEditing();
    this.agGrid.api.setFocusedCell(rowCount - ONE, 'trcReplyCode');
    this.agGrid.api.startEditingCell({
      rowIndex: rowCount - ONE,
      colKey: 'trcReplyCode'
    });
    let element = document.getElementById((rowCount - ONE).toString());
    if (element !== UNDEFINED && element !== NULL) {
      element.setAttribute(CHECKED, TRUE_WORD);
    }
    this.disableSelect();
    this.agGrid.api.refreshCells();
    this.enableSave = TRUE;
    this.disableAdd = TRUE;
  }
  getSystemStatusValues() {
    this.systemValuesList = SYSTEM_DROPDOWN_VALUES;
    this.statusValuesList = STATUS_DROPDOWN_VALUES;
  }

 
  /**
* It is called when save button is clicked.
* It is used to save a newly added row to the database by calling service
* if all validations passes
* @returns void
*/
  save(): void {
    this.agGrid.api.stopEditing();
    this.errorMessage = BLANK;
    let selectedData;
    let selectedKey = this.agGrid.api.getSelectedNodes()[0].rowIndex;
    let rowData = this.getRowData();
    this.radioMap.forEach((value, key) => {
      if (value == TRUE) {
        rowData.forEach(function (data) {
          if (data.old == FALSE) {
            selectedData = data;
          }
        });
      }
    });
    if (selectedData) {
      console.log(selectedData)
      this.validateRow(selectedData);
      if (this.errorMessage == BLANK) {
        let addRuleConfig = new addRuleRxDTO;
        addRuleConfig.trcReplyCode = selectedData.trcReplyCode;
        addRuleConfig.system = selectedData.system;
        addRuleConfig.status = selectedData.status;
        this.selectedData = selectedData;
        console.log(addRuleConfig);
        this.addSubscription = this.commonService.addRuleConfigRx(addRuleConfig).subscribe((res) => {
          if (res.ok) {
            this.enableSave = FALSE;
            this.agGrid.api.forEachNode(function (node) {
              node.data.old = TRUE;
            });
            let nodes: NodeListOf<HTMLInputElement> = document.getElementsByName(RADIOBUTTON) as NodeListOf<HTMLInputElement>;
            for (let index = ZERO; index < nodes.length; index++) {
              nodes[index].checked = FALSE;
            }
            this.clearMap();
            this.getRuleConfig();
            this.disableAdd = FALSE;
            this.toastr.success(ADDED_SUCCESSFULLY, BLANK, { timeOut: TWO_THOUSAND });
          }
        },
          err => {
            this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
          });
      } else {
        this.disableSelect();
        this.agGrid.api.setFocusedCell(selectedKey, 'trcReplyCode');
        this.agGrid.api.startEditingCell({
          rowIndex: selectedKey,
          colKey: 'trcReplyCode'
        });

      }
    }
    else {
      this.disableSelect();
      this.errorMessage = INVALID_SELECT;
    }
  }

  validateRow(selectedData) {
    if (selectedData.system === SELECT || selectedData.status === SELECT) {
      this.errorMessage = INVALID_DATA;
    } else {
      this.ruleConfigData.forEach((value) => {
        if (selectedData.trcReplyCode === value.trcReplyCode && selectedData.system === value.system) {
          console.log(selectedData)
          console.log(value)
          if (selectedData.ruleId === value.rule_Id) {
            this.errorMessage = "No Changes"
          } else
            this.errorMessage = INVALID_COMBINATION_RX;
        }
      });
    }
  }
  /**
* It is used to create a row with select values for each fields.
* @returns Object
*/
  createNewRowData() {
    let value = {
      'ruleId': ZERO,
      'trcReplyCode': BLANK,
      'system': SELECT,
      'status': SELECT,
      'old': FALSE
    }
    return value;
  }

  /**
*  It is called when delete button is clicked.
* It is used to delete the selected row by calling the service.
* It delete the row only if we select ok in the delete confirmation popup.
* @param event
* @returns void
*/

  onDeleteRow(event): void {
    let selected = FALSE;
    this.errorMessage = BLANK;
    this.radioMap.forEach((value, key) => {
      if (value == TRUE) {
        let modalRef = this._modalService.open(PopupComponentComponent);
        modalRef.componentInstance.closeModalEvent.subscribe((res) => {
          if (!res) {
            let rowData = this.getRowData();
            let selectedData;
            rowData.forEach(element => {
              if (this.radioMap.get(element.ruleId) && this.radioMap.get(element.ruleId) === TRUE) {
                selectedData = element;
              }
            })
            if (selectedData === UNDEFINED) {
              selectedData = this.agGrid.api.getSelectedNodes()[ZERO].data;
            }
            modalRef.close();
            let ruleId = selectedData.ruleId;
            if (ruleId !== ZERO) {
              this.deleteSubscription = this.commonService.deleteRuleConfigRx(Number(ruleId)).subscribe((res) => {
                this.agGrid.api.updateRowData({ remove: [selectedData] });
                this.radioMap.clear();
                let rowData = this.getRowData();
                rowData.forEach(element => {
                  this.radioMap.set(element.ruleId, FALSE);
                });
                this.getRuleConfig();
                this.toastr.success(DELETED_SUCCESSFULLY, BLANK, { timeOut: TWO_THOUSAND });
              },
                err => {
                  if (err.name === HTTPERROR)
                    this.toastr.error(SERVER_ERROR, BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
                  else
                    this.toastr.error(err.SERVER_ERROR, BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
                });

            }
            else {
              this.disableAdd = FALSE;
              this.agGrid.api.updateRowData({ remove: [selectedData] });
              this.radioMap.clear();
              let rowData = this.getRowData();
              rowData.forEach(element => {
                this.radioMap.set(element.ruleId, FALSE);
              });
            }
          }
        })
        selected = TRUE;
      }
    });
    if (!selected) {
      this.errorMessage = INVALID_SELECT;
    }
  }

  /**
*  It is used to get the rowData of ag-grid
* @returns rowData
*/
  getRowData() {
    let rowData = [];
    this.agGrid.api.forEachNode(function (node) {
      rowData.push(node.data);
    });
    return rowData;
  }

  /**
*  It is used the get the number of rows in ag-grid to set the index of newly added row.
* @returns count
*/
  getRowDataCount(): number {
    let rowData = this.getRowData();
    return rowData.length;
  }

  /**
*  This event is called internally by ag-grid when row values changes.
* This is used to update the rowData
* @param params of ag-grid
* @returns void
*/
  onCellValueChanged(params: any): void {
    // params.data.ruleDescription = this.RuleDescriptionMap.get(params.data.ruleName);
    this.agGrid.api.updateRowData({ update: [params.data], addIndex: params.rowIndex });
  }

  /**
* This is used to make the select value in each dropdown fields disabled.
* @returns void
*/
  disableSelect(): void {
    for (let index = ZERO; index < document.querySelectorAll(SELECT_AG_CELL_EDIT_INPUT).length; index++) {
      let element = document.querySelectorAll(SELECT_AG_CELL_EDIT_INPUT)[index][ZERO];
      if (element !== undefined) {
        element.setAttribute(DISABLED, TRUE_WORD);
      }
    }
  }

  /**
   * It is called by ngOninit method to populate the values in the client Id dropdown by calling the service
  * and to create the map which has the array of ruleName for each clientId.
  * @returns void
  */
  getRuleConfig(): void {
    // this.ruleConfigData = [{ rule_Id: 1, system: 'CMS Submission', trcReplyCode: '204', status: 'COMPLETE' },
    // { rule_Id: 2, system: 'CMS Submission', trcReplyCode: '15', status: '4RX NOT REQUIRED' },
    // { rule_Id: 3, system: 'TMG CORE', trcReplyCode: '204', status: 'COMPLETE' },
    // { rule_Id: 4, system: 'TMG CORE', trcReplyCode: '15', status: '4RX NOT REQUIRED' },
    // { rule_Id: 5, system: 'CMS Submission', trcReplyCode: '205', status: 'OPEN' },
    // { rule_Id: 6, system: 'TMG CORE', trcReplyCode: '205', status: 'OPEN' }
    // ]
    this.ruleSubscription = this.commonService.getRuleConfigRx().subscribe((res) => {
      this.ruleConfigData = res;
      if (this.selectedData !== NULL) {
        let ruleId = this.ruleConfigData.filter(data => data.trcReplyCode === this.selectedData.trcReplyCode
          && data.system === this.selectedData.system
          && data.status === this.selectedData.status)[ZERO].rule_Id;
        this.selectedData = NULL;
        this.agGrid.api.forEachNode(function (node) {
          if (node.data.ruleId == ZERO) {
            node.data.ruleId = ruleId;
            let input = this.radioMap.get(ZERO);
            if (input) {
              this.radioMap.delete(ZERO);
              this.radioMap.set(ruleId, input);
            }
          }
        });
      }
      this.getRuleConfigData();
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });
  }

  /**
  * This event is called internally by angular to do garbage collection.
  * This is used to clear the toaster and unsubcribe the subcription before leaving the page.
  * @returns void
  */
  ngOnDestroy(): void {
    this.toastr.clear();
    this.ruleSubscription.unsubscribe();
    this.updateSubscription.unsubscribe();
    this.addSubscription.unsubscribe();
    this.deleteSubscription.unsubscribe();
  }
}