import { Order, OrderNotification, OwnerNotificationConfig, DeliveryAgent } from '../types';

export const DEFAULT_OWNER_CONFIG: OwnerNotificationConfig = {
  ownerPhone: '9799896438',
  ownerEmail: 'homelander69.brrbrrpatapim@gmail.com',
  upiVpa: '9799896438@upi',
  enableSms: true,
  enableEmail: true,
  enableWhatsapp: true
};

/**
 * Builds clean SMS and Email notification payload for SANGM'S store owner
 */
export function buildOrderNotification(
  order: Order,
  config: OwnerNotificationConfig = DEFAULT_OWNER_CONFIG
): OrderNotification {
  const cleanPhone = config.ownerPhone.replace(/[\s-+]/g, '').slice(-10);
  const itemsSummary = order.items
    .map(
      (item) =>
        `• ${item.quantity}x ${item.product.name} (Size: ${item.selectedSize}, ₹${(
          item.product.price * item.quantity
        ).toLocaleString('en-IN')})`
    )
    .join('\n');

  // Format real payment identifier for SMS
  let paymentMeta = `${order.paymentMethod} - ${order.paymentStatus}`;
  if (order.paymentDetails?.utrNumber) {
    paymentMeta += ` (UTR: ${order.paymentDetails.utrNumber})`;
  } else if (order.paymentDetails?.transactionId) {
    paymentMeta += ` (Txn: ${order.paymentDetails.transactionId})`;
  } else if (order.paymentMethod === 'Cash on Delivery (COD)') {
    paymentMeta += ` [Collect ₹${order.total.toLocaleString('en-IN')} in cash at doorstep]`;
  }

  // Short, punchy SMS text suited for standard SMS limits
  const smsBody = `🛍️ SANGM'S NEW ORDER!
Order: ${order.id}
Amount: ₹${order.total.toLocaleString('en-IN')}
Payment: ${paymentMeta}
Customer: ${order.customer.fullName}
Customer Phone: +91 ${order.customer.phone}
Address: ${order.customer.addressLine}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pinCode}
Items (${order.items.length}):
${itemsSummary}
Dispatch: Todinagar Hub, Sikar, Rajasthan`;

  // Detailed email subject & formatted body
  const emailSubject = `[SANGM'S NEW ORDER] #${order.id} - ₹${order.total.toLocaleString('en-IN')} (${order.paymentStatus}) from ${order.customer.fullName}`;

  const emailBody = `SANGM'S ONLINE STORE - NEW CUSTOMER ORDER ALERT
==================================================
Date: ${new Date(order.createdAt).toLocaleString('en-IN')}
Order Reference: ${order.id}
Payment Method: ${order.paymentMethod}
Payment Status: ${order.paymentStatus}
${order.paymentDetails?.transactionId ? `Transaction ID: ${order.paymentDetails.transactionId}\n` : ''}${order.paymentDetails?.utrNumber ? `UPI UTR / Ref No: ${order.paymentDetails.utrNumber}\n` : ''}${order.paymentDetails?.cardBrand ? `Card: ${order.paymentDetails.cardBrand} Ending in ${order.paymentDetails.cardLast4}\n` : ''}${order.paymentDetails?.bankName ? `Net Banking: ${order.paymentDetails.bankName}\n` : ''}${order.paymentMethod === 'Cash on Delivery (COD)' ? `COD Instruction: Collect exact cash ₹${order.total.toLocaleString('en-IN')} upon delivery\n` : ''}Total Payable: ₹${order.total.toLocaleString('en-IN')}

CUSTOMER INFORMATION
--------------------
Name: ${order.customer.fullName}
Mobile Phone: +91 ${order.customer.phone}
Email Address: ${order.customer.email}

DELIVERY DESTINATION
--------------------
Address: ${order.customer.addressLine}
${order.customer.landmark ? `Landmark: ${order.customer.landmark}\n` : ''}City: ${order.customer.city}
State: ${order.customer.state}
PIN Code: ${order.customer.pinCode}

ORDERED ITEMS
-------------
${itemsSummary}

Order Breakdown:
- Items Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}
- Coupon Savings: -₹${order.discount.toLocaleString('en-IN')}
- Express Shipping: ₹${order.shippingFee.toLocaleString('en-IN')}
- Total Amount: ₹${order.total.toLocaleString('en-IN')}

DISPATCH HUB
------------
SANGM'S Fulfillment Centre, Todinagar, Sikar, Rajasthan — 332001
Tracking ID: ${order.trackingNumber || 'Assigned on dispatch'}
==================================================`;

  // Construct links
  const smsUrl = `sms:+91${cleanPhone}?body=${encodeURIComponent(smsBody)}`;
  // WhatsApp API URL compatible with both Web and Mobile
  const whatsappUrl = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(smsBody)}`;
  const emailUrl = `mailto:${config.ownerEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return {
    id: `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    orderId: order.id,
    timestamp: new Date().toISOString(),
    recipientEmail: config.ownerEmail,
    recipientPhone: config.ownerPhone,
    customerName: order.customer.fullName,
    customerPhone: order.customer.phone,
    orderTotal: order.total,
    paymentMethod: order.paymentMethod,
    smsBody,
    emailSubject,
    emailBody,
    status: 'Sent',
    smsUrl,
    whatsappUrl,
    emailUrl
  };
}

/**
 * Builds WhatsApp dispatch manifest message for assigned delivery agent
 */
export function buildAgentDeliveryWhatsApp(order: Order, agent: DeliveryAgent): string {
  const cleanPhone = agent.phone.replace(/[\s-+]/g, '').slice(-10);
  const itemsText = order.items
    .map((i) => `• ${i.quantity}x ${i.product.name} (${i.selectedSize}, ${i.selectedColor.name})`)
    .join('\n');

  const isCod = order.paymentMethod === 'Cash on Delivery (COD)';
  const paymentText = isCod
    ? `💵 CASH ON DELIVERY: Collect ₹${order.total.toLocaleString('en-IN')} in cash at doorstep`
    : `✅ PREPAID ORDER (${order.paymentMethod}): ₹${order.total.toLocaleString('en-IN')} received in advance. Collect ₹0.`;

  const msg = `🛵 SANGM'S DELIVERY ASSIGNMENT
Hello ${agent.name}, you have been assigned an order for delivery:
Order Reference: ${order.id}
Customer Name: ${order.customer.fullName}
Customer Phone: +91 ${order.customer.phone}
Delivery Address: ${order.customer.addressLine}, ${order.customer.city} - ${order.customer.pinCode}
${order.customer.landmark ? `Landmark: ${order.customer.landmark}\n` : ''}${paymentText}
Payment Status: ${order.paymentStatus}
${order.paymentDetails?.transactionId ? `Txn Ref: ${order.paymentDetails.transactionId}\n` : ''}${order.paymentDetails?.utrNumber ? `UPI UTR: ${order.paymentDetails.utrNumber}\n` : ''}Items:
${itemsText}
Fulfillment Hub: Todinagar Hub, Sikar, Rajasthan`;

  return `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(msg)}`;
}
