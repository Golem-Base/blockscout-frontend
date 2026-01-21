import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import { useMultichainContext } from 'lib/contexts/multichain';
import * as EntityBase from 'ui/shared/entities/base/components';

import { distributeEntityProps } from '../base/utils';

type LinkProps = EntityBase.LinkBaseProps & Partial<Pick<EntityProps, 'entityKey'>>;

const Link = chakra((props: LinkProps) => {
  if (!props.entityKey) return null;

  const defaultHref = route({ pathname: '/entity/[key]', query: { key: props.entityKey } });

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
    <EntityBase.Icon { ...props }/>
  );
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'entityKey'>;

const Content = chakra((props: ContentProps) => {
  return (
    <EntityBase.Content
      { ...props }
      text={ props.entityKey }
      tailLength={ props.tailLength ?? 4 }
    />
  );
});

type CopyProps = Omit<EntityBase.CopyBaseProps, 'text'> & Pick<EntityProps, 'entityKey'>;

const Copy = (props: CopyProps) => {
  return (
    <EntityBase.Copy
      { ...props }
      text={ props.entityKey }
      noCopy={ props.noCopy ?? true }
    />
  );
};

const Container = EntityBase.Container;

export interface EntityProps extends EntityBase.EntityBaseProps {
  entityKey: string;
}

const StorageEntity = (props: EntityProps) => {
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

export default React.memo(chakra(StorageEntity));

export {
  Container,
  Link,
  Icon,
  Content,
};
