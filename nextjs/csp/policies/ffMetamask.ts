import type CspDev from 'csp-dev';

export function ffMetamask(): CspDev.DirectiveDescriptor {

  return {
    'script-src': [
      `'sha256-PRh/fvLCFBNVoIAGULuMBLuPh7G0pBe3UpLsY8yvX0A='`, // MetaMask Firefox  12.23.1
    ],
  };
}
