import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export const BigScreensContainer = ({ children, className = '' }: Props) => {
  return <div className={`3xl:mx-auto 3xl:w-bigScreenWidth ${className}`}>{children}</div>;
};
