import appConfig from 'configs/app';
import * as multichainConfig from 'configs/multichain/config.edge';

import generateCspPolicy from './generateCspPolicy';

export async function get(nonce?: string) {
  appConfig.features.opSuperchain.isEnabled && await multichainConfig.load();
  return generateCspPolicy(nonce);
}
