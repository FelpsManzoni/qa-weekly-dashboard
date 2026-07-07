import React from 'react';

export interface TableProps {
  columns: string[];
  rows: (string | React.ReactNode)[][];
  striped?: boolean;
}

export function Table(props: TableProps): JSX.Element;
