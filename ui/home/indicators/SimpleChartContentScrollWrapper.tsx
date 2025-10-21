import { Box } from '@chakra-ui/react';
import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  children: React.ReactNode;
}

const SimpleChartContentScrollWrapper = ({ children }: Props) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [ canScrollLeft, setCanScrollLeft ] = React.useState(false);
  const [ canScrollRight, setCanScrollRight ] = React.useState(false);

  const updateScrollButtons = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const hasHorizontalScroll = container.scrollWidth > container.clientWidth;
    const isAtStart = container.scrollLeft <= 1; // tolerance for rounding
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 1;

    setCanScrollLeft(hasHorizontalScroll && !isAtStart);
    setCanScrollRight(hasHorizontalScroll && !isAtEnd);
  }, []);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    updateScrollButtons();

    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ updateScrollButtons ]);

  const optionalScrolledToEnd = React.useCallback((node: HTMLDivElement) => {
    if (node) {
      scrollContainerRef.current = node;
      node.scrollLeft = node.scrollWidth;
      updateScrollButtons();
    }
  }, [ updateScrollButtons ]);

  const handleScroll = React.useCallback(() => {
    updateScrollButtons();
  }, [ updateScrollButtons ]);

  const scrollLeft = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }
    container.scrollBy({ left: -container.clientWidth * 0.8, behavior: 'smooth' });
  }, []);

  const scrollRight = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }
    container.scrollBy({ left: container.clientWidth * 0.8, behavior: 'smooth' });
  }, []);

  return (
    <Box position="relative" className="group" height="100%">
      { canScrollLeft && (
        <IconButton
          aria-label="Scroll left"
          variant="surface"
          position="absolute"
          left="0"
          top="50%"
          transform="translateY(-50%)"
          zIndex={ 1 }
          onClick={ scrollLeft }
          bg="white"
          _dark={{ bg: 'gray.900' }}
          opacity={{ base: 1, md: 0 }}
          _groupHover={{ opacity: 1 }}
        >
          <IconSvg name="arrows/east" boxSize={ 5 } transform="rotate(180deg)"/>
        </IconButton>
      ) }

      { canScrollRight && (
        <IconButton
          aria-label="Scroll right"
          variant="surface"
          position="absolute"
          right="-20px"
          top="50%"
          transform="translateY(-50%)"
          zIndex={ 1 }
          onClick={ scrollRight }
          bg="white"
          _dark={{ bg: 'gray.900' }}
          opacity={{ base: 1, md: 0 }}
          _groupHover={{ opacity: 1 }}
        >
          <IconSvg name="arrows/east" boxSize={ 5 }/>
        </IconButton>
      ) }
      <Box
        my="-5px"
        h={{ base: '100%', lg: 'calc(100% + 10px)' }}
        w={{ base: '100%', lg: 'calc(100% + 20px)' }}
        overflowX="auto"
        ref={ optionalScrolledToEnd }
        onScroll={ handleScroll }
      >
        { children }
      </Box>
    </Box>
  );
};

export default SimpleChartContentScrollWrapper;
