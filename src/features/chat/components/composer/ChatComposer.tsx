'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { PaperPlaneTilt } from '@phosphor-icons/react';
import { FileTextIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ChannelKey, Conversation, Message, Template } from '@/lib/api/types';
import { WHATSAPP } from '@/lib/channels';
import { useSendMessage, useSetHandover } from '@/features/chat/hooks';
import ChannelSelector from '@/features/chat/components/composer/ChannelSelector';
import TemplatePicker from '@/features/chat/components/composer/TemplatePicker';
import SwitchToManualChatModal from '@/features/chat/components/conversation/SwitchToManualChatModal';

const MAX_TEXTAREA_HEIGHT = 300;
const TEMPLATE_TRIGGER = '/';

interface Props {
  leadId: string;
  conversation: Conversation;
  /** Newest first. */
  messages: Message[];
}

const ChatComposer = ({ leadId, conversation, messages }: Props) => {
  // Reply on the channel the conversation last happened on; new conversations start on WhatsApp.
  const latestMessage = messages[0];
  const latestChannel = latestMessage?.channel ?? WHATSAPP;
  const [channel, setChannel] = useState<ChannelKey>(latestChannel);
  const [message, setMessage] = useState('');
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [isTemplatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isFocused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { mutate: sendMessage, isPending: isSending } = useSendMessage(leadId);
  const { mutateAsync: setHandover, isPending: isHandingOver } = useSetHandover();

  // Meta only allows templates once WhatsApp's 24h customer-service window has closed.
  const requiresTemplate = channel === WHATSAPP && !conversation.free_message_allowed;

  useEffect(() => {
    setChannel(latestChannel);
  }, [latestMessage?.id, latestChannel]);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight - 24, MAX_TEXTAREA_HEIGHT)}px`;
  }, [message]);

  const reset = () => {
    setMessage('');
    setTemplateId(null);
  };

  const canSend = () => {
    if (!message.trim()) return false;
    if (requiresTemplate && !templateId) {
      setTemplatePickerOpen(true);
      return false;
    }
    return true;
  };

  const send = () => {
    sendMessage(
      { body: message, channel, template_id: requiresTemplate ? templateId : null },
      { onSuccess: reset },
    );
  };

  const requestSend = () => {
    if (isSending || !canSend()) return;
    if (conversation.transferred_to_human) send();
    else setConfirmOpen(true);
  };

  const switchToManualAndSend = async () => {
    try {
      await setHandover({ leadId, toHuman: true });
    } catch {
      return;
    }
    setConfirmOpen(false);
    send();
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const next = event.target.value;

    if (requiresTemplate && !next.endsWith(TEMPLATE_TRIGGER)) {
      // Free text can't be sent: the field only holds a selected template. Deleting clears it.
      if (next.length < message.length) reset();
      return;
    }

    setMessage(next);
    if (next.endsWith(TEMPLATE_TRIGGER)) setTemplatePickerOpen(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      requestSend();
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    requestSend();
  };

  const selectTemplate = (template: Template) => {
    setTemplatePickerOpen(false);
    setMessage(template.message);
    setTemplateId(template.id);
    textareaRef.current?.focus();
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      {requiresTemplate && (
        <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-x-4 rounded-xl border border-strokes-info bg-blue-50 p-3 text-sm font-medium">
          <p className="font-medium">
            Over 24 hours have passed since the client’s last message. Messaging on WhatsApp now requires a
            template, according to Meta’s rules.
          </p>
        </div>
      )}
      <TemplatePicker
        open={isTemplatePickerOpen}
        onOpenChange={setTemplatePickerOpen}
        onSelect={selectTemplate}
        leadId={leadId}
      />
      <div className="group relative flex flex-1 items-center gap-2 rounded-xl border border-strokes bg-white py-1.5 pl-2.5 pr-1.5 transition-colors focus-within:border-brand-500 hover:border-icon-light">
        <Button
          type="button"
          size="auto"
          variant="smallIcon"
          className="size-7"
          aria-label="Insert template"
          onClick={() => setTemplatePickerOpen((isOpen) => !isOpen)}
        >
          <FileTextIcon size={16} />
        </Button>
        <textarea
          ref={textareaRef}
          value={message}
          placeholder={`Press ${TEMPLATE_TRIGGER} to start with a template`}
          className="h-6 max-h-[300px] w-[87%] resize-none bg-inherit placeholder:text-primary-800 placeholder:opacity-100 focus-visible:outline-none"
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute right-[5px] top-1/2 flex -translate-y-1/2 transform items-center justify-between">
          <ChannelSelector
            value={channel}
            onChange={setChannel}
            isCompact={isFocused || message.length > 0}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="inline-flex h-4 !bg-transparent"
            aria-label="Send message"
            disabled={isSending}
          >
            <PaperPlaneTilt
              weight="fill"
              className="text-primary-700 transition-colors hover:text-primary"
              size={20}
            />
          </Button>
        </div>
      </div>
      <SwitchToManualChatModal
        open={isConfirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={switchToManualAndSend}
        confirmLabel="Switch and send"
        isPending={isHandingOver || isSending}
      />
    </form>
  );
};

export default ChatComposer;
