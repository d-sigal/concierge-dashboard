import React, { FC, TextareaHTMLAttributes, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { FormField, FormMessage } from '@/components/ui/form';

const AutoHeightTextArea: FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  onChange,
  className,
  required,
  ...fieldProps
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight - 24, 300)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  return (
    <FormField
      name="message"
      rules={{ required: required ? { value: true, message: 'This field is required' } : false }}
      render={({ field: { onChange: onChangeField, value, ...field } }) => (
        <>
          <textarea
            {...fieldProps}
            {...field}
            ref={textareaRef}
            value={value || ''}
            placeholder="Type your messages..."
            className={cn(
              'h-[24px] max-h-[300px] w-full resize-none bg-inherit placeholder:text-primary-800 placeholder:opacity-100 focus-visible:outline-none',
              className,
            )}
            onChange={(event) => {
              onChangeField(event);
              onChange?.(event);
              adjustTextareaHeight();
            }}
          />
          <FormMessage />
        </>
      )}
    />
  );
};

export default AutoHeightTextArea;
