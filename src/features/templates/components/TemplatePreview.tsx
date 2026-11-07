import Image from 'next/image';
import { ArrowUpRight, Phone } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export interface TemplatePreviewButton {
  type: string;
  label: string;
}

interface Props {
  message: string;
  /** Buttons rendered under the message bubble (quick replies, links, call buttons). */
  previewData?: TemplatePreviewButton[];
  previewImage?: string | null;
  className?: string;
}

const ButtonIcon = ({ type }: { type: string }) => {
  if (type === 'externalLinks') return <ArrowUpRight size={20} />;
  if (type === 'phoneNumber') return <Phone size={20} />;
  return null;
};

/** Phone-style mockup of how a WhatsApp template message will look to the recipient. */
const TemplatePreview = ({ message, previewData = [], previewImage, className }: Props) => (
  <div className={cn('hidden w-[387px] flex-shrink-0 place-items-center bg-primary-200 md:grid', className)}>
    <div className="w-[275px]">
      <h4 className="rounded-t-3xl bg-[#046960] px-6 py-5 font-bold text-white">Preview</h4>
      <div className="relative h-[416px] rounded-b-3xl bg-[#EFE7DE]">
        <div className="absolute left-4 right-4 top-1/2 z-10 -translate-y-1/2 transform">
          <div className="mb-4 rounded bg-white p-1 shadow-[0_1px_3px_#081A0433]">
            {previewImage && (
              <Image
                src={previewImage}
                alt=""
                width={235}
                height={144}
                unoptimized
                className="h-[144px] w-full rounded-lg object-cover"
              />
            )}
            <div className="grid min-h-[32px] grid-cols-[1fr_26px] gap-x-1">
              <div className="whitespace-pre-wrap break-all text-sm">{message}</div>
              <small className="mt-auto text-[10px] text-black/15">11:00</small>
            </div>
          </div>
          <div className="space-y-2">
            {previewData.map(({ type, label }, index) => (
              <div
                key={`${type}-${index}`}
                className="grid min-h-[40px] place-items-center rounded bg-white text-sm font-semibold text-blue-700"
              >
                <div className="flex items-center gap-x-2">
                  {label}
                  {label && <ButtonIcon type={type} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TemplatePreview;
