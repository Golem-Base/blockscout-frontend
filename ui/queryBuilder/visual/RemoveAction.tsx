import React from 'react';
import type { ActionProps } from 'react-querybuilder';

import RemoveButton from 'toolkit/components/buttons/RemoveButton';

const RemoveAction = ({ handleOnClick, ...props }: ActionProps) => {
  return <RemoveButton onClick={ handleOnClick } variant="subtle" { ...props }/>;
};

export default React.memo(RemoveAction);
