import { getDateLabel } from '@/features/chat/utils';
import ChannelLabel from '@/features/chat/components/ChannelLabel';

interface Props {
  dateCreated: string;
  channel: string;
}

const DateAndChannelIndicator = ({ dateCreated, channel }: Props) => (
  <div className="mx-auto flex w-fit gap-1 rounded-full border border-strokes bg-white py-0.5 pl-2 pr-1 text-center text-[10px] font-medium leading-4 text-text-secondary">
    {`${getDateLabel(dateCreated)},`}
    <ChannelLabel channel={channel} />
  </div>
);

export default DateAndChannelIndicator;
