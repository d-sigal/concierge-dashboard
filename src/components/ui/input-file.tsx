'use client';
import React, { useState } from 'react';
import { FormField } from './form';
import { Label } from './label';
import { Input } from '@/components/ui/input';
import { FileArrowUp, Image as ImageIcon, Prohibit } from '@phosphor-icons/react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';

type FileDetails = { imagePreview: string | ArrayBuffer | null; name: string };

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  maxSize: number;
}

const InputFile = ({ name, className, id, maxSize, ...props }: Props) => {
  const {
    setError,
    formState: { errors },
    clearErrors,
    getValues,
  } = useFormContext();
  const fileDetailsDefaultValue = { imagePreview: name ? getValues(name) : null, name: '' };
  const [fileDetails, setFileDetails] = useState<FileDetails>(fileDetailsDefaultValue);
  const inputRef = React.useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.size > maxSize * 1024 * 1024) {
      setError(name ?? '', { type: 'max', message: `The file is too large. Max size: ${maxSize} MB` });
      return;
    }

    if (file && file.type.startsWith('image/')) {
      clearErrors(name ?? '');
      const reader = new FileReader();
      reader.onload = () => {
        setFileDetails({ imagePreview: reader.result, name: file.name });
      };

      reader.readAsDataURL(file);
    }
  };

  const hasError = name && errors[name];

  return (
    <div className={className}>
      <FormField
        name={name || ''}
        render={({ field: { onChange, ref } }) => {
          return (
            <Label htmlFor={id} className="relative w-max">
              <Input
                id={id}
                type="file"
                className="hidden"
                // Must match the image types accepted by the backend logo upload endpoint.
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) => {
                  handleFileChange(e);
                  onChange(e.target.files?.[0]);
                }}
                ref={(element) => {
                  if (typeof ref === 'function') ref(element);
                  if (element) {
                    inputRef.current = element;
                  }
                }}
                {...props}
              />

              <div className="grid grid-cols-[40px_max-content_30px] items-center gap-x-2">
                {fileDetails.imagePreview ? (
                  <img
                    src={fileDetails.imagePreview as string}
                    alt="Image preview"
                    className="size-10 rounded-lg object-contain"
                  />
                ) : (
                  <div className="grid size-10 place-items-center rounded-lg bg-white">
                    {hasError ? <Prohibit size={20} className="text-red-600" /> : <ImageIcon size={20} />}
                  </div>
                )}
                <Button
                  type="button"
                  variant={fileDetails.imagePreview || hasError ? 'secondary' : 'default'}
                  onClick={() => inputRef?.current?.click()}
                >
                  {fileDetails.imagePreview ? (
                    <>Change image</>
                  ) : (
                    <>
                      {hasError ? (
                        <>Retry upload</>
                      ) : (
                        <>
                          Upload <FileArrowUp className="ml-3" size={20} />
                        </>
                      )}
                    </>
                  )}
                </Button>
                {/* FIXME backend does not support logo deletion */}
                {/* {fileDetails.imagePreview && (
                  <div>
                    <Button
                      type="button"
                      size="auto"
                      className="size-7 hover:bg-red-100 hover:text-red-600"
                      variant="smallIcon"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (name) setValue(name, '');
                        setFileDetails({ imagePreview: null, name: '' });
                      }}
                    >
                      <Trash size={20} />
                    </Button>
                  </div>
                )} */}
              </div>
              {fileDetails.name && <small>{fileDetails.name}</small>}
              {hasError && <small className="text-red-700">{hasError?.message as string}</small>}
            </Label>
          );
        }}
      />
    </div>
  );
};

export default InputFile;
