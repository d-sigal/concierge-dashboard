const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const ContactAvatar = ({ name }: { name: string }) => (
  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-200 text-base font-semibold transition-colors group-hover:bg-white">
    {getInitials(name) || '-'}
  </div>
);

export default ContactAvatar;
