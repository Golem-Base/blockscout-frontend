import React from 'react';

export interface ChartOverlayProps {
  width: number;
  height: number;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<SVGRectElement>) => void;
  onAuxClick?: (event: React.MouseEvent<SVGRectElement>) => void;
}

export const ChartOverlay = React.forwardRef(({ width, height, children, onClick, onAuxClick }: ChartOverlayProps, ref: React.ForwardedRef<SVGRectElement>) => {
  return (
    <g className="ChartOverlay">
      { children }
      <rect
        ref={ ref }
        width={ width }
        height={ height }
        opacity={ 0 }
        style={ onClick || onAuxClick ? { cursor: 'pointer' } : undefined }
        onClick={ onClick }
        onAuxClick={ onAuxClick }
      />
    </g>
  );
});
