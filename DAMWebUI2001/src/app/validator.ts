import { HYPEN, SERVER_ERROR, FIVE_HUNDRED, ZERO, BLANK, UNDEFINED, TWO_CHAR, ONE_CHAR } from 'src/common/constant';

/**
 * Formats date while entering in YYYY-MM-DD format
 * @param event 
 */
export function dateFormatter(event) {
    if (event.target.value.length === 4 || event.target.value.length === 7) {
        if (event.keycode !== 8) {
            event.target.value += HYPEN;
        }
    }
}

/**
 *  Formats Report Month while entering in YYYY-MM
 * @param event 
 */
export function reportMonthFormatter(event) {
    if (event.target.value.length === 4) {
        if (event.keycode !== 8) {
            event.target.value += HYPEN;
        }
    }
}

/**
 * Restricts only numbers while entering in text field
 * @param event 
 */
export function onlyNumbers(event) {
    let pattern = /^[0-9]+$/;
    return pattern.test(event.key);
}
/**
 * Restricts only alphabets and numbers while entering in text field
 * @param event 
 */
export function isAlphaNumeric(event) {
    let pattern = /^[a-zA-Z0-9]+$/;
    return pattern.test(event.key);
}

/**
 * Restricts only alphabets while entering in text field
 * @param event 
 */
export function isAlphaOnly(event) {
    const keyEvent = <KeyboardEvent>event;
    if (keyEvent.key == 'Tab' || keyEvent.key == 'TAB' || keyEvent.key === 'Backspace') {
        return;
    }
    let keyCode;
    keyCode = event.keyCode;
    if ((keyCode > 64 && keyCode < 91) || (keyCode > 96 && keyCode < 123) || keyCode == 8 || keyCode === 32) {
        return;
    }
    keyEvent.preventDefault();
}

/**
 * filters list removing duplicate values 
 * @param list 
 */
export function filterList(list) {
    let filteredList = [];
    const map = new Map();
    for (const item of list) {
        if (!map.has(item)) {
            map.set(item, true);    // set any value to Map
            filteredList.push(item);
        }
    }
    return filteredList;
}

export function getErrorMessage(err) {
    let error = SERVER_ERROR;

    if (err && (err.status === ZERO || err.status === FIVE_HUNDRED)) {
        error = err.statusText;
    } else if (err && err.error && err.error.Message && err.error.Message !== BLANK && err.error.Message !== UNDEFINED) {
        error = err.error.Message;
    } else if (err && err.error) {
        error = err.error;
    }
    return error;
}

export function setReconVal(){
    let nodes: NodeListOf<HTMLInputElement> = document.getElementsByName('reconToogle') as NodeListOf<HTMLInputElement>;
    if (nodes[0].checked) {
      this.commonService.reconVal = TWO_CHAR;
    } else {
      this.commonService.reconVal = ONE_CHAR;
    }
}