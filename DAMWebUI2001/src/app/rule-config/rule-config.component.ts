import { Subscription } from '../../../node_modules/rxjs';
import { ToastrService } from 'ngx-toastr';
import { AgGridAngular } from 'ag-grid-angular';
import { IsColumnFuncParams } from '../../../node_modules/ag-grid-community/dist/lib/entities/colDef';
import { NgbModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../common.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PopupComponentComponent } from '../popup-component/popup-component.component';
import { addRuleDTO, updateRuleDTO } from 'src/model/ruleConfig';
import {
  SERVER_ERROR, BLANK, FALSE, TRUE, FULL_ROW, AG_TEXT_FILTER,
  DROPDOWN_VALUES, CONTRACT, RULE_NAME, RUN_INDICATOR, AG_CELL_EDITOR,
  RADIO, UPDATED_SUCCESSFULLY, INVALID_SELECT, HTTPERROR, DELETED_SUCCESSFULLY,
  SELECT, ADDED_SUCCESSFULLY, INVALID_COMBINATION, INVALID_DATA, UNDEFINED, NULL,
  RADIOBUTTON, TRUE_WORD, CHECKED, ONE, ZERO, TWO_THOUSAND, FIFTY, 
  TWO_HUNDRED,CLIENT_ID, DISABLED, SELECT_AG_CELL_EDIT_INPUT, RULE_DESCRIPTION, THREE_HUNDRED_FIFTY, ONE_HUNDRED_FIFTY, ONE_CHAR, TWO_CHAR
} from 'src/common/constant';
import { getErrorMessage, setReconVal } from '../validator';

@Component({
  selector: 'app-rule-config',
  templateUrl: './rule-config.component.html',
  styleUrls: ['./rule-config.component.scss']
})
export class RuleConfigComponent implements OnInit {
  @ViewChild('agGrid', { static: FALSE }) agGrid: AgGridAngular;
  clientList = [];
  rowData = [];
  ruleDefRowData = [];
  clientBool: boolean = TRUE;
  showGrid: boolean = FALSE;
  contractList: any;
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
  selectedClient = BLANK;
  clientContractMap: Map<string, Array<string>> = new Map();
  clientRuleNameMap: Map<string, Array<string>> = new Map();
  RuleDescriptionMap: Map<string, Array<string>> = new Map();
  ruleSubscription = new Subscription;
  updateSubscription = new Subscription;
  deleteSubscription = new Subscription;
  discloadSubscription = new Subscription;
  addSubscription = new Subscription;
  disableAdd: boolean = FALSE;
  selectedData: any = NULL;
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
    setReconVal();
    this.editType = FULL_ROW;
    this.getRuleConfig();
    this.assignColumnDefinition();
    this.populateContractMap();
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
        headerName: CONTRACT, field: 'contract', width: ONE_HUNDRED_FIFTY, editable: function cellTitle(params: IsColumnFuncParams) {
          return !params.data.old;
        }, sortable: TRUE, filter: AG_TEXT_FILTER,
      },
      {
        headerName: RULE_NAME, field: 'ruleName', width: TWO_HUNDRED, editable: function cellTitle(params: IsColumnFuncParams) {
          return !params.data.old;
        }, sortable: TRUE, filter: AG_TEXT_FILTER,
      },
      {
        headerName: RUN_INDICATOR, field: 'runIndicator', width: ONE_HUNDRED_FIFTY, editable: TRUE, cellEditor: AG_CELL_EDITOR, cellEditorParams: {
          values: DROPDOWN_VALUES
        }, sortable: TRUE, filter: AG_TEXT_FILTER,
      },
       {
        headerName: RULE_DESCRIPTION, field: 'ruleDescription', width: THREE_HUNDRED_FIFTY, editable: FALSE, sortable: TRUE, filter: AG_TEXT_FILTER
      },];
    this.ruleConfigForm = this.formBuilder.group({
      client: [BLANK]
    });
  }

  /** 
   * This method is called on change of a value in a client id dropdown.
   * It create rowdata for ag-grid to display.
   * @param event
   * @return void
  */
  getContractVal(event): void {
    this.selectedClient = event.target.value;
    if (this.selectedClient !== BLANK) {
      this.contractList = this.ruleConfigData.filter(data => data.client === this.selectedClient);
      let rowCont = [];
      this.contractList.forEach((details) => {
        let value = {
          'ruleId': details.rule_Config_Id,
          'contract': details.contract,
          'runIndicator': details.run_Ind,
          'ruleName': details.rule_Name,
          'ruleDescription':  this.RuleDescriptionMap.get(details.rule_Name),
          'old': TRUE
        }
        rowCont.push(value);
      });
      this.rowData = rowCont;
      this.rowData.forEach(element => {
          this.radioMap.set(element.ruleId, FALSE);
      });
      this.showGrid = TRUE;
    }
    else {
      this.showGrid = FALSE;
    }
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
      this.clearMap();
      this.radioMap.set(Number(selectedRowNodes[ZERO].data.ruleId), TRUE);
      this.agGrid.api.stopEditing();
      this.agGrid.api.startEditingCell({
        rowIndex: Number(selectedRowNodes[ZERO].rowIndex),
        colKey: 'runIndicator'
      });
      if (selectedRowNodes[ZERO].data.old) {
        this.enableSave = FALSE;
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
      if (selectedData.runIndicator == SELECT) {
        this.errorMessage = INVALID_SELECT;
      } else {
        let updateRuleConfig = new updateRuleDTO;
        updateRuleConfig.run_Ind = selectedData.runIndicator;
        updateRuleConfig.rule_Config_Id = selectedData.ruleId;
        this.updateSubscription = this.commonService.updateRuleConfig(updateRuleConfig).subscribe((res) => {
          if (res.ok) {
            this.getRuleConfig();
            let nodes: NodeListOf<HTMLInputElement> = document.getElementsByName(RADIOBUTTON) as NodeListOf<HTMLInputElement>;
            for (let i = ZERO; i < nodes.length; i++) {
              nodes[i].checked = FALSE;
            }
            this.clearMap();
            this.toastr.success(UPDATED_SUCCESSFULLY, BLANK, { timeOut: TWO_THOUSAND });
          }
        },
          err => {
            this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
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
* Add the cellEditor type and its params for the contract and ruleName fields.
* @returns void
*/
  editableMode(): void {
    let clientId = this.ruleConfigForm.controls['client'].value;
    if (this.clientContractMap.get(clientId) === undefined) {
      this.clientContractMap.set(clientId, [SELECT]);
    }
    if (this.clientRuleNameMap.get(clientId) === undefined) {
      this.clientRuleNameMap.set(clientId, [SELECT]);
    }
    this.agGrid.api.getColumnDef('contract').cellEditor = AG_CELL_EDITOR;
    this.agGrid.api.getColumnDef('contract').cellEditorParams = {
      values: this.clientContractMap.get(clientId)
    }
    this.agGrid.api.getColumnDef('ruleName').cellEditor = AG_CELL_EDITOR;
    this.agGrid.api.getColumnDef('ruleName').cellEditorParams = {
      values: this.clientRuleNameMap.get(clientId)
    }

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
    this.editableMode();
    this.clearMap();
    let rowCount = ZERO;
    this.agGrid.api.forEachNode(function (node) {
      rowCount++;
    })
    this.radioMap.set(0, TRUE);
    this.agGrid.api.stopEditing();
    this.agGrid.api.setFocusedCell(rowCount - ONE, 'contract');
    this.agGrid.api.startEditingCell({
      rowIndex: rowCount - ONE,
      colKey: 'contract'
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

  /**
* It is called when On load of the ruleConfig screen.
* It create a map which has the array of contract for particular client.
* @returns void
*/
  populateContractMap(): void {
    this.discloadSubscription = this.commonService.getClientDefinition().subscribe(res => {
      if (res.length > ZERO) {
        let clientList = this.filterListOfClient(res, CLIENT_ID);
        for (let index = ZERO; index < clientList.length; index++) {
          let list = res.filter(data => data.client_Id === clientList[index]);
          let contractList = [SELECT];
          list.forEach((element) => {
            contractList.push(element.contract_Id);
          });
          this.clientContractMap.set(clientList[index], contractList);
        }
      }
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });
    this.updateSubscription = this.commonService.getRuleMaster().subscribe((res) => {
      if (res.length > ZERO) {
        let clientList = this.filterListOfClient(res, CLIENT_ID);
        for (let index = ZERO; index < clientList.length; index++) {
          let list = res.filter(data => data.client_Id === clientList[index]);
          let ruleNameList = [SELECT];
          list.forEach((element) => {
            ruleNameList.push(element.rule_Name);
            this.RuleDescriptionMap.set(element.rule_Name,element.rule_Description);
          });
          this.clientRuleNameMap.set(clientList[index], ruleNameList);
        }
      }
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });
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
    let selectedKey=this.agGrid.api.getSelectedNodes()[0].rowIndex;
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
      if (selectedData.contract === SELECT || selectedData.ruleName === SELECT || selectedData.runIndicator === SELECT) {
        this.errorMessage = INVALID_DATA;
      } else {
        let latestData = this.ruleConfigData.filter(data => data.client === this.selectedClient);
        latestData.forEach((value) => {
          if (selectedData.contract == value.contract && selectedData.ruleName == value.rule_Name) {
            this.errorMessage = INVALID_COMBINATION
          }
        });
      }
      if (this.errorMessage == BLANK) {
        let addRuleConfig = new addRuleDTO;
        addRuleConfig.client = this.selectedClient;
        addRuleConfig.rule_Name = selectedData.ruleName;
        addRuleConfig.run_Ind = selectedData.runIndicator;
        addRuleConfig.contract = selectedData.contract;
        this.selectedData = selectedData;
        this.addSubscription = this.commonService.addRuleConfig(addRuleConfig).subscribe((res) => {
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
            this.contractList = this.ruleConfigData.filter(data => data.client === this.selectedClient);
            this.toastr.success(ADDED_SUCCESSFULLY, BLANK, { timeOut: TWO_THOUSAND });
          }
        },
          err => {
            this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
          });
      } else {
        this.disableSelect();
        this.agGrid.api.setFocusedCell(selectedKey, 'contract');
        this.agGrid.api.startEditingCell({
          rowIndex: selectedKey,
          colKey: 'contract'
        });

      }
    }
    else {
      this.disableSelect();
      this.errorMessage = INVALID_SELECT;
    }
  }

  /**
* It is used to create a row with select values for each fields.
* @returns Object
*/
  createNewRowData() {

    let value = {
      'ruleId': ZERO,
      'contract': SELECT,
      'runIndicator': SELECT,
      'ruleName': SELECT,
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
            let rowData=this.getRowData();
            let selectedData;
            rowData.forEach(element=>{
              if(this.radioMap.get(element.ruleId) && this.radioMap.get(element.ruleId)===TRUE){
                selectedData = element;
              }
            })
            if(selectedData===UNDEFINED){
              selectedData = this.agGrid.api.getSelectedNodes()[ZERO].data;
            }
            modalRef.close();
            let ruleId = selectedData.ruleId;
            if (ruleId !== ZERO) {
              this.deleteSubscription = this.commonService.deleteRuleConfig(Number(ruleId)).subscribe((res) => {
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
    params.data.ruleDescription=this.RuleDescriptionMap.get(params.data.ruleName);
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
    this.ruleSubscription = this.commonService.getRuleConfig().subscribe((res) => {
      this.ruleConfigData = res;
      this.clientList = this.filterListOfClient(res, 'client');
      if (this.selectedClient !== BLANK && this.selectedData !== NULL) {
        this.contractList = this.ruleConfigData.filter(data => data.client === this.selectedClient);
        let ruleId = this.contractList.filter(data => data.contract === this.selectedData.contract && data.rule_Name === this.selectedData.ruleName)[ZERO].rule_Config_Id;
        this.selectedData = NULL;
        this.agGrid.api.forEachNode(function (node) {
          if (node.data.ruleId == ZERO) {
            node.data.ruleId = ruleId;
            let input= this.radioMap.get(ZERO);
            if(input){
            this.radioMap.delete(ZERO);
            this.radioMap.set(ruleId,input);
            }
          }
        });
        
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
    this.discloadSubscription.unsubscribe();
  }
}