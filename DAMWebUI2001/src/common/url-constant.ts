export const GET_JOB_STATUS_LOG = 'JobSts/GetJobSts';
export const PROC_LIST = '/ProcList';
export const GET_USER_ASSIGNED_DISCREPANCIES = '/GetUserAssignedDiscrepancies/';
export const GET_RECON_TYPE = '/Recon/GetReconName/';
export const GET_RECON_TYPE_DSH = '/Recon/GetReconNameDsh/';

export const DISP_ASSIGN = '/DiscpAssign/';
export const DISP_UNASSIGN = '/DiscpUnAssign/';
export const CLIENT_DEFINITION_DATA = 'GetClientDefinitionData/';
export const PROCESSOR_DATA = 'GetProcessorData/';
export const GET_UNASSIGNED_DISP_DATA = 'GetUnassignedDiscpData/';

export const PROC_DETAIL = '/ProcDetail/';
export const DISCREPANCY_DETAILS = 'GetDiscrepancyDetailsData/'
export const DISP_UPDATE = 'PutDiscpUpdate'

export const ASSIGN_DISCREPANCY = '/DiscpAssignUpdate/PutDiscpAssign';
export const UNASSIGN_DISCREPANCY = '/DiscpUnAssignUpdate/PutDiscpUnAssign';

export const PROC_ASSIGN_DISCREPANCY = '/DiscpUnassignDetlUpd/PutUnassignDetl';
export const PROC_GET_UNASSIGN_DISCREPANCY = '/DiscpUnassignDetl/GetUnassignDetl/';

//Dashboard
export const DASHBOARD = '/Dashboard/';
export const GET_DASHBOARD = 'GetDashboard/';
export const MANAGER_DASHBOARD = 'GetManagerDashboard';
export const GET_ALL_DASHBOARD = 'GetAllDashboard';
export const GET_DISP_SUM = 'GetProcDiscSumm';
export const GET_DISC_RESOLUTION = 'GetDiscReslnDashboard/';
export const GET_UNDISC_RESOLUTION = 'GetUnresDiscDashboard/';
export const GET_PROC_RESOLUTION = 'GetProcResDashboard/';
export const GET_ANALYST_DATA = 'GetAnalystDashboardAnalyzeData/';
export const RX = 'Rx';

//Admin
export const ADMIN = '/Admin/';
export const GET_USER_DETAIL_DASHBOARD = 'GetUserDetail';
export const POST_USER_DETAIL = 'PostUserDetail';
export const PUT_USER_DETAIL = 'PutUserDetail';

export const GET_ROLE_BASED_ACCESS = '/RoleBasedAccess/GetRoleBasedAccess/?role_Type='

export const GET_INPUT_FILE_PATH = '/SessionFolder/GetInputFilePath/';

export const GET_USER_DETAIL = '/GetUserDetail';

//uploadFile
export const UPLOAD_FILE = '/RunSSIS/runSSIS/?file_Path=';
export const REPORT_MONTH_CONDITION = '&report_Month=';
export const USER_ID_CONDITION = '&user_Id=';
export const IMPORT_FLAG = '&flag=I';

export const EXPORT_RECON = '/RunSSIS/runSSIS/?recon_Id=';
export const CONTRACT_ID_CONDITION = '&contract_Id=';
export const CLIENT_ID_CONDITION = '&client_Id=';
export const EXPORT_FLAG = '&flag=E'
//Execute Batch
export const RUN_SSIS = '/RunSSIS/runSSIS/';
export const CONDITION_USER_ID = '?user_Id=';
export const FLAG_CONDITION = '&flag='
//Rule config
export const RULE_CONFIG = '/RuleConfig/';
export const RULE_CONFIG_RX = '/RuleConfigRx/';
export const GET_RULE_CONFIG = 'GetRuleConfig';
export const PUT_RULE_CONFIG = 'PutRuleConfig';
export const POST_RULE_CONFIG = 'PostRuleConfig';
export const DELETE_RULE_CONFIG = 'DeleteRuleConfig/';

//Member Search
export const GET_MEMBER_SEARCH = '/MemSearch/GetMemData/'

//client definition
export const CLIENT_DEFINITION = 'ClientDefinition/GetClientDefinition';

//Analyst Client Defintion
export const ANALYST_CLIENT_DEFINITION = 'AnalystClientDefn/GetAnalystClientDefinition';

//Member Search Client Defintion
export const MEM_SEARCH_CLIENT_DEFINITION = 'MemSearchClientDefn/GetMemSearchClientDefinition';

//Rule Master
export const GET_RULE_MASTER = '/RuleMaster/GetRuleMaster';

//Get BEQ tracking
export const GET_BEQ_DATA = '/BEQTracking/GetBEQData/?start_Date=';
export const END_DATA_CONDITION = '&end_Date=';

export const GET_ACTION_REASON_STATUS_INFO = 'ProcDetail/GetARSInfo';

//Navigation
export const NAVIGATE_HOME = '/home';
export const NAVIGATE_ERROR = '/error-page';
export const NAVIGATE_MYQUEUE = '/my-queue';
export const NAVIGATE_MEMSEARCH = '/member-search';
export const NAVIGATE_PROCDETAIL = 'proc-detail'

//Member search url Conditions
export const CONTRACT_ID = '?contract_Id=';
export const MBI_CONDITION = '&MBI=';
export const SUB_ID_CONDITION = '&sub_Id=';
export const FIRST_NAME_CONDITION = '&first_Name=';
export const LAST_NAME_CONDITION = '&last_Name=';
export const BIRTH_DATE_CONDITION = '&birth_Date=';