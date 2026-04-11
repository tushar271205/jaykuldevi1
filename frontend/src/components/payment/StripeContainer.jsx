import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useEffect, useRef } from 'react';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51TKf6yJTKJdB8C1KAdBDYSpqMurUGVXinhl5hhhlkdC0bHbAqk431BL6s6Wi966ouBKXu0qH8lNGFV8oLOFw3zsq00YKTYDvra');

export default function StripeContainer({ clientSecret, onCancel, onSuccess, orderId, amount }) {
  const overlayRef = useRef(null);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#1b4965',
      },
    },
  };

  // Completely lock background scroll and touch
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Save originals
    const origBodyOverflow = body.style.overflow;
    const origBodyPosition = body.style.position;
    const origBodyWidth = body.style.width;
    const origBodyTop = body.style.top;
    const origHtmlOverflow = html.style.overflow;
    const scrollY = window.scrollY;

    // Lock everything
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.width = '100%';
    body.style.top = `-${scrollY}px`;
    html.style.overflow = 'hidden';

    return () => {
      body.style.overflow = origBodyOverflow;
      body.style.position = origBodyPosition;
      body.style.width = origBodyWidth;
      body.style.top = origBodyTop;
      html.style.overflow = origHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Block ALL touch events on the overlay from reaching the page
  const blockTouch = (e) => {
    // Only allow touches inside the modal content
    if (overlayRef.current && e.target === overlayRef.current) {
      e.preventDefault();
    }
  };

  return (
    <div
      ref={overlayRef}
      className="stripe-modal-overlay"
      onClick={onCancel}
      onTouchStart={blockTouch}
      onTouchMove={blockTouch}
    >
      <div
        className="stripe-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="stripe-modal-header">
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Complete Your Payment</h2>
          <button onClick={onCancel} className="stripe-modal-close">&times;</button>
        </div>

        <div className="stripe-modal-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span>Order ID:</span>
            <span style={{ fontWeight: 600, fontSize: 12, wordBreak: 'break-all', marginLeft: 8, textAlign: 'right' }}>{orderId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total Payable:</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            onSuccess={onSuccess}
            orderId={orderId}
            clientSecret={clientSecret}
          />
        </Elements>
      </div>

      <style>{`
        .stripe-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          padding: 16px;
          isolation: isolate;
        }
        .stripe-modal-content {
          background: white;
          padding: 24px;
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
          position: relative;
          max-height: 85vh;
          max-height: 85dvh;
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }
        .stripe-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .stripe-modal-close {
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: var(--gray-400);
          padding: 4px 8px;
          line-height: 1;
          border-radius: 8px;
        }
        .stripe-modal-close:hover {
          background: var(--gray-100);
        }
        .stripe-modal-info {
          margin-bottom: 20px;
          padding: 12px;
          background: var(--gray-50);
          border-radius: 8px;
          font-size: 14px;
        }

        /* ===== Mobile: full-screen modal ===== */
        @media (max-width: 600px) {
          .stripe-modal-overlay {
            padding: 0;
            align-items: stretch;
          }
          .stripe-modal-content {
            border-radius: 0;
            max-width: 100%;
            max-height: 100vh;
            max-height: 100dvh;
            height: 100vh;
            height: 100dvh;
            display: flex;
            flex-direction: column;
            padding: 20px 16px;
            padding-top: max(20px, env(safe-area-inset-top));
            padding-bottom: max(20px, env(safe-area-inset-bottom));
          }
          .stripe-modal-content form {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .stripe-modal-content form > div:first-child {
            flex: 1;
          }
          .stripe-modal-content form > button {
            flex-shrink: 0;
          }
        }
      `}
      </style>
    </div>
  );
}
