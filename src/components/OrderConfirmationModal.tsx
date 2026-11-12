import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle,
  Truck,
  Package,
  Printer,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Send,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const OrderConfirmationModal: React.FC = () => {
  const { currentOrder, notifications, ownerConfig, setActivePage, showToast } = useStore();
  const [showPayloadDetails, setShowPayloadDetails] = useState(false);
  const [copiedType, setCopiedType] = useState<'sms' | 'email' | null>(null);

  if (!currentOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-[#121212] mb-2">No active order found</h2>
        <button
          onClick={() => setActivePage('catalog')}
          className="bg-[#121212] text-white px-5 py-2.5 text-xs font-semibold cursor-pointer"
        >
          Browse Catalogue
        </button>
      </div>
    );
  }

  // Find the notification for this specific order
  const orderNotif = notifications.find(n => n.orderId === currentOrder.id);

  const handlePrint = () => {
    window.print();
  };

  const copyText = (text: string, type: 'sms' | 'email') => {
    navigator.clipboard?.writeText(text);
    setCopiedType(type);
    showToast(`${type === 'sms' ? 'SMS text' : 'Email content'} copied to clipboard`);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="py-12 sm:py-20 bg-[#FDFBF7]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Receipt Container */}
        <div className="bg-white border border-[#E5DECF] shadow-lg p-6 sm:p-10 space-y-8" id="printable-receipt">
          
          {/* Header Status */}
          <div className="text-center space-y-3 pb-6 border-b border-[#ECE5D8]">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#8E877D] font-bold">
                SANGM'S · TODINAGAR, SIKAR
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121212] font-heading">
                Order Confirmed
              </h1>
              <p className="text-xs text-[#737373]">
                Thank you for your order, <strong>{currentOrder.customer.fullName}</strong>.
              </p>
            </div>

            {/* Official Order Callout */}
            <div className="inline-flex items-center gap-2 bg-[#FAF8F5] border border-[#DDD3C2] px-4 py-2.5 text-xs text-[#262626] max-w-lg mx-auto text-left shadow-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Official Order Placed:</strong> Your order has been recorded. Full details have been drafted to <strong>WhatsApp (+91 9799896438)</strong> and sent to store dispatch in Todinagar, Sikar.
              </span>
            </div>
          </div>

          {/* STORE OWNER NOTIFICATION STATUS (SMS & EMAIL) */}
          <div className="bg-[#121212] text-white p-5 sm:p-6 border border-[#2B2B2B] shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2A2A2A] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#C5A880]/20 text-[#C5A880] flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Store Owner Order Alert Dispatched
                    </h3>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A3A3A3] mt-0.5">
                    Order notifications triggered to phone <strong>+91 {ownerConfig.ownerPhone}</strong> and email <strong>{ownerConfig.ownerEmail}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#A3A3A3]">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Immediate Delivery Protocol</span>
              </div>
            </div>

            {/* Notification channels preview & quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Channel 1: SMS on 9799896438 */}
              <div className="bg-[#1B1B1B] p-3.5 border border-[#333333] flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span className="flex items-center gap-1.5 text-[#C5A880]">
                      <MessageSquare className="w-3.5 h-3.5" />
                      SMS on Mobile
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Dispatched</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#D4D4D4] mt-1 font-bold">
                    +91 {ownerConfig.ownerPhone}
                  </div>
                  <p className="text-[10px] text-[#888888] mt-1 line-clamp-2">
                    {orderNotif?.smsBody || 'Order reference and customer address details'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-[#2A2A2A]">
                  <a
                    href={orderNotif?.smsUrl || `sms:+91${ownerConfig.ownerPhone}`}
                    className="flex-1 bg-[#262626] hover:bg-[#333333] text-white text-[11px] font-semibold py-1.5 px-2.5 text-center flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Send className="w-3 h-3 text-[#C5A880]" />
                    <span>Send SMS</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => orderNotif && copyText(orderNotif.smsBody, 'sms')}
                    title="Copy SMS text"
                    className="p-1.5 bg-[#262626] hover:bg-[#333333] text-[#A3A3A3] hover:text-white cursor-pointer"
                  >
                    {copiedType === 'sms' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Channel 2: WhatsApp to 9799896438 */}
              <div className="bg-[#1B1B1B] p-3.5 border border-[#333333] flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Phone className="w-3.5 h-3.5" />
                      WhatsApp Fast Alert
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Instant</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#D4D4D4] mt-1 font-bold">
                    +91 {ownerConfig.ownerPhone}
                  </div>
                  <p className="text-[10px] text-[#888888] mt-1">
                    Direct WhatsApp notification with items and delivery address.
                  </p>
                </div>

                <div className="pt-2 border-t border-[#2A2A2A]">
                  <a
                    href={orderNotif?.whatsappUrl || `https://api.whatsapp.com/send?phone=91${ownerConfig.ownerPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-semibold py-1.5 px-2.5 text-center flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Channel 3: Email to homelander69.brrbrrpatapim@gmail.com */}
              <div className="bg-[#1B1B1B] p-3.5 border border-[#333333] flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span className="flex items-center gap-1.5 text-[#C5A880]">
                      <Mail className="w-3.5 h-3.5" />
                      Email Alert
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Queued</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#D4D4D4] mt-1 truncate font-bold" title={ownerConfig.ownerEmail}>
                    {ownerConfig.ownerEmail}
                  </div>
                  <p className="text-[10px] text-[#888888] mt-1 line-clamp-2">
                    Formatted invoice receipt & customer details slip.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-[#2A2A2A]">
                  <a
                    href={orderNotif?.emailUrl || `mailto:${ownerConfig.ownerEmail}`}
                    className="flex-1 bg-[#262626] hover:bg-[#333333] text-white text-[11px] font-semibold py-1.5 px-2.5 text-center flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Mail className="w-3 h-3 text-[#C5A880]" />
                    <span>Open Mail</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => orderNotif && copyText(orderNotif.emailBody, 'email')}
                    title="Copy Email body"
                    className="p-1.5 bg-[#262626] hover:bg-[#333333] text-[#A3A3A3] hover:text-white cursor-pointer"
                  >
                    {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Toggle Full Payload Details */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowPayloadDetails(!showPayloadDetails)}
                className="inline-flex items-center gap-1 text-[11px] text-[#C5A880] hover:text-white cursor-pointer underline"
              >
                {showPayloadDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{showPayloadDetails ? 'Hide full alert message contents' : 'View full SMS & Email message preview'}</span>
              </button>

              {showPayloadDetails && orderNotif && (
                <div className="mt-3 p-3 bg-[#0A0A0A] border border-[#262626] text-[11px] font-mono text-[#D5CDBD] space-y-3">
                  <div>
                    <span className="text-[#888888] block mb-1 font-bold">SMS Payload (Phone: +91 {ownerConfig.ownerPhone}):</span>
                    <pre className="whitespace-pre-wrap bg-[#141414] p-2.5 border border-[#222222] text-[#E0E0E0]">
                      {orderNotif.smsBody}
                    </pre>
                  </div>
                  <div>
                    <span className="text-[#888888] block mb-1 font-bold">Email Subject & Body ({ownerConfig.ownerEmail}):</span>
                    <div className="text-[#C5A880] font-semibold mb-1">{orderNotif.emailSubject}</div>
                    <pre className="whitespace-pre-wrap bg-[#141414] p-2.5 border border-[#222222] text-[#CCCCCC] max-h-48 overflow-y-auto">
                      {orderNotif.emailBody}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reference Numbers & Dates */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#FAF8F5] border border-[#EBE4D5] text-xs">
            <div>
              <span className="text-[#888888] block text-[11px]">Order Reference</span>
              <span className="font-mono font-bold text-[#121212] text-sm">{currentOrder.id}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[11px]">Date & Time</span>
              <span className="font-medium text-[#121212]">
                {new Date(currentOrder.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div>
              <span className="text-[#888888] block text-[11px]">Payment Method</span>
              <span className="font-medium text-[#121212]">{currentOrder.paymentMethod}</span>
              {currentOrder.paymentDetails?.utrNumber && (
                <span className="text-[10px] text-[#666] block font-mono">UTR: {currentOrder.paymentDetails.utrNumber}</span>
              )}
              {currentOrder.paymentDetails?.cardBrand && (
                <span className="text-[10px] text-[#666] block font-mono">{currentOrder.paymentDetails.cardBrand} •••• {currentOrder.paymentDetails.cardLast4}</span>
              )}
              {currentOrder.paymentDetails?.bankName && (
                <span className="text-[10px] text-[#666] block">{currentOrder.paymentDetails.bankName}</span>
              )}
            </div>
            <div>
              <span className="text-[#888888] block text-[11px]">Estimated Delivery</span>
              <span className="font-bold text-emerald-800">3–5 Business Days</span>
            </div>
          </div>

          {/* Real Payment Status Callout Banner */}
          {currentOrder.paymentMethod === 'Cash on Delivery (COD)' ? (
            <div className="bg-amber-50/80 border border-amber-200 p-3.5 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <div>
                <span className="font-bold text-[#121212] block">Payment Method: Cash on Delivery</span>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Please keep exact cash of <strong>₹{currentOrder.total.toLocaleString('en-IN')}</strong> ready for our Sikar dispatch agent.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold bg-white text-amber-900 px-2.5 py-1 border border-amber-300 shrink-0 text-center">
                Pay on Handover
              </span>
            </div>
          ) : (
            <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <div>
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  Real Payment Received & Verified
                </span>
                <p className="text-[11px] text-emerald-800 mt-0.5 font-mono">
                  {currentOrder.paymentDetails?.utrNumber ? `UPI Ref: ${currentOrder.paymentDetails.utrNumber}` :
                   currentOrder.paymentDetails?.cardBrand ? `${currentOrder.paymentDetails.cardBrand} Card Ending •••• ${currentOrder.paymentDetails.cardLast4} (Txn: ${currentOrder.paymentDetails.transactionId})` :
                   currentOrder.paymentDetails?.bankName ? `Net Banking: ${currentOrder.paymentDetails.bankName} (Txn: ${currentOrder.paymentDetails.transactionId})` :
                   'Prepaid Transaction Completed'}
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold bg-white text-emerald-800 px-2.5 py-1 border border-emerald-300 shrink-0 text-center">
                PAID ₹{currentOrder.total.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {/* Shipping Destination & Dispatch Hub */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#404040]">
            <div className="space-y-1.5 p-4 border border-[#ECE5D8] bg-[#FFF]">
              <div className="font-bold text-[#121212] flex items-center gap-1.5 mb-2">
                <MapPin className="w-4 h-4 text-[#C5A880]" />
                <span>Delivery Address</span>
              </div>
              <p className="font-semibold text-black">{currentOrder.customer.fullName}</p>
              <p>{currentOrder.customer.addressLine}</p>
              {currentOrder.customer.landmark && <p>Landmark: {currentOrder.customer.landmark}</p>}
              <p>{currentOrder.customer.city}, {currentOrder.customer.state} — {currentOrder.customer.pinCode}</p>
              <p className="pt-1 text-[#666666]">Phone: +91 {currentOrder.customer.phone} · {currentOrder.customer.email}</p>
            </div>

            <div className="space-y-1.5 p-4 border border-[#ECE5D8] bg-[#FFF]">
              <div className="font-bold text-[#121212] flex items-center gap-1.5 mb-2">
                <Truck className="w-4 h-4 text-[#C5A880]" />
                <span>Fulfillment & Dispatch Hub</span>
              </div>
              <p className="font-semibold text-black">SANGM'S Sikar Warehouse Hub</p>
              <p>Todinagar Main Complex, Sikar, Rajasthan — 332001</p>
              {currentOrder.assignedAgentName ? (
                <div className="bg-emerald-50 border border-emerald-200 p-2 mt-1">
                  <span className="font-bold text-emerald-800 block text-[11px]">Assigned Delivery Agent:</span>
                  <p className="text-black font-semibold">{currentOrder.assignedAgentName}</p>
                  <p className="text-[11px] font-mono text-[#555555]">Phone: +91 {currentOrder.assignedAgentPhone}</p>
                </div>
              ) : (
                <p className="text-[#666666]">Local Sikar Dispatch Network · Todinagar Hub</p>
              )}
              <p className="font-mono text-[#8C6D44] font-semibold">Tracking ID: {currentOrder.trackingNumber}</p>
            </div>
          </div>

          {/* Itemized Order Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#121212] font-heading border-b border-[#ECE5D8] pb-2">
              Purchased Items
            </h3>

            <div className="divide-y divide-[#F0EAE1]">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover object-center bg-[#F5F2EB] border border-[#E5DECF] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="font-semibold text-[#121212]">{item.product.name}</div>
                      <div className="text-[11px] text-[#737373]">
                        Size: <span className="font-mono font-bold text-black">{item.selectedSize}</span> · Colour: {item.selectedColor.name} · Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-[#121212] text-sm tabular-nums">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Math */}
            <div className="border-t border-[#ECE5D8] pt-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#666666]">
                <span>Items Subtotal</span>
                <span className="font-mono tabular-nums text-[#121212]">₹{currentOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums">-₹{currentOrder.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#666666]">
                <span>Shipping</span>
                <span className="font-mono tabular-nums">
                  {currentOrder.shippingFee === 0 ? 'FREE' : `₹${currentOrder.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#E8E2D5] text-base font-bold text-[#121212]">
                <span>Total Amount</span>
                <span className="text-xl font-mono tabular-nums text-black">
                  ₹{currentOrder.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-[#ECE5D8] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 border border-[#D5CDBD] bg-white hover:bg-[#FAF8F5] text-[#121212] px-5 py-3 text-xs font-semibold cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Invoice Slip</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActivePage('admin')}
                className="inline-flex items-center gap-2 bg-[#F5F2EB] hover:bg-[#EFEBE1] text-[#121212] border border-[#DDD3C2] px-5 py-3 text-xs font-semibold cursor-pointer"
              >
                <span>View in Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActivePage('catalog')}
                className="inline-flex items-center gap-2 bg-[#121212] hover:bg-[#2B2B2B] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
              >
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
