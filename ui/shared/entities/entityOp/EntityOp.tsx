import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import { useMultichainContext } from 'lib/contexts/multichain';
import * as EntityBase from 'ui/shared/entities/base/components';

import { distributeEntityProps } from '../base/utils';

type LinkProps = EntityBase.LinkBaseProps & Partial<Pick<EntityProps, 'txHash' | 'opIndex'>>;

const Link = chakra((props: LinkProps) => {
  if (!props.txHash || !props.opIndex) return null;

  const defaultHref = route({ pathname: '/tx/[hash]/operation/[idx]', query: { hash: props.txHash, idx: props.opIndex } });

  return (
    <EntityBase.Link
      { ...props }
      href={ props.href ?? defaultHref }
    >
      { props.children }
    </EntityBase.Link>
  );
});

const Icon = (props: EntityBase.IconBaseProps) => {
  return (
    <EntityBase.Icon
      { ...props }
      name={ props.name ?? 'docs' }
    />
  );
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'txHash' | 'opIndex' | 'noTxHash'>;

const Content = chakra((props: ContentProps) => {
  const text = props.noTxHash ? props.opIndex : `${ props.txHash }-${ props.opIndex }`;
  return (
    <EntityBase.Content
      { ...props }
      text={ text }
      tailLength={ props.tailLength ?? 4 }
    />
  );
});

type CopyProps = Omit<EntityBase.CopyBaseProps, 'text'> & Pick<EntityProps, 'txHash' | 'opIndex'>;

const Copy = (props: CopyProps) => {
  return (
    <EntityBase.Copy
      { ...props }
      text={ `${ props.txHash }-${ props.opIndex }` }
      noCopy={ props.noCopy ?? true }
    />
  );
};

const Container = EntityBase.Container;

export interface EntityProps extends EntityBase.EntityBaseProps {
  txHash: string;
  opIndex: string;
  noTxHash?: boolean;
}

const EntityOp = (props: EntityProps) => {
  const multichainContext = useMultichainContext();
  const partsProps = distributeEntityProps(props);

  const content = <Content { ...partsProps.content }/>;

  return (
    <Container { ...partsProps.container }>
      <Icon { ...partsProps.icon }/>
      { props.noLink ? content : <Link { ...partsProps.link } chain={ multichainContext?.chain }>{ content }</Link> }
      <Copy { ...partsProps.copy }/>
    </Container>
  );
};

export default React.memo(chakra(EntityOp));

export {
  Container,
  Link,
  Icon,
  Content,
};
