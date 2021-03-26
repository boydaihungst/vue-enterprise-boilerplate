import memoizie from 'nano-memoize';
import { REGEX } from '@utils/const';

const isEmail = memoizie((val) => new RegExp(REGEX.EMAIL).test(val));

const isAccount = memoizie((val) => new RegExp(REGEX.ACCOUNT).test(val));

const isPassword = memoizie((val) => new RegExp(REGEX.PASSWORD).test(val));

const isPhoneNumber = memoizie((val) => new RegExp(REGEX.PHONE).test(val));

export { isAccount, isEmail, isPassword, isPhoneNumber };
