import React from 'react';

interface Props {
  width: number;
  height: number;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<SVGRectElement>) => void;
  onAuxClick?: (event: React.MouseEvent<SVGRectElement>) => void;
}

const ChartOverlay = ({ width, height, children, onClick, onAuxClick }: Props, ref: React.ForwardedRef<SVGRectElement>) => {
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
};

export default React.forwardRef(ChartOverlay);
