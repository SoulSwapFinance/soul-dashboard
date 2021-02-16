import { BigNumber } from 'bignumber.js';

/**
 * @param {string|number|BigNumber} _value
 * @return {BigNumber}
 */
export function toBigNumber(_value) {
    return new BigNumber(_value);
}

/**
 * @param {string|number|BigNumber} _value
 * @return {BigNumber}
 */
export function bFromWei(_value) {
    return toBigNumber(_value).shiftedBy(-18);
}
