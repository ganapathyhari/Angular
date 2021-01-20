import { Subscription } from '../../../node_modules/rxjs';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { AgGridAngular } from 'ag-grid-angular';

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../common.service';
import { FormBuilder } from '../../../node_modules/@angular/forms';
import { Router } from '@angular/router';
import { filterList, getErrorMessage, setReconVal } from '../validator';
import {
  BLANK, FALSE, TRUE, PROCESSOR, MANAGER, HYPEN, CLIENT,
  CONTRACT_NO, TOTAL_COUNT, RESOLVED, REMAINING, UNASSIGNED, IN_PROGRESS,
  REPORTED, REPORT_MONTH, TOTAL_RESOLVED, TOTAL_REMAINING, PROCESSOR_NAME, TOTAL_ASSIGNED,
  DISC_CODE, UNRESOLVED, ONE_HUNDRED_FIFTY, ONE_HUNDRED_EIGHTY, ONE_HUNDRED_THIRTY, RIGHT, ONE_HUNDRED_TWENTY,
  BLUE, BACKGROUND_COLOR_CHART, CHART_DOUGHNUT, CHART_PIE, ZERO, ONE, FOUR, SIX, ANALYST,
  USER_DETAILS, SELECT, ONE_HUNDRED_TEN, DISC_TREND_MONTH, MANAGER_ASSIGNMENT, MANAGER_PRODUCTIVITY,
  EXCEL_TIME_STAMP, DISC_RESOLUTION_BY_TYPE, DISC_BY_TYPE, PROCESSOR_ASSIGNMENT, AG_TEXT_FILTER, STARTSWITH, ONE_CHAR, TWO_CHAR
} from 'src/common/constant';
import { NAVIGATE_ERROR } from 'src/common/url-constant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('agGridReport', { static: FALSE }) agGridReport: AgGridAngular;
  @ViewChild('agGridAssign', { static: FALSE }) agGridAssign: AgGridAngular;
  @ViewChild('agGridProductivity', { static: FALSE }) agGridProductivity: AgGridAngular;
  @ViewChild('agGridResolution', { static: FALSE }) agGridResolution: AgGridAngular;
  @ViewChild('agGridProcessorAssign', { static: FALSE }) agGridProcessorAssign: AgGridAngular;

  loader: boolean = FALSE;
  columnDefsProc = [
    { headerName: CLIENT, field: 'client' },
    { headerName: CONTRACT_NO, field: 'contractNo' },
    { headerName: DISC_CODE, field: 'discrepancyCode' },
    { headerName: TOTAL_COUNT, field: 'totalCount' },
    { headerName: RESOLVED, field: 'resolved' },
    { headerName: REMAINING, field: 'remaining' }
  ];

  columnDefs = [
    {
      headerName: CLIENT, field: 'client', width: ONE_HUNDRED_TWENTY, filter: AG_TEXT_FILTER,
      filterParams: { defaultOption: STARTSWITH }
    },
    {
      headerName: CONTRACT_NO, field: 'contractNo', width: ONE_HUNDRED_TWENTY, filter: AG_TEXT_FILTER,
      filterParams: { defaultOption: STARTSWITH }
    },
    {
      headerName: DISC_CODE, field: 'discrepancyCode', width: ONE_HUNDRED_TWENTY, filter: AG_TEXT_FILTER,
      filterParams: { defaultOption: STARTSWITH }
    },
    { headerName: TOTAL_COUNT, field: 'totalCount', width: ONE_HUNDRED_TWENTY },
    { headerName: UNASSIGNED, field: 'unassigned', width: ONE_HUNDRED_TWENTY },
    { headerName: RESOLVED, field: 'resolved', width: ONE_HUNDRED_TEN },
    { headerName: IN_PROGRESS, field: 'inprogress', width: ONE_HUNDRED_TWENTY }
  ];

  columnDefs1 = [
    { headerName: DISC_CODE, field: 'discrepancyCode', width: ONE_HUNDRED_FIFTY },
    { headerName: TOTAL_COUNT, field: 'totalCount', width: ONE_HUNDRED_FIFTY },
    { headerName: RESOLVED, field: 'resolved', width: ONE_HUNDRED_FIFTY },
    { headerName: REPORTED, field: 'reported', width: ONE_HUNDRED_FIFTY }
  ];

  columnDefsReport = [
    { headerName: REPORT_MONTH, field: 'report_Month', width: ONE_HUNDRED_TWENTY },
    { headerName: TOTAL_RESOLVED, field: 'total_Resolved', width: ONE_HUNDRED_TWENTY },
    { headerName: TOTAL_REMAINING, field: 'total_Remaining', width: ONE_HUNDRED_THIRTY }
  ];

  columnDefsMan = [
    { headerName: PROCESSOR_NAME, field: 'processor_Name', width: ONE_HUNDRED_EIGHTY },
    { headerName: TOTAL_ASSIGNED, field: 'total_Assigned', width: ONE_HUNDRED_THIRTY },
    { headerName: RESOLVED, field: 'total_Resolved', width: ONE_HUNDRED_TWENTY }
  ];

  columnDefsRes = [
    { headerName: CLIENT, field: 'client' },
    { headerName: CONTRACT_NO, field: 'contractNo' },
    { headerName: DISC_CODE, field: 'discrepancyCode' },
    { headerName: TOTAL_COUNT, field: 'totalCount' },
    { headerName: UNRESOLVED, field: 'unresolved' },
    { headerName: RESOLVED, field: 'resolved' }
  ];

  userList: any = [];
  rowData: any = [];
  rowDataReport: any = [];
  rowDataMan: any = [];
  rowdataRes: any = [];
  defaultColumnDef: { sortable: boolean; editable: boolean; suppressToolPanel: boolean; suppressMenu: boolean; resizable: boolean; };
  processorList: any = [];
  manProdList: any = [];
  processorRowData: any = [];
  reportMonthList: any = [];
  monthList: any = [];
  homeForm: any;
  userRole: string = BLANK;
  reconVal: string = BLANK;
  clientList: any = [];
  // Add Chart Options. 
  chartOptions = {
    responsive: TRUE // This will make the chart responsive (Visible in any device).
  }
  options = {
    responsive: TRUE,
    legend: {
      position: RIGHT,
    }
  }

  labels: any = [];

  // Static Data for the Chart Label.
  chartData = [{ label: TOTAL_RESOLVED, data: [] }, { label: TOTAL_REMAINING, data: [] }];

  // Chart Color
  colors = [
    {
      backgroundColor: BLUE
    },
    {
      backgroundColor: BACKGROUND_COLOR_CHART
    }
  ]

  // Pie Chart
  public pieChartLabels: any = [];
  public pieChartLabels1: any = [];
  public pieChartLabels2: any = [];
  public pieChartData: any = [];
  public pieChartData1: any = [];
  pieChartData2: any = [];
  public pieChartType: string = CHART_PIE;
  public pieChartType1: string = CHART_DOUGHNUT;
  subscription: Subscription = new Subscription;
  reconType: any = [];
  discrepancyResolutionList: any = [];
  constructor(private formBuilder: FormBuilder, public commonService: CommonService,
    private toastr: ToastrService, private router: Router) { }

  /**
  * Do onLoad of page functionality.
  * @returns void
  */
  ngOnInit(): void {
    setReconVal();
    this.reconVal = this.commonService.reconVal;
    this.createForm();
    this.getUserDetail();
    this.assignDefaultColumnValues();
  }

  /**
  * Called on ngOnInit
  * To initialize Formgroup and Formcontrols.
  * @returns void
  */
  createForm(): void {
    this.homeForm = this.formBuilder.group({
      reportMonth: [BLANK],
      reconcilation: [BLANK],
    });
  }

  /**
    * Called on ngOnInit
    * To assign default value to grid columns.
    * @returns void
    */
  assignDefaultColumnValues(): void {
    this.defaultColumnDef = {
      sortable: TRUE,
      editable: TRUE,
      suppressToolPanel: TRUE,
      suppressMenu: TRUE,
      resizable: TRUE
    }
  }

  /**
   * Get user details from service call and based on authentiction load home page
   * If authentication fails,redirect to error page
   * @returns void
   */
  getUserDetail(): void {
    this.subscription = this.commonService.getUserDetail().subscribe(res => {
      if (res.length == ZERO) {
        this.router.navigateByUrl(NAVIGATE_ERROR);
        this.commonService.user_Id = BLANK;
        this.commonService.user_Role = BLANK;
        this.commonService.user_Name = BLANK;
        this.userRole = BLANK;
        this.commonService.roleAccess.emit(FALSE);
      } else {
        this.commonService.user_Id = res[ZERO].user_Id;
        this.commonService.user_Role = res[ZERO].user_Role;
        this.commonService.user_Name = res[ZERO].user_Name;
        this.userRole = res[ZERO].user_Role;
        this.commonService.roleAccess.emit(TRUE);
        if (this.userRole === MANAGER) {
          this.getReconVal();
        }
        if (this.userRole === ANALYST) {
          this.populateClient();
        }
        this.getDiscTrendReportMonth();
        if (this.userRole !== MANAGER) {
          this.getProcessorDashboard();
        }
      }
    },
      err => {
        this.toastr.error(USER_DETAILS + err.statusText, BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
        this.router.navigateByUrl(NAVIGATE_ERROR);
      });
  }

  /**
  * It is called on ngOninit to populate the recon Type dropdown if user role is processor or manager.
  * @returns void
  */
  getReconType(): void {
    this.subscription = this.commonService.getReconTypeValDsh().subscribe(res => {
      this.reconType = res;
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      })
  }

  /**
  * It is called on ngOninit to populate the client Id dropdown if user role is analyst.
  * @returns void
  */
  populateClient(): void {
    this.subscription = this.commonService.getAnalystClientDefinition().subscribe(res => {
      if (res.length > ZERO) {
        this.clientList = this.filterListOfClient(res);
      }
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });
  }

  /**
  * It is used to filter the clientList to get the list having unique clientId.
  * @param list to be filter.
  * @returns filteredList
  */
  filterListOfClient(list) {
    let filteredList = [];
    const map = new Map();
    for (const item of list) {
      if (!map.has(item.client_Id)) {
        map.set(item.client_Id, TRUE);
        filteredList.push(item.client_Id);
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
    this.subscription.unsubscribe();
  }

  /**
  * This method is called on selection and change in the value of the clientId dropdown.
  * This is used to show three pie-charts displaying values which it get from service call.
  * @param clientId
  * @returns void
  */
  pieChart(clientId): void {
    this.pieChartLabels = [];
    this.pieChartLabels1 = [];
    this.pieChartLabels2 = [];
    this.pieChartData = [];
    this.pieChartData1 = [];
    this.pieChartData2 = [];
    this.subscription = this.commonService.getDiscReslnDashboard(clientId).subscribe(res => {
      if (res.length > ZERO) {
        this.pieChartLabels.push(RESOLVED);
        this.pieChartLabels.push(UNRESOLVED);
        this.pieChartData.push(res[ZERO].total_Resolved);
        this.pieChartData.push(res[ZERO].total_Unresolved);
      }
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });
    this.subscription = this.commonService.getUnresDiscDashboard(clientId).subscribe(res => {
      if (res.length > ZERO) {
        res.forEach((element) => {
          this.pieChartLabels1.push(element.discp_Code);
          this.pieChartData1.push(element.discp_Unresolved);
        })
      }
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });
    this.subscription = this.commonService.getProcResDashboard(clientId).subscribe(res => {
      if (res.length > ZERO) {
        res.forEach((element) => {
          this.pieChartLabels2.push(element.closure_Reason);
          this.pieChartData2.push(element.total_Resolved);
        })
      }
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });
  }

  /**
  * This method is called on ngOnInit if the user role is manager.
  * This is used to get the data of the productivity dashboard table by calling service.
  * @returns void
  */
  getProcDiscSumm(): void {
    this.getUserDetails();
    let rowMan = [];
    this.subscription = this.commonService.getProcDiscSumm().subscribe(res => {
      this.manProdList = res;
      this.manProdList.forEach(details => {
        let value = {
          'processor_Name': this.getUserName(details.processor_Name),
          'total_Assigned': details.total_Assigned,
          'total_Resolved': details.total_Resolved,
        }
        rowMan.push(value);
      });
      this.rowDataMan = rowMan;
    });
  }

  /**
  * This method is called to filter the userList according to userId to get the username.
  * @param userId
  * @returns string
  */
  getUserName(userId): string {
    let selUser = this.userList.filter(data => data.user_Id === userId)
    if (selUser.length > ZERO)
      return selUser[ZERO].user_Name;
  }

  /**
  * This method is called on ngOnInit to get the data of the discrepancy trend by reportmonth chart.
  * @returns void
  */
  getDiscTrendReportMonth(): void {
    let reportMonthTrend = [];
    this.subscription = this.commonService.getDiscTrend().subscribe(res => {
      let list = res;
      list.forEach(details => {
        let value = {
          'report_Month': details.report_Month,
          'total_Resolved': details.total_Resolved,
          'total_Remaining': details.total_Remaining,
        }
        reportMonthTrend.push(value);
        this.labels.push(details.report_Month);
        this.chartData[ZERO].data.push(details.total_Resolved);
        this.chartData[ONE].data.push(details.total_Remaining);
      });
      this.rowDataReport = reportMonthTrend;
    });
  }

  /**
  * This method is called on ngOnInit if the user role is processor.
  * This is used to get the detail of the processor dashboard table by calling service.
  * @returns void
  */
  getProcessorDashboard(): void {
    this.loader = TRUE;
    this.subscription = this.commonService.getDashboard().subscribe(res => {
      this.processorList = res;
      this.processorList.forEach(details => {
        let value = this.userRole === PROCESSOR ? {
          'client': details.client_Id,
          'contractNo': details.contract_Id,
          'discrepancyCode': details.discrepancy_Code,
          'totalCount': details.total_Count,
          'resolved': details.resolved,
          'remaining': details.remaining
        } : {
            'client': details.client_Id,
            'contractNo': details.contract_Id,
            'discrepancyCode': details.discrepancy_Code,
            'totalCount': details.total_Count,
            'unassigned': details.unassigned === null || details.unassigned === BLANK ? ZERO : details.unassigned,
            'resolved': details.resolved,
            'inprogress': details.inprogress
          };
        this.processorRowData.push(value);
        this.reportMonthList.push(details.report_Month);

      });
      this.rowData = this.processorRowData;
      this.getReportMonthValue();
      this.loader = FALSE;
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });

  }

  /**
  * This method is called on ngOnInit.
  * This is used to get the values for reportmonth dropdown.
  * @returns void
  */
  getReportMonthValue(): void {
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
    this.homeForm.controls['reportMonth'].setValue(latestReportMonth.substring(ZERO, FOUR) + HYPEN + latestReportMonth.substring(FOUR, SIX));
    this.filterValue(latestReportMonth);
    this.commonService.reportMonthList = this.monthList;
  }

  /**
  * This method is called on ngOnInit if the user role is processor.
  * This is used to get the detail of the processor dashboard table by calling service.
  * @param event
  * @returns void
  */
  filterProcessorList(event): void {
    if (event.target.value === SELECT) {
      this.rowData = this.processorRowData;

      if (this.userRole === MANAGER) {
        let rowMan = [];
        this.manProdList.forEach(details => {
          let value = {
            'processor_Name': this.getUserName(details.processor_Name),
            'total_Assigned': details.total_Assigned,
            'total_Resolved': details.total_Resolved,
          }
          rowMan.push(value);

        });
        this.rowDataMan = rowMan;

      }
    } else {
      this.filterValue(event.target.value);
    }
  }

  /**
  * This is used to filter the value of reportmonth depending on user role to get unique value.
  * @param reportMonth
  * @returns void
  */
  filterValue(reportMonth): void {
    let processorRowData = [];
    this.processorList.forEach(details => {
      if (reportMonth.replace(HYPEN, BLANK) === details.report_Month) {
        let value = this.userRole === PROCESSOR ? {
          'client': details.client_Id,
          'contractNo': details.contract_Id,
          'discrepancyCode': details.discrepancy_Code,
          'totalCount': details.total_Count,
          'resolved': details.resolved,
          'remaining': details.remaining
        } : {
            'client': details.client_Id,
            'contractNo': details.contract_Id,
            'discrepancyCode': details.discrepancy_Code,
            'totalCount': details.total_Count,
            'unassigned': details.unassigned === null || details.unassigned === BLANK ? ZERO : details.unassigned,
            'resolved': details.resolved,
            'inprogress': details.inprogress
          };
        processorRowData.push(value);
      }
      this.rowData = processorRowData;
    });
    if (this.userRole === MANAGER) {
      let rowMan = [];
      this.manProdList.forEach(details => {
        if (reportMonth.replace(HYPEN, BLANK) === details.report_Month) {
          let value = {
            'processor_Name': this.getUserName(details.processor_Name),
            'total_Assigned': details.total_Assigned,
            'total_Resolved': details.total_Resolved,
          }
          rowMan.push(value);
        }
      });
      this.rowDataMan = rowMan;
    }
  }

  /**
  * This method is called by getProcDiscSumm method
  * to call the service to get the admin user detail.
  * @returns void
  */
  getUserDetails(): void {
    this.userList = [];
    this.subscription = this.commonService.getAdminUserDetail().subscribe(res => {
      this.userList = res;
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });
  }

  /**
  * This method is used to filter the assignment dashboard table according to reportmonth.
  * @param event
  * @returns void
  */
  filterAnalystList(event): void {
    this.processorRowData = [];
    this.processorList.forEach(details => {
      if (event.target.value.replace(HYPEN, BLANK) == details.report_Month) {
        let value = {
          'discrepancyCode': details.discp_Code,
          'totalCount': details.total_Discp_Count,
          'resolved': details.total_Resolved,
          'reported': details.total_Reported
        }
        this.processorRowData.push(value);
      }
      this.rowData = this.processorRowData;
    });
  }

  /**
  * This method is used to get the data of discrepany resolution by type table 
  * by calling service if the user role is analyst.
  * @returns void
  */
  getDiscrepancyResolution(clientId): void {
    this.loader = TRUE;
    this.subscription = this.commonService.getDiscrepancyTypeByResolution(clientId).subscribe(res => {
      this.discrepancyResolutionList = res;
      let rowData = []
      this.discrepancyResolutionList.forEach(details => {
        let value = {
          'client': details.client_Id,
          'contractNo': details.contract_Id,
          'discrepancyCode': details.disc_Code,
          'totalCount': details.total,
          'unresolved': details.unresolved,
          'resolved': details.resolved
        }
        rowData.push(value);
      });
      this.rowdataRes = rowData;
      this.loader = FALSE;
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });
  }
  /**
    * This method is called by on change of value of clientId dropdown
    * to display corresponding pie charts if the user role is analyst.
    * @returns void
    */
  getReconVal(): void {
    if (this.reconVal === ONE_CHAR) {
      this.getProcDiscSumm();
      this.getProcessorDashboard();
    }
  }

  /**
  * This method is called by on change of value of clientId dropdown
  * to display corresponding pie charts if the user role is analyst.
  * @returns void
  */
  getContractVal(event): void {
    let clientId = event.target.value;
    this.pieChart(clientId);
    this.getDiscrepancyResolution(clientId);
  }

  /**
   * This method is for exporting the grid to excel
   * @param fileName 
   */
  exportToExcel(fileName: string): void {

    let timeStamp = moment(new Date()).format(EXCEL_TIME_STAMP);
    const params = {
      allColums: true,
      fileName: fileName + timeStamp
    }
    if (fileName === DISC_TREND_MONTH) {
      if (this.agGridReport && this.agGridReport.api) {
        this.agGridReport.api.exportDataAsCsv(params);
      }
    }
    if (fileName === MANAGER_ASSIGNMENT || fileName === DISC_BY_TYPE) {
      if (this.agGridAssign && this.agGridAssign.api) {
        this.agGridAssign.api.exportDataAsCsv(params);
      }
    }
    if (fileName === PROCESSOR_ASSIGNMENT) {
      if (this.agGridProcessorAssign && this.agGridProcessorAssign.api) {
        this.agGridProcessorAssign.api.exportDataAsCsv(params);
      }
    }

    if (fileName === MANAGER_PRODUCTIVITY) {
      if (this.agGridProductivity && this.agGridProductivity.api) {
        this.agGridProductivity.api.exportDataAsCsv(params);
      }
    }
    if (fileName === DISC_RESOLUTION_BY_TYPE) {
      if (this.agGridResolution && this.agGridResolution.api) {
        this.agGridResolution.api.exportDataAsCsv(params);
      }
    }
  }
}
