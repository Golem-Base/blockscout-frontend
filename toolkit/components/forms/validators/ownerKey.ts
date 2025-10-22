import { ADDRESS_REGEXP } from './address';

const OWNER_KEY_REGEXP = /^0x[a-fA-F\d*]{1,40}$/;

export function ownerKeyPatternValidator(value: string | undefined) {
  if (!value) {
    return true;
  }

  if (ADDRESS_REGEXP.test(value)) {
    return true;
  }

  if (OWNER_KEY_REGEXP.test(value)) {
    return true;
  }

  return 'Invalid owner key format. Use full address or pattern with wildcards (e.g., 0x1234*, 0x*5678, 0x12*34)';
}
