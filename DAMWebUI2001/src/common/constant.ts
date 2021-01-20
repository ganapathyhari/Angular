import { mapToMapExpression } from '../../node_modules/@angular/compiler/src/render3/util';

//Toaster constants
export const SERVER_ERROR = 'Server Error';
export const INTERNAL_SERVER_ERROR = 'Internal Server Error';
export const USER_ADDED = 'New User Added Successfully';
export const USER_ALREADY_EXISTS = 'USER ALREADY EXISTS';
export const USER_UPDATED = 'User Updated Successfully';
export const ASSIGNED_SUCCESSFULLY = 'Assigned Successfully';
export const UNASSIGNED_SUCCESSFULLY = 'Unassigned Successfully';
export const EXPORT_FAILED = 'Export Failed';
export const EXPORTED_SUCCESSFULLY = 'Exported Successfully';
export const USER_DETAILS = 'User Details ';
export const FILE_LOAD_INPROGRESS = 'File Load In-Progress';
export const LOADED_SUCCESSFULLY = 'Process Complete. Check Job Status Log for details';
export const UPDATED_SUCCESSFULLY = 'Updated Successfully';
export const DELETED_SUCCESSFULLY = 'Deleted Successfully';
export const ADDED_SUCCESSFULLY = 'Added Successfully';

//Common 
export const BLANK = '';
export const SPACE = ' ';
export const US_DATEPIPE = 'en-US'
export const TIME_STAMP = ' 00:00:00.000';
export const TRUE = true;
export const FALSE = false;
export const PROCESSOR = 'PROCESSOR';
export const MANAGER = 'MANAGER';
export const ANALYST = 'ANALYST';
export const NEW = 'NEW';
export const START_DATE = '1753-01-01'
export const END_DATE = '9999-12-12'
export const OTHER = 'other';
export const ACTIVE_INDICATOR = 'actInd';
export const TERM_DATE = 'termDate'
export const USER_ROLE = 'userRole';
export const NO_UNASSIGNED_DISCREPANCIES_AVAILABLE = 'No unassigned discrepancies currently available';
export const EXECUTION_FAILED = 'Failure Execution';
export const OUTPUT_FILE_PATH = 'Output File Path: ';
export const SUCCESSFUL_EXECUTION = 'Successful Execution';
export const CUSTOM = 'Custom';
export const TRR = 'TRR';
export const BEQ = 'BEQ';
export const GROUP_PBP = 'GROUP PBP';
export const E33_33M = 'E33,33M';
export const COPY_PASTE_FILE = 'Copy and Paste the file in ';
export const DOB = 'dob';
export const NEGATIVE_ONE = '-01';
export const CLIENT_ID = 'client_Id';
export const LASTNAME = 'last_Name';
export const DISC_ID = 'Disc Id';
export const CLIENT_ID_VAL = 'Client Id'
export const CONTRACT_ID_VAL = 'Contract Id'
export const DISC = 'disc';
export const HTTPERROR = 'HttpErrorResponse';
export const UNDEFINED = undefined;
export const NULL = null;
export const TRUE_WORD = 'true';
export const ACTION = "ACTION";
export const REASON = "REASON";
export const STATUS = "STATUS";
export const OPEN = "OPEN";

//AG-grid
export const STARTSWITH = 'startsWith';
export const DISPDETAIL = 'discpDetail';
export const AG_TEXT_FILTER = 'agTextColumnFilter';
export const HEADER_NAME = 'headerName';
export const CELL_RENDERER = 'cellRenderer';
export const FIELD = 'field';
export const WIDTH = 'width';
export const FULL_ROW = 'fullRow';
export const AG_CELL_EDITOR = 'agSelectCellEditor';
export const RADIO = 'radio';
export const SELECT_AG_CELL_EDIT_INPUT = 'select.ag-cell-edit-input';

//Date format
export const REPORT_MONTH_FORMAT = 'YYYY-MM';
export const REPORT_MONTH_ATTEST_FORMAT = 'YYYYMM';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const NGB_DATE_FORMAT = 'MM-DD-YYYY';
export const PROC_DETAIL_DATE_FORMAT = 'dd/MM/yyyy';
export const EXCEL_TIME_STAMP = '_MM-DD-YYYY_HH:mm:SS';


//Error Constants
export const USER_ALREADY_EXISTS_ERROR = 'An error was thrown: USER ALREADY EXISTS';
export const USER_ID_MANDATORY = 'User ID is mandatory';
export const USER_NAME_MANDATORY = 'User Name is mandatory';
export const USER_ROLE_MANDATORY = 'User Role is mandatory';
export const EFFECTIVE_DATE_MANDATORY = 'Effective Date is mandatory'
export const EFFECTIVE_DATE_INVALID = 'Enter Valid Effective Date';
export const TERMINATION_DATE_INVALID = 'Enter Valid Termination Date';
export const ACTIVE_IND_MANDATORY = 'Active Indicator is mandatory';
export const USER_EXISTS = 'The Given User Id already exist';
export const NO_UPDATE = 'No values are updated';
export const ENTER_QUANTITY = 'Enter Quantity';
export const ENTER_QUANTITY_INVALID = 'Enter valid Quantity';
export const QUANTITY_LESS_THAN_UNASSIGNED = 'Quantity should be less than or equal to the Unassigned count of ';
export const QUANTITY_LESS_THAN_PENDING_COUNT = 'Quantity should be less than or equal to the pending count of ';
export const ENTER_REPORT_MONTH_INVALID = 'Enter Valid Report Month';
export const ENTER_ATLEAST_ONE_FIELD = 'Enter MBI or Sub ID or First Name or Last Name';
export const ENTER_DOB = 'Enter DOB';
export const ENTER_VALID_DOB = 'Enter Valid DOB';
export const TERM_DATE_BEFORE_EFF_DATE = 'Effective date should be before Termination Date';
export const EFF_DATE_BEFORE_CURRENT_DATE = 'Effective date should not be before Current Date';
export const NO_ASSINED_DISCREPANCIES_AVAILABLE = "No discrepancies assigned to Processor";
export const NO_PENDING_ASSINED_DISCREPANCIES_AVAILABLE = "No pending discrepancies available to Processor";
//BEQ tracking Error constants
export const START_DATE_END_DATE_MANDATORY = 'Start Date and End Date must be entered for filtering';
export const END_DATE_BEFORE_START_DATE = 'End Date is Before Start Date'
export const START_DATE_INVALID = 'Enter Valid Start Date';
export const START_DATE_VALID_AFTER = 'Enter Valid Start Date after 1752-12-31'
export const END_DATE_INVALID = 'Enter Valid End Date';

//Rule Config Error Constants
export const INVALID_SELECT = 'Please select a row to continue.';
export const INVALID_COMBINATION = 'The particular combination of Rule Name and Contract already exist.';
export const INVALID_COMBINATION_RX = 'The particular combination of TRC Reply Code and System already exist.';
export const INVALID_DATA = 'Please Select Valid Data.';

//export error constants
export const RECONCILATION_MANDATORY = 'Reconcilation is mandatory';
export const REPORT_MONTH_MANDATORY = 'Report Month is mandatory';
export const CONTRACT_ID_MANDATORY = 'Contract Id is mandatory';
export const CLIENT_ID_MANDATORY = 'Client Id is mandatory';
export const SELECT_USER = 'Select User to update';
export const SELECT_RECON_TYPE = 'Select Recon Type';
export const SELECT_CLIENT = 'Select Client';
export const SELECT_CONTRACT = 'Select Contract';
export const SELECT_TRC = 'Select TRC File Date';
export const SELECT_PROCESSOR = 'Select Processor';
export const SELECT_DISCREPANCY_TYPE = 'Select Discrepancy Code';
export const SELECT_TR_CODE = 'Select Transaction Reply Code';

export const SELECT_ACTION = 'Select Action';
export const SELECT_REASON = 'Select Reason';
export const SELECT_STATUS = 'Select Status';

//Letter constants
export const HYPEN = '-';
export const UNDERSCORE = '_';
export const COMMA = ',';
export const QUEUE = 'Q';
export const MEMBER_SEARCH = 'M';
export const PUBLISH_ATTEST = 'P';
export const TRIGGER_SYNC = 'N';
//Document constants
export const SIDEBAR = 'sidebar';
export const MAIN = 'main';
export const HEADER = 'header';
export const SIDEBAR_MARGIN = '-232px';
export const MAIN_WIDTH = '116%';
export const HEADER_MARGIN = '232px';
export const RIGHT = 'right';
export const BLUE = 'blue';
export const BACKGROUND_COLOR_CHART = 'rgba(30, 169, 224, 0.8)';
export const CHART_PIE = 'pie';
export const CHART_DOUGHNUT = 'doughnut';
export const SELECT = 'Select';
export const CHECKED = 'checked';
export const DISABLED = 'disabled';
export const RADIOBUTTON = 'radioButton';
export const UNDERSCORE_BLANK = '_blank';
export const ONE_CHAR = '1';
export const TWO_CHAR = '2';
export const THREE_CHAR = '3';
//Number Constants
export const MINUS_ONE = -1;
export const ZERO = 0;
export const ONE = 1;
export const TWO = 2;
export const THREE = 3;
export const FOUR = 4;
export const FIVE = 5;
export const SIX = 6;
export const SEVEN = 7;
export const EIGHT = 8;
export const NINE = 9;
export const TEN = 10;
export const ELEVEN = 11;
export const TWELVE = 12;
export const THIRTEEN = 13;
export const FIFTY = 50;
export const ONE_HUNDRED = 100;
export const ONE_HUNDRED_TEN = 110;
export const ONE_HUNDRED_FIFTEEN = 115;
export const ONE_HUNDRED_TWENTY = 120;
export const ONE_HUNDRED_TWENTYFIVE = 125;
export const ONE_HUNDRED_THIRTY = 130;
export const ONE_THIRTY_SEVEN = 137;
export const ONE_HUNDRED_FOURTY = 140;
export const ONE_HUNDRED_FIFTY = 150;
export const ONE_HUNDRED_SIXTY = 160;
export const ONE_HUNDRED_SIXTY_FIVE = 165;
export const ONE_HUNDRED_SEVENTY = 170;
export const ONE_HUNDRED_EIGHTY = 180;
export const ONE_HUNDRED_NINETY = 190;
export const TWO_HUNDRED = 200;
export const TWO_HUNDRED_TEN = 210;
export const TWO_HUNDRED_TWENTY = 220;
export const TWO_HUNDRED_THIRTY = 230;
export const TWO_HUNDRED_FIFTY = 250;
export const TWO_HUNDRED_SIXTY = 260;
export const TWO_HUNDRED_EIGHTY = 280;
export const THREE_HUNDRED_FIFTY = 350;
export const FIVE_HUNDRED = 500;
export const TWO_THOUSAND = 2000;

//flags
export const ACTIVE_IND_NO = 'N'
export const FALSE_STRING = 'false';
export const ALL_SMALL = 'all';

//Header Constants
export const FILE_CONTROL_NUMBER = 'File Control No';
export const CONTRACT_ID = 'Contract Id';
export const REQUEST_JOB_ID = 'Request Job Id';
export const REQUEST_FILE_NAME = 'Request File Name';
export const REQUEST_FILE_STATUS = 'Request File Status';
export const REQUEST_FILE_CREATION_DATE = 'Request File Creation Date';
export const RESPONSE_JOB_ID = 'Response Job Id';
export const RESPONSE_FILE_NAME = 'Response File Name';
export const RESPONSE_FILE_STATUS = 'Response File Status';
export const RESPONSE_FILE_RECEIPT_DATE = 'Response File Receipt Date';
export const REOLUTION_STATUS = 'Resolution Status';
export const CLIENT = 'Client'
export const CONTRACT_NO = 'Contract No';
export const DISC_TYPE = 'Disc Type';
export const TOTAL_COUNT = 'Total Count';
export const RESOLVED = 'Resolved';
export const REMAINING = 'Remaining';
export const UNASSIGNED = 'Unassigned';
export const IN_PROGRESS = 'In Progress';
export const REPORTED = 'Reported';
export const REPORT_MONTH = 'Report Month';
export const TOTAL_RESOLVED = 'Total  Resolved';
export const TOTAL_REMAINING = 'Total Remaining';
export const PROCESSOR_NAME = 'Processor Name';
export const TOTAL_ASSIGNED = 'Total Assigned';
export const DISC_CODE = 'Disc Code';
export const UNRESOLVED = 'Unresolved';
export const JOB_INSTANCE_ID = 'Job Instance Id';
export const PROGRAM_ID = 'Program Id';
export const JOB_NAME = 'Job Name';
export const FILE_NAME = 'File Name';
export const FILE_STATUS = 'File Status';
export const JOB_START = 'Job Start';
export const JOB_END = 'Job End';
export const JOB_STATUS = 'Job Status';
export const JOB_USER = 'Job User';
export const ID = 'Id';
export const MBI = 'MBI';
export const SUB_ID = 'Sub Id';
export const FIRST_NAME = 'First Name';
export const LAST_NAME = 'Last Name';
export const PLAN_VALUE = 'Plan Value';
export const CMS_VALUE = 'CMS Value';
export const CONTRACT = 'Contract';
export const RULE_NAME = 'Rule Name';
export const RULE_DESCRIPTION = 'Rule Description';
export const RUN_INDICATOR = 'Run Indicator';
export const DISCREPENCY_CODE = 'Discrepancy Code';
export const TRANSACTION_REPLY_CODE = 'Transaction Reply Code';
export const UNASSIGNED_COUNT = 'Unassigned Count';
export const DISCREPENCY_TODO = 'Discrepancy To Do';
export const MULTIPLE = 'multiple';
export const PENDING_DISCREPENCY = 'Pending Discrepancy';
export const ASSIGNED_COUNT = 'Assigned Count';
export const TOTAL_UNASSIGNED = 'Total Unassigned';
export const TOTAL_PENDING = 'Total Pending';
export const PROCESSOR_QUEUED = 'Processor Queued';
export const QUANTITY = 'Quantity';
export const DROPDOWN_VALUES = ['Select', 'Y', 'N'];
export const AND_OR_DROPDOWN_VALUES = ['Select', 'AND', 'OR'];
export const STATUS_DROPDOWN_VALUES = ['Select', 'OPEN', 'COMPLETE', '4RX NOT REQUIRED']
export const SYSTEM_DROPDOWN_VALUES = ['Select', 'TMG CORE', 'CMS Submission', 'EAM']
export const TOTAL_NO_RECORDS = 'Total No of Records';
export const TOTAL_4RX_SUBMITTED = 'Total 4RX submitted';
export const TOTAL_4RX_NOT_SUBMITTED = 'Total 4RX Not submitted';
export const TRC_FILE_DATE = 'TRC File Date';

//Export to Excel
export const DISC_TREND_MONTH = 'Disc_Trend_Month';
export const MANAGER_ASSIGNMENT = 'Manager_Assignment';
export const PROCESSOR_ASSIGNMENT = 'Processor_Assignment';
export const MANAGER_PRODUCTIVITY = 'Manager_Productivity';
export const MY_QUEUE = 'My_Queue';
export const DISC_RESOLUTION_BY_TYPE = 'Disc_Res_By_Type';
export const DISC_BY_TYPE = 'Disc_By_Type';

export const FILE_NAME_FORMAT_MESSAGE = 'Input File name should be in the format : *_Discrepancy_Inventory_Report_*.csv';


// Proc Management
export const QUANTITY_ERROR_MESSAGE = 'Quantity entered should be less than or equal to Processor Queued';
export const ENTER_QUANTITY_ERROR_MESSAGE = 'Enter Quantity';
export const VALID_QUANTITY_ERROR_MESSAGE = 'Enter Valid Quantity';
export const PATTERN = /^[0-9]+$/

export const HYPEN_REPLACEALL = /\-/gi