import * as d3 from 'd3';
import { useRouter } from 'next/router';
import React from 'react';

type BlockIdentifierGetter<T> = (item: T, index: number) => string | null | undefined;

type Params<T> = {
  overlayRef: React.RefObject<SVGRectElement | null>;
  items: Array<T>;
  xScale: d3.ScaleTime<number, number>;
  baseDate?: Date;
  getBlockIdentifier?: BlockIdentifierGetter<T>;
};

const defaultGetBlockIdentifier = (item: { block_number?: string | number; label?: string | number }) => {
  const value = item.block_number ?? item.label;
  return typeof value === 'number' ? value.toString() : value ?? null;
};

const useChartBlockNavigation = <T>({
  overlayRef,
  items,
  xScale,
  baseDate = new Date(0),
  getBlockIdentifier = defaultGetBlockIdentifier as BlockIdentifierGetter<T>,
}: Params<T>) => {
  const router = useRouter();

  const getBlockNumberFromClick = React.useCallback((event: React.MouseEvent<SVGRectElement>): string | null => {
    if (!overlayRef.current || items.length === 0) {
      return null;
    }

    const [ x ] = d3.pointer(event, overlayRef.current);
    const xDate = xScale.invert(x);
    const index = Math.round(xDate.getTime() - baseDate.getTime());
    const clampedIndex = Math.min(items.length - 1, Math.max(0, index));

    const blockIdentifier = getBlockIdentifier(items[clampedIndex], clampedIndex);
    return blockIdentifier ? blockIdentifier.toString() : null;
  }, [ baseDate, getBlockIdentifier, items, overlayRef, xScale ]);

  const handleChartClick = React.useCallback((event: React.MouseEvent<SVGRectElement>) => {
    const blockNumber = getBlockNumberFromClick(event);

    if (!blockNumber) {
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      const href = `/block/${ blockNumber }`;
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      router.push({ pathname: '/block/[height_or_hash]', query: { height_or_hash: blockNumber } });
    }
  }, [ getBlockNumberFromClick, router ]);

  const handleChartAuxClick = React.useCallback((event: React.MouseEvent<SVGRectElement>) => {
    if (event.button !== 1) {
      return;
    }

    event.preventDefault();
    const blockNumber = getBlockNumberFromClick(event);

    if (blockNumber) {
      const href = `/block/${ blockNumber }`;
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  }, [ getBlockNumberFromClick ]);

  return {
    handleChartClick,
    handleChartAuxClick,
  };
};

export default useChartBlockNavigation;
