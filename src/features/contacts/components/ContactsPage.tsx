'use client';

import { useContacts } from '@/features/contacts/hooks';
import ContactsTable from '@/features/contacts/components/ContactsTable';
import { useContactColumns } from '@/features/contacts/components/useContactColumns';

const ContactsPage = () => {
  const { data: contacts } = useContacts();
  const columns = useContactColumns();

  if (!contacts) return null;

  return <ContactsTable columns={columns} data={contacts} />;
};

export default ContactsPage;
