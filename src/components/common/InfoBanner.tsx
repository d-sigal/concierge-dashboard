'use client';
import { FC, PropsWithChildren } from 'react';
import { X } from '@phosphor-icons/react';

interface Props extends PropsWithChildren {
  onClose: () => void;
}

const InfoBanner: FC<Props> = ({ children, onClose }) => {
  return (
    <div className="flex justify-between rounded-lg border border-purple-300 bg-purple-50 px-4 py-3 text-sm font-medium lg:items-center">
      {children}
      <X className="cursor-pointer text-brand-400" onClick={onClose} size={20} />
    </div>
  );
};

export default InfoBanner;
