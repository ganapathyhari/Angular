export interface ProcListColumn{
    headerName: string;
    field: string;
    width: number;
}

export class AssignDTO{
     recon_Id : number
     contract : string
     discp_Code : string[]
     assign_Count : number
     processor_Id : string
     manager_Id : string
     all_Flag : string
}

export class UnassignDTO{
    recon_Id : number
    contract : string
    discp_Code : string[]
    unassign_Count : number
    processor_Id : string
    manager_Id : string
    all_Flag : string
}

export class ProcAssignDTO{
    recon_id : number
    contract : string
    discp_Code : string
    report_mon : string
    assign_cnt : string
    processor_id : string
    manager_id : string
    assign_ind : string
}
