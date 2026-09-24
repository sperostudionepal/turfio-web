import AccessibilityModal from './AccessibilityModal';
import AccessibilityTrigger from './AccessibilityTrigger';
import ContinueBookingBanner from './ContinueBookingBanner';
import ChatWidget from '../chat/ChatWidget';

export default function GlobalWidgets() {
  return (
    <>
      <AccessibilityModal />
      <AccessibilityTrigger />
      <ContinueBookingBanner />
      <ChatWidget />
    </>
  );
}
