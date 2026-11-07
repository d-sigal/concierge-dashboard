import Image from 'next/image';
import { getChannelOption } from '@/lib/channels';

/** Channel name followed by its icon, e.g. "WhatsApp [icon]". */
const ChannelLabel = ({ channel }: { channel: string }) => {
  const option = getChannelOption(channel);
  if (!option) return null;

  return (
    <div className="flex items-center justify-between">
      {option.title}
      <Image className="ml-1" src={option.icon} alt="" width={16} height={16} />
    </div>
  );
};

export default ChannelLabel;
