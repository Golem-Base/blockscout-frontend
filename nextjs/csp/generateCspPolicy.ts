import * as descriptors from './policies';
import { makePolicyString, mergeDescriptors } from './utils';

function generateCspPolicy(isPrivateMode = false, nonce?: string) {
  const policyDescriptor = mergeDescriptors(
    descriptors.app(isPrivateMode),
    // Exclude tracking/analytics sources in private mode
    isPrivateMode ? {} : descriptors.ad(),
    descriptors.app(isPrivateMode, nonce),
    descriptors.ad(),
    descriptors.cloudFlare(),
    descriptors.flashblocks(),
    descriptors.gasHawk(),
    isPrivateMode ? {} : descriptors.googleAnalytics(),
    descriptors.googleFonts(),
    descriptors.googleReCaptcha(),
    isPrivateMode ? {} : descriptors.growthBook(),
    descriptors.helia(),
    isPrivateMode ? {} : descriptors.marketplace(),
    descriptors.megaEth(),
    isPrivateMode ? {} : descriptors.mixpanel(),
    descriptors.monaco(),
    descriptors.multichain(),
    isPrivateMode ? {} : descriptors.rollbar(),
    descriptors.rollup(),
    descriptors.safe(),
    descriptors.usernameApi(),
    descriptors.walletConnect(),
    descriptors.ffMetamask(),
    descriptors.umami(nonce),
    isPrivateMode ? {} : descriptors.walletConnect(),
    descriptors.zetachain(),
  );

  return makePolicyString(policyDescriptor);
}

export default generateCspPolicy;
