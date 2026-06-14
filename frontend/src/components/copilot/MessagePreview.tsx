import React from 'react';
import { Eye, Smartphone } from 'lucide-react';

interface MessagePreviewProps {
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP';
  messageTemplate: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
}

export const MessagePreview: React.FC<MessagePreviewProps> = ({
  channel,
  messageTemplate,
  onChange,
  readOnly = false,
}) => {
  // Compile a demo name to replace the tag
  const previewText = messageTemplate.replace(/{name}/g, 'Aravind Swamy');

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row gap-6">
      {/* Edit Panel */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center space-x-2">
          <Eye className="w-4.5 h-4.5 text-primary" />
          <h4 className="text-sm font-semibold text-text-primary">Message Copy Template</h4>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-text-muted uppercase font-bold">Content Editor</label>
          {readOnly ? (
            <div className="w-full min-h-[120px] p-3 rounded-lg bg-background border border-border text-xs text-text-secondary whitespace-pre-wrap leading-relaxed">
              {messageTemplate}
            </div>
          ) : (
            <textarea
              value={messageTemplate}
              onChange={(e) => onChange && onChange(e.target.value)}
              className="w-full min-h-[120px] p-3 rounded-lg bg-background border border-border focus:border-primary/45 text-xs text-text-primary resize-none focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all leading-relaxed"
              placeholder="Write message copy here. Use {name} for dynamic personalization..."
            />
          )}
        </div>
        <p className="text-[10px] text-text-muted leading-normal">
          Supported variables: <code className="text-primary font-mono">{`{name}`}</code> (customer full name), <code className="text-primary font-mono">{`{cart_url}`}</code> (temporary checkout recovery link).
        </p>
      </div>

      {/* Visual Mobile Phone Mockup */}
      <div className="w-full md:w-[260px] flex flex-col items-center flex-shrink-0">
        <div className="flex items-center space-x-1 mb-2">
          <Smartphone className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-[10px] uppercase font-bold text-text-muted">Live Device Preview</span>
        </div>

        {/* Mobile Shell */}
        <div className="w-[220px] h-[350px] border-4 border-border bg-background rounded-[2rem] p-3 relative shadow-2xl flex flex-col overflow-hidden select-none">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-border rounded-b-xl z-10 flex justify-center">
            <span className="w-1.5 h-1.5 bg-background rounded-full mt-1.5"></span>
          </div>

          {/* Screen Content Wrapper */}
          <div className="flex-1 flex flex-col pt-4 overflow-hidden relative">
            {/* Header of channel simulator */}
            <div className="bg-background/80 border-b border-border p-1.5 text-center text-[9px] font-bold text-text-secondary flex justify-center items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse"></span>
              <span>{channel === 'EMAIL' ? 'Mail Client' : channel === 'SMS' ? 'Messenger' : 'WhatsApp'}</span>
            </div>

            {/* Content area */}
            <div className="flex-1 p-2 overflow-y-auto flex flex-col justify-start">
              {channel === 'EMAIL' ? (
                // Email Client preview
                <div className="bg-card border border-border p-2.5 rounded-lg text-[8px] space-y-1 text-left">
                  <div className="border-b border-border pb-1.5 mb-1.5">
                    <p className="text-[7px] text-text-muted">From: <span className="text-text-secondary">marketing@brand.com</span></p>
                    <p className="text-[7px] text-text-muted font-bold">Subject: <span className="text-text-primary">Exclusive Offer Just For You!</span></p>
                  </div>
                  <p className="text-[9px] text-text-primary font-semibold">Hello Aravind Swamy,</p>
                  <p className="text-text-secondary leading-normal mt-1 whitespace-pre-wrap">{previewText.replace('Hi Aravind Swamy,', '').replace('Hey Aravind Swamy,', '')}</p>
                </div>
              ) : channel === 'SMS' ? (
                // SMS bubble
                <div className="bg-primary text-white p-2.5 rounded-2xl rounded-tr-none text-[9px] max-w-[90%] self-end shadow-md leading-relaxed text-left">
                  {previewText}
                </div>
              ) : (
                // WhatsApp bubble
                <div className="bg-[#128C7E]/20 border border-[#128C7E]/40 text-text-primary p-2.5 rounded-xl rounded-tl-none text-[9px] max-w-[90%] self-start shadow-sm leading-relaxed text-left">
                  <div className="text-[7px] font-semibold text-[#128C7E] mb-0.5">Xeno Business Account</div>
                  {previewText}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MessagePreview;
