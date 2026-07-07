import React from 'react';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Input(props: InputProps): JSX.Element;
