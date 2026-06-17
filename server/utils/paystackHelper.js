const axios = require('axios');
const crypto = require('crypto');

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Initialize payment on Paystack
const initializePayment = async (email, amount, courseId, studentId) => {
  try {
    const reference = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amount * 100, // Convert to kobo
        reference,
        metadata: {
          courseId,
          studentId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      authorizationUrl: response.data.data.authorization_url,
      accessCode: response.data.data.access_code,
      reference,
      amount,
    };
  } catch (error) {
    console.error('Paystack initialization error:', error.message);
    throw new Error(`Paystack error: ${error.message}`);
  }
};

// Verify payment with Paystack
const verifyPayment = async (reference) => {
  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { status, data } = response.data;

    if (status) {
      return {
        success: true,
        paymentStatus: data.status,
        amount: data.amount / 100, // Convert from kobo
        reference: data.reference,
        metadata: data.metadata,
      };
    }

    return {
      success: false,
      message: 'Payment verification failed',
    };
  } catch (error) {
    console.error('Paystack verification error:', error.message);
    throw new Error(`Paystack error: ${error.message}`);
  }
};

// Verify webhook signature from Paystack
const verifyWebhookSignature = (signature, body) => {
  const payload = Buffer.isBuffer(body)
    ? body.toString()
    : typeof body === 'string'
      ? body
      : JSON.stringify(body);

  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(payload)
    .digest('hex');

  return hash === signature;
};

module.exports = {
  initializePayment,
  verifyPayment,
  verifyWebhookSignature,
};
