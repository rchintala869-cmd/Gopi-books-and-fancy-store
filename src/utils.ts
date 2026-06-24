import { CartItem, CustomerDetails } from './types';

export const generateWhatsAppLink = (
  cart: CartItem[],
  deliveryMode: string,
  paymentMode: string,
  customerDetails: CustomerDetails,
  totalAmount: number
) => {
  const phoneNumber = '919704329354';
  let message = `*🌟 New Order for Gopi Books & Fancy Store 🌟*\n\n`;
  
  message += `*👤 Customer Details:*\n`;
  message += `Name: ${customerDetails.name}\n`;
  message += `Phone: ${customerDetails.phone}\n\n`;

  message += `*🛒 Order Items:*\n`;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    message += `${index + 1}. ${item.name}\n`;
    message += `   ₹${item.price} x ${item.quantity} = ₹${itemTotal}\n`;
  });

  message += `\n*💰 Total Amount:* ₹${totalAmount}\n\n`;
  
  message += `*📦 Delivery Mode:* ${deliveryMode}\n`;
  if (deliveryMode === 'Home Delivery' && customerDetails.address) {
    message += `*📍 Address:* ${customerDetails.address}\n`;
  }
  
  message += `\n*💳 Payment Mode:* ${paymentMode}\n`;
  message += `\n_Please confirm my order and provide further instructions!_`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};
