import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment'
import { AssignDTO, UnassignDTO, ProcAssignDTO } from 'src/model/procListColumn';
import { ProcDetailDTO } from 'src/model/procDetail';
import { addRuleDTO, updateRuleDTO, addRuleRxDTO, updateRuleRxDTO } from 'src/model/ruleConfig';
import { AddUserDTO, UpdateUserDTO } from 'src/model/adminUser';
import {
  GET_JOB_STATUS_LOG, GET_USER_ASSIGNED_DISCREPANCIES, PROC_LIST, GET_RECON_TYPE,
  DISP_ASSIGN, CLIENT_DEFINITION_DATA, PROCESSOR_DATA, GET_UNASSIGNED_DISP_DATA, PROC_DETAIL,
  DISCREPANCY_DETAILS, DISP_UPDATE, ASSIGN_DISCREPANCY, DASHBOARD, GET_DASHBOARD,
  MANAGER_DASHBOARD, GET_ALL_DASHBOARD, GET_DISP_SUM, ADMIN, GET_USER_DETAIL_DASHBOARD,
  POST_USER_DETAIL, PUT_USER_DETAIL, GET_ROLE_BASED_ACCESS, GET_INPUT_FILE_PATH, GET_USER_DETAIL,
  UPLOAD_FILE, REPORT_MONTH_CONDITION, USER_ID_CONDITION, IMPORT_FLAG, EXPORT_RECON,
  CONTRACT_ID_CONDITION, EXPORT_FLAG, RULE_CONFIG, GET_RULE_CONFIG, PUT_RULE_CONFIG,
  POST_RULE_CONFIG, GET_MEMBER_SEARCH, GET_DISC_RESOLUTION, GET_UNDISC_RESOLUTION,
  GET_PROC_RESOLUTION, GET_ANALYST_DATA, CLIENT_DEFINITION, DELETE_RULE_CONFIG,
  GET_RULE_MASTER, GET_BEQ_DATA, END_DATA_CONDITION, ANALYST_CLIENT_DEFINITION, CLIENT_ID_CONDITION,
  FLAG_CONDITION, CONDITION_USER_ID, RUN_SSIS, GET_ACTION_REASON_STATUS_INFO, DISP_UNASSIGN, UNASSIGN_DISCREPANCY, MEM_SEARCH_CLIENT_DEFINITION, PROC_GET_UNASSIGN_DISCREPANCY, PROC_ASSIGN_DISCREPANCY, RX, GET_RECON_TYPE_DSH, RULE_CONFIG_RX
} from 'src/common/url-constant';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  user_Id: string = '';
  user_Name: string = '';
  user_Role: string = '';
  reconId: string = '';
  reconVal: string = '1';
  reportMonthList: any = [];
  fileLoad: boolean = false;
  isExecuteBatch: boolean = false;
  isExport: boolean = false;
  roleAccess: EventEmitter<boolean> = new EventEmitter();
  actionReasonStatusInfo: any;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  }
  constructor(private http: HttpClient) { }

  configUrl = environment.configUrl;

  getJobStatusLog() {
    let jobStsUrl = this.configUrl + GET_JOB_STATUS_LOG;
    return this.http.get<any>(jobStsUrl);
  }

  getRecon(reconId: string) {
    let reconUrl = this.configUrl + PROC_LIST + GET_USER_ASSIGNED_DISCREPANCIES + reconId + "/" + this.user_Id;
    return this.http.get<any>(reconUrl);
  }

  getReconTypeVal() {
    let reconTypeUrl = this.configUrl + GET_RECON_TYPE;
    return this.http.get<any>(reconTypeUrl);
  }
  getReconTypeValDsh() {
    let reconTypeUrl = this.configUrl + GET_RECON_TYPE_DSH;
    return this.http.get<any>(reconTypeUrl);
  }
  getClientContractVal(reconId: string) {
    let clientContractUrl = this.configUrl + DISP_ASSIGN + CLIENT_DEFINITION_DATA + reconId;
    return this.http.get<any>(clientContractUrl);
  }
  getProcessorDetails(reconId: string, contractId: string) {
    let processorUrl = this.configUrl + DISP_ASSIGN + PROCESSOR_DATA + reconId + '/' + contractId;
    return this.http.get<any>(processorUrl);
  }

  getDiscrepancyDetails(reconId: string, contractId: string) {
    let discpUrl = this.configUrl + DISP_ASSIGN + GET_UNASSIGNED_DISP_DATA + reconId + '/' + contractId;
    return this.http.get<any>(discpUrl);
  }

  getProcDetailDiscpData(reconId: string, discpId: string) {
    let processorUrl = this.configUrl + PROC_DETAIL + DISCREPANCY_DETAILS + reconId + '/' + discpId;
    return this.http.get<any>(processorUrl);
  }

  putProcDetailDiscpData(procDetailDTO: ProcDetailDTO) {
    let processorUrl = this.configUrl + PROC_DETAIL + DISP_UPDATE;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    const body = JSON.stringify(procDetailDTO);
    return this.http.put<AssignDTO>(processorUrl, body,
      {
        headers: httpOptions.headers,
        observe: 'response'
      }
    );
  }
  assignDiscrepancy(assignDTO: AssignDTO) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    }
    const body = JSON.stringify(assignDTO);
    let url = this.configUrl + ASSIGN_DISCREPANCY;
    return this.http.put<AssignDTO>(url, body,
      {
        headers: httpOptions.headers,
        observe: 'response'
      }
    );
  }

  getUserDetail() {
    let recon = this.configUrl + GET_USER_DETAIL;
    return this.http.get<any>(recon);
  }

  getDashboard() {
    let dashboardUrl = '';
    if (this.user_Role === 'PROCESSOR') {
      dashboardUrl = this.configUrl + DASHBOARD + GET_DASHBOARD + this.user_Id;
    }
    if (this.user_Role === 'MANAGER' || this.user_Role === 'ANALYST') {
      dashboardUrl = this.configUrl + DASHBOARD + MANAGER_DASHBOARD;
    }
    return this.http.get<any>(dashboardUrl);
  }

  getDiscTrend() {
    let dashboardUrl = this.configUrl + DASHBOARD + GET_ALL_DASHBOARD;
    return this.http.get<any>(dashboardUrl);
  }
  getDiscTrendRx() {
    let dashboardUrl = this.configUrl + DASHBOARD + GET_ALL_DASHBOARD + RX;
    return this.http.get<any>(dashboardUrl);
  }

  getTotalDiscrepancyData() {
    let dashboardUrl = this.configUrl + DASHBOARD +'GetTotalDiscrepancyData';
    return this.http.get<any>(dashboardUrl);
  }


  getProcDiscSumm() {
    let dashboardUrl = this.configUrl + DASHBOARD + GET_DISP_SUM;
    return this.http.get<any>(dashboardUrl);
  }
  getProcDiscSummRx() {
    let dashboardUrl = this.configUrl + DASHBOARD + GET_DISP_SUM + RX;
    return this.http.get<any>(dashboardUrl);
  }
  getAdminUserDetail() {
    let adminUrl = this.configUrl + ADMIN + GET_USER_DETAIL_DASHBOARD;
    return this.http.get<any>(adminUrl);
  }

  addNewUser(addUserDTO: AddUserDTO) {
    let processorUrl = this.configUrl + ADMIN + POST_USER_DETAIL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    const body = JSON.stringify(addUserDTO);
    return this.http.post<AssignDTO>(processorUrl, body,
      {
        headers: httpOptions.headers,
        observe: 'response'
      }
    );
  }

  updateUser(updateUserDTO: UpdateUserDTO) {
    let processorUrl = this.configUrl + ADMIN + PUT_USER_DETAIL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    const body = JSON.stringify(updateUserDTO);
    return this.http.put<AssignDTO>(processorUrl, body,
      {
        headers: httpOptions.headers,
        observe: 'response'
      }
    );
  }

  getRoleBasedAccess(roleType: string) {
    let url = this.configUrl + GET_ROLE_BASED_ACCESS + roleType;
    return this.http.get<any>(url);
  }

  getInputFilePath() {
    let url = this.configUrl + GET_INPUT_FILE_PATH + this.user_Id;
    return this.http.get<any>(url);
  }

  uploadFile(path: string, reportMonth: string) {
    let url = this.configUrl + UPLOAD_FILE + path + REPORT_MONTH_CONDITION + reportMonth + USER_ID_CONDITION + this.user_Id + IMPORT_FLAG;
    return this.http.get<any>(url);
  }

  exportRecon(reconId: string, reportMonth: string, contract_Id: string, client_Id: string) {
    let url = this.configUrl + EXPORT_RECON + reconId + CONTRACT_ID_CONDITION + contract_Id +
      CLIENT_ID_CONDITION + client_Id + REPORT_MONTH_CONDITION + reportMonth + USER_ID_CONDITION + this.user_Id + EXPORT_FLAG;
    return this.http.get<any>(url);
  }

  executeBatch(flag: string) {
    let url = this.configUrl + RUN_SSIS + CONDITION_USER_ID + this.user_Id + FLAG_CONDITION + flag;
    return this.http.get<any>(url);
  }
  getRuleConfig() {
    let url = this.configUrl + RULE_CONFIG + GET_RULE_CONFIG;
    return this.http.get<any>(url);
  }
  getRuleConfigRx() {
    let url = this.configUrl + RULE_CONFIG_RX + GET_RULE_CONFIG;
    return this.http.get<any>(url);
  }

  updateRuleConfig(UpdateRuleDTO: updateRuleDTO) {
    let ruleConfigUrl = this.configUrl + RULE_CONFIG + PUT_RULE_CONFIG;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    const body = JSON.stringify(UpdateRuleDTO);
    return this.http.put<updateRuleDTO>(ruleConfigUrl, body,
      {
        headers: httpOptions.headers,
        observe: 'response'
      }
    );
  }
  addRuleConfig(addRuleDTO: addRuleDTO) {
    let ruleConfigUrl = this.configUrl + RULE_CONFIG + POST_RULE_CONFIG;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    const body = JSON.stringify(addRuleDTO);
    return this.http.post<addRuleDTO>(ruleConfigUrl, body,
      {
        headers: httpOptions.headers,
        observe: 'response'
      }
    );
  }
  addRuleConfigRx(addRuleDTO: addRuleRxDTO) {
    let ruleConfigUrl = this.configUrl + RULE_CONFIG_RX + POST_RULE_CONFIG;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    const body = JSON.stringify(addRuleDTO);
    return this.http.post<addRuleDTO>(ruleConfigUrl, body,
      {
        headers: httpOptions.headers,
        observe: 'response'
      }
    );
  }
  updateRuleConfigRx(UpdateRuleDTO: updateRuleRxDTO) {
    let ruleConfigUrl = this.configUrl + RULE_CONFIG_RX + PUT_RULE_CONFIG;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    const body = JSON.stringify(UpdateRuleDTO);
    return this.http.put<updateRuleDTO>(ruleConfigUrl, body,
      {
        headers: httpOptions.headers,
        observe: 'response'
      }
    );
  }
  getMemberData(searchParams) {
    let url = this.configUrl + GET_MEMBER_SEARCH + searchParams;
    return this.http.get<any>(url);
  }

  getDiscReslnDashboard(clientId) {
    let url = this.configUrl + DASHBOARD + GET_DISC_RESOLUTION + clientId;
    return this.http.get<any>(url);
  }

  getUnresDiscDashboard(clientId) {
    let url = this.configUrl + DASHBOARD + GET_UNDISC_RESOLUTION + clientId;
    return this.http.get<any>(url);
  }
  getProcResDashboard(clientId) {
    let url = this.configUrl + DASHBOARD + GET_PROC_RESOLUTION + clientId;
    return this.http.get<any>(url);
  }
  getClientDefinition() {
    let url = this.configUrl + CLIENT_DEFINITION;
    return this.http.get<any>(url);
  }
  getAnalystClientDefinition() {
    let url = this.configUrl + ANALYST_CLIENT_DEFINITION;
    return this.http.get<any>(url);
  }
  getMemClientDefinition() {
    let url = this.configUrl + MEM_SEARCH_CLIENT_DEFINITION;
    return this.http.get<any>(url);
  }

  deleteRuleConfig(ruleId) {
    let ruleConfigUrl = this.configUrl + RULE_CONFIG + DELETE_RULE_CONFIG + ruleId;
    return this.http.delete<any>(ruleConfigUrl);
  }
  deleteRuleConfigRx(ruleId) {
    let ruleConfigUrl = this.configUrl + RULE_CONFIG_RX + DELETE_RULE_CONFIG + ruleId;
    return this.http.delete<any>(ruleConfigUrl);
  }
  getDiscrepancyTypeByResolution(clientId) {
    let url = this.configUrl + DASHBOARD + GET_ANALYST_DATA + clientId;
    return this.http.get<any>(url);
  }
  getRuleMaster() {
    let url = this.configUrl + GET_RULE_MASTER;
    return this.http.get<any>(url);
  }
  getBEQData(startDate, endDate) {
    let url = this.configUrl + GET_BEQ_DATA + startDate + END_DATA_CONDITION + endDate;
    return this.http.get<any>(url);

  }

  getARSInfo() {
    let url = this.configUrl + GET_ACTION_REASON_STATUS_INFO;
    return this.http.get<any>(url);
  }

  getAssignedProcessorData(reconId: string, contractId: string) {
    let processorUrl = this.configUrl + DISP_UNASSIGN + PROCESSOR_DATA + reconId + '/' + contractId;
    return this.http.get<any>(processorUrl);
  }

  unassignDiscrepancy(unassignDTO: UnassignDTO) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    }
    const body = JSON.stringify(unassignDTO);
    let url = this.configUrl + UNASSIGN_DISCREPANCY;
    return this.http.put<AssignDTO>(url, body,
      {
        headers: httpOptions.headers,
        observe: 'response'
      }
    );
  }

  getUnassignDetail(reconId: string) {
    let clientContractUrl = this.configUrl + PROC_GET_UNASSIGN_DISCREPANCY + reconId;
    return this.http.get<any>(clientContractUrl);
  }

  unAssignDiscrepancy(assignDTO: ProcAssignDTO[]) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    }
    const body = JSON.stringify(assignDTO);
    let url = this.configUrl + PROC_ASSIGN_DISCREPANCY;
    return this.http.put<AssignDTO>(url, body,
      {
        headers: httpOptions.headers,
        observe: 'response'
      }
    );
  }
}    
