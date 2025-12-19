import * as descriptors from './policies';
import { makePolicyString, mergeDescriptors } from './utils';

function generateCspPolicy(nonce?: string) {
  const policyDescriptor = mergeDescriptors(
    descriptors.app(nonce),
    descriptors.ad(),
    descriptors.cloudFlare(),
    descriptors.gasHawk(),
    descriptors.googleAnalytics(),
    descriptors.googleFonts(),
    descriptors.googleReCaptcha(),
    descriptors.growthBook(),
    descriptors.helia(),
    descriptors.marketplace(),
    descriptors.mixpanel(),
    descriptors.monaco(),
    descriptors.multichain(),
    descriptors.rollbar(),
    descriptors.safe(),
    descriptors.usernameApi(),
    descriptors.walletConnect(),
    descriptors.ffMetamask(),
    descriptors.umami(nonce),
  );

  return makePolicyString(policyDescriptor);
}

export default generateCspPolicy;
