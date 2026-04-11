import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { confirmPayment } from '../../api/orders';

export default function CheckoutForm({ onSuccess, orderId, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        await confirmPayment({
          orderId,
          stripePaymentIntentId: paymentIntent.id,
        });
        onSuccess();
      } catch (err) {
        toast.error('Payment confirmation error on server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: 'tabs' }} />
      <button
        disabled={loading || !stripe || !elements}
        className={`btn btn-primary btn-full mt-4${loading ? ' btn-loading' : ''}`}
        style={{ height: 48, marginTop: 20 }}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
