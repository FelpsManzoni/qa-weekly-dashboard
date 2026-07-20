import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  /** Visual style of the button */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

/**
 * @startingPoint section="Components" subtitle="Primary action button with 4 variants" viewport="700x160"
 */
export function Button(props: ButtonProps): JSX.Element;
