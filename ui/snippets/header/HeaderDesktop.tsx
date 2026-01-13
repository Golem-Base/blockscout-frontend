import { HStack, Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import CreateEntityLink from 'ui/entity/CreateEntityLink';
import RewardsButton from 'ui/rewards/RewardsButton';
import SearchBar from 'ui/snippets/searchBar/SearchBarDesktop';
import UserProfileDesktop from 'ui/snippets/user/profile/UserProfileDesktop';
import UserWalletDesktop from 'ui/snippets/user/wallet/UserWalletDesktop';

type Props = {
  renderSearchBar?: () => React.ReactNode;
  hideSearchBar?: boolean;
};

const HeaderDesktop = ({ renderSearchBar, hideSearchBar }: Props) => {

  const searchBar = renderSearchBar ? renderSearchBar() : <SearchBar/>;

  return (
    <HStack
      as="header"
      display={{ base: 'none', lg: 'flex' }}
      width="100%"
      alignItems="center"
      justifyContent="center"
      gap={ 6 }
    >
      <Box width="100%">
        { !hideSearchBar && searchBar }
      </Box>
      { config.UI.navigation.layout === 'vertical' && (
        <Box display="flex" gap={ 2 } flexShrink={ 0 }>
          { config.features.rewards.isEnabled && <RewardsButton/> }
          <CreateEntityLink>Create Entity</CreateEntityLink>
          {
            (config.features.account.isEnabled && <UserProfileDesktop/>) ||
            (config.features.blockchainInteraction.isEnabled && <UserWalletDesktop/>)
          }
        </Box>
      ) }
    </HStack>
  );
};

export default React.memo(HeaderDesktop);
