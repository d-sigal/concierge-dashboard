import type { Contact } from '@/lib/api/types';
import ContactTypeBadge from '@/features/contacts/components/ContactTypeBadge';

const ContactExpandedRow = ({ contact }: { contact: Contact }) => (
  <div className="p-4 text-sm">
    <div className="grid grid-cols-2 items-center gap-x-2 gap-y-6">
      <span className="text-sm font-semibold">Type</span>
      <ContactTypeBadge type={contact.type} className="px-2 py-1" />
      <span className="text-sm font-semibold">Email:</span>
      <span className="overflow-hidden overflow-ellipsis">{contact.email || '-'}</span>
      <span className="text-sm font-semibold">Phone:</span>
      <span>{contact.phone_number || '-'}</span>
    </div>
  </div>
);

export default ContactExpandedRow;
