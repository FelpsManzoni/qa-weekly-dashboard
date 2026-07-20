import React from 'react';

export interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export function Badge(props: BadgeProps): JSX.Element;
