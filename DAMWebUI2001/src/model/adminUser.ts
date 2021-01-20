export class AddUserDTO {
    user_Name: string
    user_Id: string
    role_Type: string
    eff_Date: string
    term_Date: string
    active_Ind: string
    admin_Id: string
}
export class UpdateUserDTO {
    user_Id: string
    role_Type: string
    term_Date: string
    active_Ind: string
    admin_Id: string
}

export class RoleAccessDTO {
    roleType: string
    screenId: number
    screenName: string

}
