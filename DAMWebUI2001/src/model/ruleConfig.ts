export class updateRuleDTO{
    rule_Config_Id : number
    run_Ind : string
}

export class addRuleDTO{
    client : string
    contract : string
    run_Ind : string
    rule_Name : string
}

export class addRuleRxDTO{
    trcReplyCode : string
    system : string
    status : string
}
export class updateRuleRxDTO{
    rule_Id : number
    trcReplyCode : string
    system : string
    status : string
}