import { Subscription } from '../../../node_modules/rxjs';

import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import {
  BLANK, FALSE, TRUE, ZERO, ONE, TWO, THREE, FOUR, FIVE,
  SIX, SEVEN, EIGHT, NINE, ONE_HUNDRED, ONE_HUNDRED_TWENTY, ONE_HUNDRED_TEN,
  ONE_HUNDRED_THIRTY, ONE_HUNDRED_FOURTY, ONE_HUNDRED_FIFTY, ONE_HUNDRED_SIXTY,
  ONE_HUNDRED_SEVENTY, ONE_HUNDRED_EIGHTY, ONE_HUNDRED_NINETY, SIDEBAR, MAIN, HEADER,
  SIDEBAR_MARGIN, MAIN_WIDTH, HEADER_MARGIN, TWO_HUNDRED, TEN, UNDERSCORE_BLANK, TWO_HUNDRED_TEN,
  ELEVEN, TWO_HUNDRED_TWENTY, TWELVE, TWO_HUNDRED_THIRTY, THIRTEEN, TWO_CHAR, ONE_CHAR
} from 'src/common/constant';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { setReconVal } from '../validator';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuList = [FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE];
  roleAccessSubscription = new Subscription;
  constructor(public commonService: CommonService, public router: Router) { }

  /**
  * Do onLoad of page functionality.  
  * @returns void
  */
  ngOnInit(): void {
    this.assignRoleBasedAccess();
    this.getARSInfo();
  }
  onChange() {
    setReconVal();
  }
  /**
  * This method calls the service to display the menu list 
  * to implement Role Based Access to screens.
  * @returns void
  */
  assignRoleBasedAccess(): void {
    this.roleAccessSubscription = this.commonService.roleAccess.subscribe(res => {
      this.menuList = [FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE];
      if (res) {
        this.roleAccessSubscription = this.commonService.getRoleBasedAccess(this.commonService.user_Role).subscribe(details => {
          let list = details;
          list.forEach(i => {
            if (i.screen_Id === ONE_HUNDRED) this.menuList[ZERO] = TRUE;
            if (i.screen_Id === ONE_HUNDRED_TEN) this.menuList[ONE] = TRUE;
            if (i.screen_Id === ONE_HUNDRED_TWENTY) this.menuList[TWO] = TRUE;
            if (i.screen_Id === ONE_HUNDRED_THIRTY) this.menuList[THREE] = TRUE;
            if (i.screen_Id === ONE_HUNDRED_FOURTY) this.menuList[FOUR] = TRUE;
            if (i.screen_Id === ONE_HUNDRED_FIFTY) this.menuList[FIVE] = TRUE;
            if (i.screen_Id === ONE_HUNDRED_SIXTY) this.menuList[SIX] = TRUE;
            if (i.screen_Id === ONE_HUNDRED_SEVENTY) this.menuList[SEVEN] = TRUE;
            if (i.screen_Id === ONE_HUNDRED_EIGHTY) this.menuList[EIGHT] = TRUE;
            if (i.screen_Id === ONE_HUNDRED_NINETY) this.menuList[NINE] = TRUE;
            if (i.screen_Id === TWO_HUNDRED) this.menuList[TEN] = TRUE;
            if (i.screen_Id === TWO_HUNDRED_TEN) this.menuList[ELEVEN] = TRUE;
            if (i.screen_Id === TWO_HUNDRED_TWENTY) this.menuList[TWELVE] = TRUE;
            if (i.screen_Id === TWO_HUNDRED_THIRTY) this.menuList[THIRTEEN] = TRUE;
          });
        });
      }
    });
  }

  /**
  * This method is called to open/close the sidebar and 
  * make the changes in the width and the margin of the screen.
  * @returns void
  */
  openCloseNav(): void {
    if (document.getElementById(SIDEBAR).style.marginLeft != SIDEBAR_MARGIN) {
      document.getElementById(MAIN).style.width = MAIN_WIDTH;
      document.getElementById(SIDEBAR).style.marginLeft = SIDEBAR_MARGIN;
      document.getElementById(HEADER).style.marginLeft = HEADER_MARGIN;
      document.getElementById(MAIN).style.marginLeft = SIDEBAR_MARGIN;

    } else {
      document.getElementById(MAIN).style.width = BLANK;
      document.getElementById(SIDEBAR).style.marginLeft = BLANK;
      document.getElementById(HEADER).style.marginLeft = BLANK;
      document.getElementById(MAIN).style.marginLeft = BLANK;
    }
  }

  /**
* This method is called to open reporting server in new tab.
* @returns void
*/
  onNavigate(): void {
    window.open(environment.reportUrl, UNDERSCORE_BLANK);
  }

  /**
  * This method calls the service to get Action,reason and status
  * @returns void
  */
  getARSInfo(): void {
    this.roleAccessSubscription = this.commonService.getARSInfo().subscribe(details => {
      this.commonService.actionReasonStatusInfo = details;
    });
  }
  /**
  * This event is called internally by angular to do garbage collection.
  * This is used to clear the toaster if any and unsubcribe the subcription before leaving the page.
  * @returns void
  */
  ngOnDestroy(): void {
    this.roleAccessSubscription.unsubscribe();
  }
}
