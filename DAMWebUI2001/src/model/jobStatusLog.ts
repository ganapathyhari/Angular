export interface JobStatusLog{
    jobInstanceId : number;
    contractId : string;
    programId : string;
    jobName : string;
    fileName : string;
    jobStart : string;
    jobEnd : string;
    status : string;
    selected : boolean;
}