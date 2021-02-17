import { BigNumber } from 'bignumber.js';

/**
 * @param {string|number|BigNumber} _value
 * @return {BigNumber}
 */
export function toBigNumber(_value) {
    return new BigNumber(_value);
}

/**
 * Shift decimal point
 *
 * @param {string|number|BigNumber} _value
 * @param {number} [_dp]
 * @return {BigNumber}
 */
export function bShiftDP(_value, _dp = 18) {
    return toBigNumber(_value).shiftedBy(_dp);
}

/**
 * From Wei to Ether
 *
 * @param {string|number|BigNumber} _value
 * @return {BigNumber}
 */
export function bFromWei(_value) {
    return bShiftDP(_value, -18);
}

/**
 * From Ether to Wei
 *
 * @param {string|number|BigNumber} _value
 * @return {BigNumber}
 */
export function bToWei(_value) {
    return bShiftDP(_value, 18);
}
