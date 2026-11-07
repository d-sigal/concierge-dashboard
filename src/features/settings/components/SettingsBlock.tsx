import type { PropsWithChildren } from 'react';

interface Props {
  title: string;
  description: string;
}

const SettingsBlock = ({ title, description, children }: PropsWithChildren<Props>) => (
  <div>
    <h3 className="mb-4 text-lg font-semibold">{title}</h3>
    <p className="mb-6 max-w-lg font-medium text-primary-800">{description}</p>
    {children}
  </div>
);

export default SettingsBlock;
