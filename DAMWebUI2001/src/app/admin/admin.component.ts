import { NgbDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Subscription } from '../../../node_modules/rxjs';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from '../common.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { onlyNumbers, dateFormatter, getErrorMessage } from '../validator';
import { UpdateUserDTO, AddUserDTO } from 'src/model/adminUser';
import {
  BLANK, US_DATEPIPE, TIME_STAMP, TRUE, FALSE, PROCESSOR,
  MANAGER, ANALYST, NEW, DATE_FORMAT, ONE, ZERO, ACTIVE_INDICATOR, TERM_DATE, USER_ROLE,
  USER_ID_MANDATORY, USER_NAME_MANDATORY, USER_ROLE_MANDATORY, EFFECTIVE_DATE_MANDATORY,
  EFFECTIVE_DATE_INVALID, TERMINATION_DATE_INVALID, ACTIVE_IND_MANDATORY, USER_EXISTS, USER_ADDED,
  TWO_THOUSAND, SELECT_USER, NO_UPDATE, USER_UPDATED, ACTIVE_IND_NO, TERM_DATE_BEFORE_EFF_DATE, EFF_DATE_BEFORE_CURRENT_DATE
} from 'src/common/constant';
import { NAVIGATE_HOME } from 'src/common/url-constant';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  @ViewChild('termDate', { static: FALSE }) termDate: NgbDatepicker;
  @ViewChild('effDate', { static: FALSE }) effDate: NgbDatepicker;

  constructor(private formBuilder: FormBuilder, private commonService: CommonService,
    private toastr: ToastrService, private router: Router) { }

  datePipe = new DatePipe(US_DATEPIPE);

  adminForm: FormGroup;
  isAdd: boolean = FALSE;
  termFlag: boolean = TRUE;
  indFlag: boolean = TRUE;
  roleFlag: boolean = TRUE;
  userList: any = [];
  errorList: any = [];
  roleList: any = [PROCESSOR, MANAGER, ANALYST];
  minDateVal: any;
  minDateTermVal: any;
  selUser: any;
  adminSubscription: Subscription = new Subscription;
  updateSubscription: Subscription = new Subscription;
  addSubscription: Subscription = new Subscription;

  /**
  * Do onLoad of page functionality.
  * @returns void
  */
  ngOnInit() {
    this.createForm();
    this.setMinDate();
    this.getUserDetails();
  }

  /**
  * Called on ngOnInit
  * To initialize Formgroup and Formcontrols.
  * @returns void
  */
  createForm(): void {
    this.adminForm = this.formBuilder.group({
      userId: [BLANK],
      userName: [BLANK],
      effDate: [BLANK],
      termDate: [],
      userRole: [BLANK],
      actInd: [BLANK],
      newUser: [BLANK]
    });
  }

  /**
   * This method is to set Minimum Date value for Effective and Termination Date Pickers
   * @returns void
   */
  setMinDate(): void {
    let now: Date = new Date();
    this.minDateVal = { year: now.getFullYear(), month: now.getMonth() + ONE, day: now.getDate() };
    this.minDateTermVal = { year: now.getFullYear(), month: now.getMonth() + ONE, day: ONE };
  }

  /**
   * This method is to get List of users to update
   * @returns void
   */
  getUserDetails(): void {
    this.userList = [];
    this.adminSubscription = this.commonService.getAdminUserDetail().subscribe(response => {
      this.userList = response;
    },
      err => {
        this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
      });
  }

  /**
   * This method will be called on change of UserName dropdown
   * @param event 
   * @returns void
   */
  changeUser(event): void {
    this.errorList = [];
    let userName = event.target.value;
    if (userName === NEW) {
      this.addNew();
    }
    else {
      this.isAdd = FALSE;
      this.termFlag = FALSE;
      this.indFlag = TRUE;
      this.roleFlag = TRUE;
      let selUser = this.userList.filter(data => data.user_Name === userName)
      this.selUser = selUser.length > ZERO ? selUser[ZERO] : null;
      this.populateUser(this.selUser);
    }
  }

  /**
   * This method is to populate user on selection of user from User Name dropdown
   * @param selUser 
   * @returns void
   */
  populateUser(selUser): void {
    this.adminForm.controls['userId'].setValue(selUser.user_Id);
    this.adminForm.controls['userRole'].setValue(selUser.role_Type);
    this.adminForm.controls['effDate'].setValue(this.convertNgbDate(new Date(selUser.eff_Date)));
    this.adminForm.controls['termDate'].setValue(this.convertNgbDate(new Date(selUser.term_Date)));
    this.adminForm.controls['actInd'].setValue(selUser.active_Ind);
    this.selUser.term_Date = this.toDateWithTimeStamp(this.convertNgbDate(new Date(selUser.term_Date)));
  }

  /**
   * This method is to convert Date to NgbDate to populate date values
   * @param date 
   * @returns NgbDateStruct
   */
  convertNgbDate(date: Date): NgbDateStruct {
    return date ? {
      year: date.getFullYear(),
      month: date.getMonth() + ONE,
      day: date.getDate()
    } : null;
  }

  /**
  * This method is to convert NgbDate to Date 
  * @param ngbDate 
  * @returns Date
  */
  toModel(date: NgbDateStruct): Date {
    return date ? new Date(Date.UTC(date.year, date.month - ONE, date.day, ZERO, ZERO, ZERO)) : null;
  }

  /**
   * This method is to convert NgbDate to Date and format with time stamp
   * @param ngbDate 
   */
  toDateWithTimeStamp(ngbDate: NgbDateStruct) {
    return ngbDate ? moment(new Date(ngbDate.year, ngbDate.month - ONE, ngbDate.day)).format(DATE_FORMAT) + TIME_STAMP : null;
  }

  /**
   * This method is to convert NgbDate to Date and format 
   * @param ngbDate 
   */
  toDate(ngbDate: NgbDateStruct) {
    return ngbDate ? moment(new Date(ngbDate.year, ngbDate.month - ONE, ngbDate.day)).format(DATE_FORMAT) : null;
  }

  /**
   * This method is to make other fields disabled when one of the three fields is updated
   * @param event 
   * @returns void
   */
  onUpdateValue(event): void {
    if (!this.isAdd) {
      let changed = event.target.id;
      if (changed === ACTIVE_INDICATOR) {
        this.termFlag = TRUE;
        this.roleFlag = FALSE;
      } else if (changed === TERM_DATE) {
        this.indFlag = FALSE;
        this.roleFlag = FALSE;
      } else if (changed === USER_ROLE) {
        this.termFlag = TRUE;
        this.indFlag = FALSE;
      }
    }
  }

  /**
   * This method is to add new User
   *  @returns void
   */
  addNew(): void {
    this.isAdd = TRUE;
    this.termFlag = FALSE;
    this.indFlag = TRUE;
    this.roleFlag = TRUE;
    this.adminForm.controls['newUser'].setValue(BLANK);
    this.clearFormValues();
  }

  /**
   * This method is to reset form on click of cancel
   * @returns void
   */
  cancel(): void {
    this.errorList = [];
    this.adminForm.controls['userName'].setValue(BLANK);
    this.clearFormValues();
    if (this.isAdd) {
      this.adminForm.controls['newUser'].setValue(BLANK);
    }
  }

  /**
   * This method is to clear all form Values on click of cancel
   * @returns void
   */
  clearFormValues(): void {
    this.adminForm.controls['userId'].setValue(BLANK);
    this.adminForm.controls['userRole'].setValue(BLANK);
    this.adminForm.controls['effDate'].setValue(BLANK);
    this.adminForm.controls['termDate'].setValue(BLANK);
    this.adminForm.controls['actInd'].setValue(BLANK);
  }

  /**
   * This method is to check whether the new user id already exists
   * @returns boolean
   */
  duplicateUserId(): boolean {
    let isDuplicate = FALSE;
    let currentUserId = this.adminForm.controls['userId'].value.trim();
    this.userList.forEach((user) => {
      if (user.user_Id === currentUserId) {
        isDuplicate = TRUE;
      }
    })
    return isDuplicate;
  }

  /**
   * This method is to validate the values entered in the form
   * @returns void
   */
  validateFields(): void {
    this.errorList = [];
    if (this.adminForm.controls['userId'].value.trim() === BLANK)
      this.errorList.push(USER_ID_MANDATORY);

    if (this.adminForm.controls['newUser'].value.trim() === BLANK)
      this.errorList.push(USER_NAME_MANDATORY);

    if (this.adminForm.controls['userRole'].value.trim() === BLANK)
      this.errorList.push(USER_ROLE_MANDATORY);

    let effDate = this.adminForm.controls['effDate'].value;
    if (effDate === BLANK)
      this.errorList.push(EFFECTIVE_DATE_MANDATORY);
    else if (!moment(this.toDate(effDate), DATE_FORMAT, TRUE).isValid()) {
      this.errorList.push(EFFECTIVE_DATE_INVALID)
    } else if (moment(this.toDate(effDate)).isBefore(moment(new Date()).format(DATE_FORMAT))) {
      this.errorList.push(EFF_DATE_BEFORE_CURRENT_DATE)
    }
    let termDate = this.adminForm.controls['termDate'].value;
    if (termDate !== BLANK && termDate !== null) {
      if (!moment(this.toDate(termDate), DATE_FORMAT, TRUE).isValid()) {
        this.errorList.push(TERMINATION_DATE_INVALID)
      }
    }
    if (this.adminForm.controls['actInd'].value === BLANK) {
      this.errorList.push(ACTIVE_IND_MANDATORY);
    }
    let userName = this.adminForm.controls['userName'].value;
    if (userName === NEW && this.duplicateUserId()) {
      this.errorList.push(USER_EXISTS);
    }
    this.termDateValidation();
  }

  /**
   *This method is to add new user called on click of Add button 
   * @returns void
   */
  addUser(): void {
    this.validateFields();
    if (this.errorList.length === ZERO) {
      let addUser = new AddUserDTO();
      addUser.user_Id = this.adminForm.controls['userId'].value;
      addUser.user_Name = this.adminForm.controls['newUser'].value;
      addUser.role_Type = this.adminForm.controls['userRole'].value;
      addUser.eff_Date = this.adminForm.controls['effDate'].value === BLANK ? BLANK : this.toDateWithTimeStamp(this.adminForm.controls['effDate'].value);
      addUser.term_Date = this.adminForm.controls['termDate'].value === BLANK ? BLANK : this.toDateWithTimeStamp(this.adminForm.controls['termDate'].value);
      addUser.active_Ind = this.adminForm.controls['actInd'].value;
      addUser.admin_Id = this.commonService.user_Id;
      this.addSubscription = this.commonService.addNewUser(addUser).subscribe(res => {
        if (res) {
          this.toastr.success(USER_ADDED, BLANK, { timeOut: TWO_THOUSAND });
          this.getUserDetails();
          this.addNew();
        }
      },
        err => {
          this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
        });
    }
  }

  /**
   *This method is to update user called on click of Update button 
   *@returns void
   */
  updateUser(): void {
    this.errorList = [];
    if (this.adminForm.controls['userName'].value.trim() === BLANK)
      this.errorList.push(SELECT_USER);

    let updateUser = new UpdateUserDTO();
    updateUser.user_Id = this.adminForm.controls['userId'].value;
    updateUser.role_Type = this.roleFlag ? this.adminForm.controls['userRole'].value : BLANK;
    let termDate = this.adminForm.controls['termDate'].value;
    if (termDate !== BLANK && termDate !== null) {
      if (!moment(this.toDate(termDate), DATE_FORMAT, TRUE).isValid()) {
        this.errorList.push(TERMINATION_DATE_INVALID)
      }
    }
    this.termDateValidation();
    updateUser.term_Date = this.termFlag ? BLANK : this.toDateWithTimeStamp(termDate);
    updateUser.active_Ind = this.indFlag ? this.adminForm.controls['actInd'].value : BLANK;
    updateUser.admin_Id = this.commonService.user_Id;
    if (this.selUser && updateUser.user_Id === this.selUser.user_Id && updateUser.role_Type === this.selUser.role_Type
      && this.toDateWithTimeStamp(termDate) === this.selUser.term_Date && updateUser.active_Ind === this.selUser.active_Ind) {
      this.errorList.push(NO_UPDATE);
    }

    if (this.errorList.length === ZERO) {
      this.updateSubscription = this.commonService.updateUser(updateUser).subscribe(res => {
        if (res) {
          if ((this.roleFlag === TRUE || (this.indFlag === TRUE && updateUser.active_Ind === ACTIVE_IND_NO)) && updateUser.user_Id === this.commonService.user_Id) {
            this.router.navigateByUrl(NAVIGATE_HOME);
          } else {
            this.toastr.success(USER_UPDATED, BLANK, { timeOut: TWO_THOUSAND });
            this.getUserDetails();
          }
        }
      },
        err => {
          this.toastr.error(getErrorMessage(err), BLANK, { closeButton: TRUE, disableTimeOut: TRUE });
        });
    }
  }


  /**
   * Pushes error message to the error list if Termination date is before effective date
   * @param event 
   * @returns void 
   */
  termDateValidation() {
    let effDate = this.adminForm.controls['effDate'].value;
    let termDate = this.adminForm.controls['termDate'].value;
    if (termDate !== BLANK && moment(this.toDate(termDate)).isBefore(this.toDate(effDate))) {
      this.errorList.push(TERM_DATE_BEFORE_EFF_DATE)
    }
  }
  /**
   * This method is to format DOB while entering value in the field
   * @param event 
   * @returns void
   */
  dobAddFormatter(event): void {
    dateFormatter(event)
  }

  /**
   * This method is to restrict only numbers
   * @param event
   * @returns boolean
   */
  restrict(event): boolean {
    return onlyNumbers(event)
  }

  /**
  * This event is called internally by angular to do garbage collection.
  * This is used to clear the toaster and unsubcribe the subcription before leaving the page.
  * @returns void
  */
  ngOnDestroy(): void {
    this.toastr.clear();
    this.adminSubscription.unsubscribe();
    this.updateSubscription.unsubscribe();
    this.addSubscription.unsubscribe();
  }
}