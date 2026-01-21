import React from 'react';

import { describe, it, expect, vitest } from 'vitest';
import { render, screen } from 'vitest/lib';

import TxDetailsOther from './TxDetailsOther';

vitest.mock('ui/shared/DetailedInfo/DetailedInfo', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ItemLabel: ({ children, hint }: { children: React.ReactNode; hint: string }) => (
    <div data-testid="item-label" data-hint={ hint }>{ children }</div>
  ),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ItemValue: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="item-value">{ children }</div>
  ),
}));

describe('TxDetailsOther', () => {
  const defaultProps = {
    nonce: 123,
    type: 2,
    position: 5,
  };

  describe('Transaction Type', () => {
    it('should render transaction type with EIP-1559 label', () => {
      render(<TxDetailsOther { ...defaultProps }/>);

      expect(screen.getByText('Txn type:')).toBeTruthy();
      expect(screen.getByText('2')).toBeTruthy();
      expect(screen.getByText('(EIP-1559)')).toBeTruthy();
    });

    it('should render transaction type with EIP-4844 label', () => {
      render(<TxDetailsOther { ...defaultProps } type={ 3 }/>);

      expect(screen.getByText('Txn type:')).toBeTruthy();
      expect(screen.getByText('3')).toBeTruthy();
      expect(screen.getByText('(EIP-4844)')).toBeTruthy();
    });

    it('should render transaction type with EIP-7702 label', () => {
      render(<TxDetailsOther { ...defaultProps } type={ 4 }/>);

      expect(screen.getByText('Txn type:')).toBeTruthy();
      expect(screen.getByText('4')).toBeTruthy();
      expect(screen.getByText('(EIP-7702)')).toBeTruthy();
    });

    it('should render transaction type without label for other types', () => {
      render(<TxDetailsOther { ...defaultProps } type={ 1 }/>);

      expect(screen.getByText('Txn type:')).toBeTruthy();
      expect(screen.getByText('1')).toBeTruthy();
      expect(screen.queryByText(/EIP-/)).toBeNull();
    });

    it('should not render transaction type when type is null', () => {
      render(<TxDetailsOther { ...defaultProps } type={ null }/>);

      expect(screen.queryByText('Txn type:')).toBeNull();
    });
  });

  describe('Nonce and Queue Index', () => {
    it('should render nonce when queueIndex is not provided', () => {
      render(<TxDetailsOther { ...defaultProps }/>);

      expect(screen.getByText('Nonce:')).toBeTruthy();
      expect(screen.getByText('123')).toBeTruthy();
    });

    it('should render queue index when provided', () => {
      render(<TxDetailsOther { ...defaultProps } queueIndex={ 42 }/>);

      expect(screen.getByText('Queue index:')).toBeTruthy();
      expect(screen.getByText('42')).toBeTruthy();
      expect(screen.queryByText('Nonce:')).toBeNull();
    });
  });

  describe('Position', () => {
    it('should render position when provided', () => {
      render(<TxDetailsOther { ...defaultProps }/>);

      expect(screen.getByText('Position:')).toBeTruthy();
      expect(screen.getByText('5')).toBeTruthy();
    });

    it('should not render position when position is null', () => {
      render(<TxDetailsOther { ...defaultProps } position={ null }/>);

      expect(screen.queryByText('Position:')).toBeNull();
    });
  });

  describe('Transaction Size', () => {
    it('should render transaction size when rawInput is provided', () => {
      render(<TxDetailsOther { ...defaultProps } rawInput="0x123456"/>);

      expect(screen.getByText('Size:')).toBeTruthy();
      expect(screen.getByText('3 bytes')).toBeTruthy();
    });

    it('should not render transaction size when rawInput is not provided', () => {
      render(<TxDetailsOther { ...defaultProps }/>);

      expect(screen.queryByText('Size:')).toBeNull();
    });

    it('should handle empty rawInput', () => {
      render(<TxDetailsOther { ...defaultProps } rawInput=""/>);

      expect(screen.getByText('Size:')).toBeTruthy();
      expect(screen.getByText('0 bytes')).toBeTruthy();
    });

    it('should handle large transaction size with proper formatting', () => {
      const largeHex = '0x' + '1234567890abcdef'.repeat(100);
      render(<TxDetailsOther { ...defaultProps } rawInput={ largeHex }/>);

      expect(screen.getByText('Size:')).toBeTruthy();
      expect(screen.getByText('800 bytes')).toBeTruthy();
    });
  });

  describe('Combined Functionality', () => {
    it('should render all fields when all props are provided', () => {
      render(
        <TxDetailsOther
          { ...defaultProps }
          queueIndex={ 42 }
          rawInput="0x1234567890abcdef"
        />,
      );

      expect(screen.getByText('Txn type:')).toBeTruthy();
      expect(screen.getByText('Queue index:')).toBeTruthy();
      expect(screen.getByText('Position:')).toBeTruthy();
      expect(screen.getByText('Size:')).toBeTruthy();
      expect(screen.getByText('8 bytes')).toBeTruthy();
    });

    it('should render only nonce when minimal props are provided', () => {
      render(<TxDetailsOther nonce={ 123 } type={ null } position={ null }/>);

      expect(screen.queryByText('Txn type:')).toBeNull();
      expect(screen.getByText('Nonce:')).toBeTruthy();
      expect(screen.queryByText('Position:')).toBeNull();
      expect(screen.queryByText('Size:')).toBeNull();
    });
  });
});
