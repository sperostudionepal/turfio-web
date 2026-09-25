# Split Payment — archived UI design (not wired up)

The split-share payment feature was removed from the product on 2026-09-23
(server commit `4e516d9`, client commit `25aeba1`, both on branch
`fix/admin-revamp`). The functionality was fully working end-to-end, not
dead code, so removing it required real surgery — see those two commits
for the complete diff, including the backend (routes, services, models).

**This file exists only to preserve the UI design**, which was considered
good and worth keeping for reference if/when the feature comes back. It is
Markdown, not `.jsx` — deliberately, so it is never picked up by ESLint or
the Vite build and can never cause a lint or compile error. Nothing here is
imported by the app. To revive it, copy the relevant JSX back into
`BookingCheckoutPage.jsx`, reconnect the removed `turfService` calls
(`convertToSplitPayment`, `getSplitPaymentDetails`, `initiateSplitSharePayment`
— see client commit `25aeba1`'s parent for their bodies) and restore the
backend routes from server commit `4e516d9`'s parent.

To get the full original file as it stood before removal:

```bash
git show 25aeba1^:src/pages/bookings/BookingCheckoutPage.jsx
```

---

## 1. Payment method selector card

The (already-disabled-at-removal-time, commented out) entry in the
`paymentMethods` array that made "Split Payment" selectable alongside
"Pay Full Amount" / "Pay at Venue":

```jsx
{
  id: 'split',
  label: 'Split Payment',
  badge: 'Squad Split',
  description: 'Split cost with teammates via link or WhatsApp',
  icon: Users,
  available: true,
},
```

## 2. Squad Payment Progress widget (booking confirmation screen)

Shown on the confirmation screen once a split booking exists. Progress bar +
"Captain paid" line + shareable link box with copy button.

```jsx
{/* Split Payment Progress & Share Section */}
{formData.paymentType === 'split' && (
  <div className="mt-3 rounded-xl bg-lime-50/70 p-4 space-y-3 border border-lime-100">
    <div className="flex items-center justify-between text-xs">
      <span className="font-bold text-slate-900 flex items-center gap-1.5">
        <Users className="h-4 w-4 text-lime-700" />
        Squad Payment Progress
      </span>
      <span className="font-extrabold text-lime-800 bg-lime-200/80 px-2.5 py-0.5 rounded-md">
        1 of {splitPayers} Paid
      </span>
    </div>

    <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
      <div
        className="h-full bg-lime-500 rounded-full transition-all"
        style={{ width: `${Math.round((1 / splitPayers) * 100)}%` }}
      />
    </div>

    <div className="flex items-center justify-between text-xs text-slate-600">
      <span>Captain Paid: NPR {yourShare.toLocaleString()}</span>
      <span className="font-bold text-amber-700">
        NPR {remainingShare.toLocaleString()} Remaining
      </span>
    </div>

    <div className="pt-1">
      <p className="text-xs font-semibold text-slate-700 mb-1.5">
        Share this payment link with teammates (NPR {perTeammateShare} each):
      </p>
      <div className="flex items-center gap-2 max-w-lg">
        <input
          type="text"
          readOnly
          value={paymentShareUrl}
          className="flex-1 bg-white rounded-lg px-3 py-2 text-xs text-slate-700 border border-slate-200 select-all outline-none"
        />
        <button
          type="button"
          onClick={handleCopyLink}
          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
        >
          {copiedLink ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  </div>
)}
```

## 3. "Convert Pay-at-Venue to Split" prompt card

Offered the "switch to split payment" option on a booking that had already
been made as Pay at Venue, without re-booking.

```jsx
{/* Option to convert Pay at Venue booking to Split Payment */}
{formData.paymentType === 'venue' && (
  <div className="mt-3 rounded-xl bg-slate-50 p-4 space-y-2 text-left border border-slate-100">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
        <Users className="h-4 w-4 text-lime-600" /> Want to split payment with squad online?
      </span>
      <button
        type="button"
        disabled={isConvertingToSplit}
        onClick={handleConvertToSplit}
        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
      >
        {isConvertingToSplit ? 'Converting...' : 'Switch to Split Payment'}
      </button>
    </div>
    <p className="text-xs text-slate-500">
      Generate a live payment link for your squad without re-booking or losing your slot.
    </p>
  </div>
)}
```

`handleConvertToSplit` called `turfService.convertToSplitPayment(bookingId, splitPayers)`,
which hit the (also removed) `POST /payments/convert-to-split` backend route.

## 4. Split Payment Calculator drawer (step 3 — Review & Pay)

The main interactive piece: a payer-count picker (2 / 4 / all expected
players), a live share breakdown, and a shareable link with Copy + WhatsApp
share buttons.

```jsx
{/* Interactive Split Payment Drawer */}
{formData.paymentType === 'split' ? (
  <div className="rounded-2xl bg-slate-50 p-5 space-y-4 animate-fadeIn">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-base font-extrabold text-slate-900">
            Split Payment Calculator
          </h4>
          <span className="bg-lime-200/80 text-lime-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
            Smart Split
          </span>
        </div>
        <p className="text-[13px] text-slate-500 font-medium mt-1">
          Pay your share now to lock the slot. Send the link to teammates.
        </p>
      </div>

      {/* Payer Count Selector */}
      <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-200/60 rounded-xl p-1">
        <span className="text-xs font-bold text-slate-600 px-2">Split by:</span>
        {[2, 4, formData.expectedPlayers].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleInputChange('splitPlayersCount', num)}
            className={`px-3 py-1 text-xs sm:text-[13px] font-bold rounded-lg transition-all cursor-pointer ${
              splitPayers === num
                ? 'bg-lime-400 text-slate-950 font-black'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            {num} players
          </button>
        ))}
      </div>
    </div>

    {/* Split Breakdown Numbers */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-xl bg-white p-4 sm:p-5">
        <p className="text-[13px] sm:text-sm font-semibold text-lime-700">
          Your share (pay now)
        </p>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-2xl font-black text-slate-950">
            NPR {yourShare.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-lime-800 bg-lime-100 px-2.5 py-0.5 rounded-md">
            {Math.round((yourShare / totalAmount) * 100)}% of total
          </span>
        </div>
        <p className="text-xs font-medium text-slate-500 mt-1.5">
          Slot is instantly confirmed once your share is paid.
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 sm:p-5">
        <p className="text-[13px] sm:text-sm font-semibold text-slate-600">
          Remaining squad share
        </p>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-2xl font-black text-slate-900">
            NPR {remainingShare.toLocaleString()}
          </span>
          <span className="text-xs sm:text-[13px] font-semibold text-slate-600">
            NPR {perTeammateShare.toLocaleString()} / player
          </span>
        </div>
        <p className="text-xs font-medium text-slate-500 mt-1.5">
          Remaining {splitPayers - 1} players can pay directly via link.
        </p>
      </div>
    </div>

    {/* Shareable Link Box */}
    <div className="space-y-2 pt-1">
      <label className="block text-[13px] sm:text-sm font-semibold text-slate-700">
        Squad Payment Link
      </label>
      <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
        <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3 overflow-hidden">
          <span className="text-xs sm:text-[13px] font-mono font-medium text-slate-600 truncate flex-1 select-all">
            {paymentShareUrl}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          className={`inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all active:scale-95 cursor-pointer ${
            copiedLink
              ? 'bg-lime-400 text-slate-950 font-black'
              : 'bg-white hover:bg-slate-100 text-slate-800'
          }`}
        >
          {copiedLink ? (
            <>
              <CheckCheck className="h-4 w-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Copy Link
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all active:scale-95 cursor-pointer"
        >
          <WhatsAppIcon className="h-4 w-4 fill-white text-white" />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  </div>
) : formData.paymentType === 'venue' ? (
  /* ...unrelated Pay-at-Venue info card, unchanged and still live in BookingCheckoutPage.jsx... */
  null
) : null}
```

Supporting calculations this block depended on:

```js
const splitPayers = formData.splitPlayersCount || 2;
const yourShare = Math.round(totalAmount / splitPayers);
const remainingShare = totalAmount - yourShare;
const perTeammateShare = Math.round(remainingShare / (splitPayers - 1));

const paymentShareUrl = `${window.location.origin}/pay/${activeBookingId}`;

const handleCopyLink = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(paymentShareUrl);
    setCopiedLink(true);
    triggerToast('Match payment link copied!');
    setTimeout(() => setCopiedLink(false), 2500);
  }
};

const handleShareWhatsApp = () => {
  const text = `Hey guys! Let's play at ${venueTitle} on ${selectedDateStr} (${selectedTimeStr} - ${endTimeStr}). Pay your share of NPR ${perTeammateShare} here: ${paymentShareUrl}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
};
```

## 5. Public teammate payment page

A full standalone page (no login required) that a teammate landed on via
the `/pay/:bookingId` link — match summary header, payment progress bar,
and a one-tap eSewa pay-your-share form. Routed from `App.jsx`.

```jsx
export function PublicSplitPaymentPage({ bookingId, onHome }) {
  const { showToast } = useToast();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    turfService
      .getSplitPaymentDetails(bookingId)
      .then((data) => {
        setBooking(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Match not found or expired.');
        setLoading(false);
      });
  }, [bookingId]);

  const handlePayShare = async (e) => {
    e.preventDefault();

    try {
      setIsProcessing(true);
      const res = await turfService.initiateSplitSharePayment(
        booking._id || booking.bookingId,
        booking.perShare
      );

      if (res?.formData && res?.paymentUrl) {
        turfService.submitEsewaForm(res.paymentUrl, res.formData);
      } else {
        throw new Error(res?.message || 'Failed to initiate eSewa payment');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Payment initiation failed. Please try again.', 'error');
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="h-9 w-9 animate-spin text-lime-600 mb-3" />
        <p className="text-sm font-bold text-slate-700">Loading match payment details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-1">Match Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">{error || 'This payment link may be invalid or expired.'}</p>
        <button
          type="button"
          onClick={onHome}
          className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
        >
          Go to Turfio Home
        </button>
      </div>
    );
  }

  const isFullyPaid = booking.paymentStatus === 'Paid' || booking.remainingAmount <= 0;
  const venueTitle = booking.turf?.name || booking.turf?.title || 'Futsal Arena';
  const rawLoc = booking.turf?.location;
  const rawAddr = booking.turf?.address;
  const venueLocation = (typeof rawAddr === 'string' && rawAddr.trim())
    ? rawAddr
    : (rawAddr && typeof rawAddr === 'object' && (rawAddr.area || rawAddr.city))
    ? [rawAddr.area, rawAddr.city].filter(Boolean).join(', ')
    : (typeof rawLoc === 'string' && rawLoc.trim())
    ? rawLoc
    : 'Kathmandu, Nepal';
  const matchDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const progressPercent = Math.min(
    100,
    Math.round(((booking.totalPaidAmount || 0) / (booking.totalAmount || 1)) * 100)
  );

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans text-slate-900 selection:bg-lime-200">
      <Navbar onHome={onHome} />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-lime-400 text-slate-950">
                <Users className="h-3.5 w-3.5" />
                SPLIT PAYMENT
              </span>
              <span className="text-xs text-slate-400 font-medium">Ref: {booking.bookingId}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{venueTitle}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-lime-400 shrink-0" />
              {venueLocation}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
              <div>
                <p className="text-slate-400 text-[11px]">Match Date</p>
                <p className="font-extrabold text-white mt-0.5 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-lime-400" />
                  {matchDate}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px]">Time Slot</p>
                <p className="font-extrabold text-white mt-0.5 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-lime-400" />
                  {booking.timeSlot}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Progress Section */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold text-slate-800">Match Payment Progress</span>
                <span className="font-extrabold text-lime-700 bg-lime-100 px-2.5 py-0.5 rounded-full text-xs">
                  {booking.paidSharesCount} of {booking.totalShares} Shares Paid
                </span>
              </div>

              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-lime-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>Paid: NPR {(booking.totalPaidAmount || 0).toLocaleString()}</span>
                <span className="font-bold text-amber-700">
                  Remaining: NPR {(booking.remainingAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {isFullyPaid ? (
              /* If all shares paid */
              <div className="rounded-2xl bg-lime-50 border border-lime-200 p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-lime-500 text-white flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">All Shares Paid!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Every player has paid their share. The booking is fully settled. See you on the pitch!
                </p>
                <button
                  type="button"
                  onClick={onHome}
                  className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            ) : (
              /* Pay Share Form */
              <form onSubmit={handlePayShare} className="space-y-5">
                <div className="border-t border-slate-100 pt-2">
                  <div className="flex items-baseline justify-between mb-4">
                    <h2 className="text-base font-black text-slate-900">Pay Your Share</h2>
                    <span className="text-xl font-black text-lime-700">
                      NPR {booking.perShare?.toLocaleString()}
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-lime-600 shrink-0" />
                      Instant Teammate Checkout
                    </p>
                    <p>No sign-up or contact details required. Proceed directly to eSewa to pay your share!</p>
                  </div>
                </div>

                {/* Gateway Selection */}
                <div className="rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/40 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#60BB46] flex items-center justify-center shrink-0 shadow-xs">
                      <EsewaIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">eSewa Mobile Wallet</p>
                      <p className="text-[11px] text-slate-500">Pay instant NPR {booking.perShare?.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="h-4 w-4 rounded-full border-4 border-emerald-600 bg-white" />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-12 rounded-2xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-black text-sm transition-all active:scale-[0.99] cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Connecting to eSewa...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4" />
                      <span>Pay NPR {booking.perShare?.toLocaleString()} with eSewa</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-lime-600" />
                  Secured by eSewa Official Gateway & Turfio
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
```

`EsewaIcon` and `WhatsAppIcon` are small inline SVG components that were
defined at the top of `BookingCheckoutPage.jsx` — still there and still
used by the live "Pay with eSewa" flow, so no need to re-archive them.
