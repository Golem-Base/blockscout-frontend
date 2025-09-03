// we use custom heading size for hero banner
// eslint-disable-next-line no-restricted-imports
import { Box, Flex, Heading, chakra } from '@chakra-ui/react';
import React from 'react';
import { LuFileSearch } from 'react-icons/lu';

import config from 'configs/app';
import CreateEntityLink from 'ui/entity/CreateEntityLink';
import RewardsButton from 'ui/rewards/RewardsButton';
import AdBanner from 'ui/shared/ad/AdBanner';
import ButtonLink from 'ui/shared/ButtonLink';
import SearchBar from 'ui/snippets/searchBar/SearchBar';
import UserProfileDesktop from 'ui/snippets/user/profile/UserProfileDesktop';
import UserWalletDesktop from 'ui/snippets/user/wallet/UserWalletDesktop';

export const BACKGROUND_DEFAULT =
  'radial-gradient(103.03% 103.03% at 0% 0%, rgba(183, 148, 244, 0.8) 0%, rgba(0, 163, 196, 0.8) 100%), var(--chakra-colors-blue-400)';
const TEXT_COLOR_DEFAULT = 'white';
const BORDER_DEFAULT = 'none';

const EntitySearchLink = () => (
  <ButtonLink href="/entity/search" variant="surface">
    <LuFileSearch/>
    <chakra.span hideBelow="md">Entity Search</chakra.span>
  </ButtonLink>
);

const HeroBanner = () => {
  const background = {
    _light:
      config.UI.homepage.heroBanner?.background?.[0] ||
      config.UI.homepage.plate.background ||
      BACKGROUND_DEFAULT,
    _dark:
      config.UI.homepage.heroBanner?.background?.[1] ||
      config.UI.homepage.heroBanner?.background?.[0] ||
      config.UI.homepage.plate.background ||
      BACKGROUND_DEFAULT,
  };

  const textColor = {
    _light:
      // light mode
      config.UI.homepage.heroBanner?.text_color?.[0] ||
      config.UI.homepage.plate.textColor ||
      TEXT_COLOR_DEFAULT,
    // dark mode
    _dark:
      config.UI.homepage.heroBanner?.text_color?.[1] ||
      config.UI.homepage.heroBanner?.text_color?.[0] ||
      config.UI.homepage.plate.textColor ||
      TEXT_COLOR_DEFAULT,
  };

  const border = {
    _light:
      config.UI.homepage.heroBanner?.border?.[0] || BORDER_DEFAULT,
    _dark:
      config.UI.homepage.heroBanner?.border?.[1] || config.UI.homepage.heroBanner?.border?.[0] || BORDER_DEFAULT,
  };

  return (
    <Flex
      w="100%"
      background={ background }
      border={ border }
      borderRadius="md"
      p={{ base: 4, lg: 8 }}
      columnGap={ 8 }
      alignItems="center"
    >
      <Box flexGrow={ 1 }>
        <Flex mb={{ base: 2, lg: 3 }} justifyContent="space-between" alignItems="center" columnGap={ 2 }>
          <Heading
            as="h1"
            fontSize={{ base: '18px', lg: '30px' }}
            lineHeight={{ base: '24px', lg: '36px' }}
            fontWeight={{ base: 500, lg: 700 }}
            color={ textColor }
          >
            {
              config.meta.seo.enhancedDataEnabled ?
                `${ config.chain.name } blockchain explorer` :
                `${ config.chain.name } explorer`
            }
          </Heading>
          { config.UI.navigation.layout === 'vertical' && (
            <Box display={{ base: 'none', lg: 'flex' }} alignItems="center" gap={ 2 }>
              { config.features.rewards.isEnabled && <RewardsButton variant="hero"/> }
              <CreateEntityLink variant="hero">Create New Entity</CreateEntityLink>
              {
                (config.features.account.isEnabled && <UserProfileDesktop buttonVariant="hero"/>) ||
                (config.features.blockchainInteraction.isEnabled && <UserWalletDesktop buttonVariant="hero"/>)
              }
            </Box>
          ) }
        </Flex>
        <Flex gap={ 3 } alignItems="center">
          <EntitySearchLink/>
          <SearchBar isHomepage/>
        </Flex>
      </Box>
      <AdBanner platform="mobile" w="fit-content" flexShrink={ 0 } borderRadius="md" overflow="hidden" display={{ base: 'none', lg: 'block ' }}/>
    </Flex>
  );
};

export default React.memo(HeroBanner);
