import React, { FC, PropsWithChildren, ReactElement } from 'react';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Props extends PropsWithChildren {
  id: string;
  value: string;
  title: string;
  description: string;
  icon: ReactElement;
  isActive?: boolean;
}

const SelectableArea: FC<Props> = ({ id, value, title, description, icon, children, isActive }) => {
  const wrapperClass =
    'cursor-pointer rounded-lg border border-brand-300 p-6 transition-all hover:border-brand-400 has-[[data-state=checked]]:border-brand-500';

  const WrapperComponent = ({ children }: PropsWithChildren) =>
    isActive ? (
      <div className={wrapperClass}>{children}</div>
    ) : (
      <Label htmlFor={id} className={wrapperClass}>
        {children}
      </Label>
    );

  return (
    <WrapperComponent>
      <div className="mb-4 grid grid-cols-[16px_1fr_46px] items-center gap-x-4 text-sm font-bold text-basic">
        {icon}
        <div>
          <h3 className="mb-1 font-semibold">{title}</h3>
          <p className="font-medium text-gray-700">{description}</p>
        </div>
        <div className="flex justify-end">
          <RadioGroupItem value={value} id={id} />
        </div>
      </div>
      {children}
    </WrapperComponent>
  );
};

export default SelectableArea;
