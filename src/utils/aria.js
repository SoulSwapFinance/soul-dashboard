const RECEIVE_FOCUS_FROM_ATTR = 'data-receive-focus-from';

/**
 * Is element visible? Fast method, but not accurate, if fixed element is on page.
 * (window.getComputedStyle(el) (style.display === 'none') -> much slower).
 *
 * @param {HTMLElement} _elem
 * @return {boolean}
 */
export function isVisible(_elem) {
    return !!_elem && _elem.offsetParent !== null;
}

/**
 * @param {HTMLElement} _elem
 * @return {boolean}
 */
export function isFocusable(_elem) {
    let focusable = false;

    if (!_elem || _elem.disabled) {
        return false;
    }

    switch (_elem.nodeName) {
        case 'INPUT':
            focusable = _elem.type !== 'hidden' && _elem.type !== 'file';
            break;
        case 'A':
            focusable = !!_elem.href && _elem.rel !== 'ignore';
            break;
        case 'BUTTON':
        case 'SELECT':
        case 'TEXTAREA':
            focusable = true;
            break;
        default:
            focusable = false;
    }

    if (!focusable) {
        focusable = _elem.tabIndex > 0 || (_elem.tabIndex === 0 && _elem.getAttribute('tabIndex') !== null);
    }

    if (focusable) {
        focusable = isVisible(_elem.offsetParent);
    }

    return focusable;
}

/**
 * @param {HTMLElement} _elem
 * @return {HTMLElement|null}
 */
export function findFirstFocusableDescendant(_elem) {
    let focusableElem = null;
    let childNodes;
    let child;

    if (_elem) {
        childNodes = _elem.assignedNodes ? _elem.assignedNodes() : _elem.childNodes;

        // Edge/IE
        if (!childNodes && _elem.assignedNodes) {
            childNodes = _elem.childNodes;
        }

        if (childNodes) {
            for (let i = 0, len1 = childNodes.length; i < len1; i += 1) {
                child = childNodes[i];
                if (child.nodeType === 1) {
                    if (isFocusable(child)) {
                        focusableElem = child;
                        break;
                    } else {
                        focusableElem = findFirstFocusableDescendant(child);
                        if (focusableElem) {
                            break;
                        }
                    }
                }
            }
        }
    }

    return focusableElem;
}

/**
 * @param {HTMLElement} _elem
 * @return {HTMLElement|null}
 */
export function findLastFocusableDescendant(_elem) {
    let focusableElem = null;
    let childNodes;
    let child;

    if (_elem) {
        childNodes = _elem.assignedNodes ? _elem.assignedNodes() : _elem.childNodes;

        // Edge/IE
        if (!childNodes && _elem.assignedNodes) {
            childNodes = _elem.childNodes;
        }

        if (childNodes) {
            for (let i = childNodes.length - 1; i >= 0; i -= 1) {
                child = childNodes[i];
                if (child.nodeType === 1) {
                    // console.log('la', child.assignedNodes, (child.assignedNodes ? child.assignedNodes() : ''));
                    if (isFocusable(child)) {
                        // return child;
                        focusableElem = child;
                        break;
                    } else {
                        focusableElem = findLastFocusableDescendant(child);
                        if (focusableElem) {
                            break;
                        }
                    }
                }
            }
        }
    }

    return focusableElem;
}

/**
 * @param {string} _id
 */
export function returnFocus(_id) {
    const elem = document.querySelector(`[${RECEIVE_FOCUS_FROM_ATTR}="${_id}"]`);

    if (elem) {
        elem.removeAttribute(RECEIVE_FOCUS_FROM_ATTR);
        elem.focus();
    } else {
        document.body.focus();
    }
}

/**
 * Set `RECEIVE_FOCUS_FROM_ATTR` attribute to an element with focus.
 * @param {string} _id
 */
export function setReceiveFocusFromAttr(_id) {
    if (document.activeElement) {
        document.activeElement.setAttribute(RECEIVE_FOCUS_FROM_ATTR, _id);
    }
}
