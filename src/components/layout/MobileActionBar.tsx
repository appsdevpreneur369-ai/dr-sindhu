import { BookButton } from '../booking/BookButton';
import { Icon, WhatsAppIcon } from '../ui/Icon';

/** Sticky bottom bar on phones: Book · Call · WhatsApp. Call/WhatsApp are omitted while their numbers are placeholders. */
export function MobileActionBar({ callHref, whatsappHref }: { callHref: string | null; whatsappHref: string | null }) {
  const cols = 1 + Number(!!callHref) + Number(!!whatsappHref);
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur md:hidden">
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        <BookButton className="btn-cta !min-h-[48px] !px-3 text-[0.95rem]">
          <Icon name="calendar-check" className="h-4 w-4" /> {cols === 1 ? 'Book online' : 'Book'}
        </BookButton>
        {callHref && (
          <a href={callHref} className="btn-ghost !min-h-[48px] !px-3 text-[0.95rem]">
            <Icon name="phone" className="h-4 w-4" /> Call
          </a>
        )}
        {whatsappHref && (
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-whatsapp !min-h-[48px] !px-3 text-[0.95rem]">
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
