import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../api/orders';
import toast from 'react-hot-toast';
import { IconParty, IconShirt, IconPackage, IconCheck } from '../../components/common/Icons';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const confettiRef = useRef(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        toast.error('Failed to load order details');
      }
    };
    fetchOrder();

    // Confetti animation
    const container = confettiRef.current;
    if (!container) return;
    const colors = ['#1b4965', '#5fa8d3', '#bee9e8', '#cae9ff', '#62b6cb'];
    const pieces = Array.from({ length: 60 }, (_, i) => {
      const el = document.createElement('div');
      el.style.cssText = `
        position:absolute;
        width:${8 + Math.random() * 8}px;
        height:${8 + Math.random() * 8}px;
        background:${colors[i % colors.length]};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        left:${Math.random() * 100}%;
        top:-20px;
        animation: confetti ${2 + Math.random() * 3}s ${Math.random() * 2}s forwards;
        opacity:1;
      `;
      container.appendChild(el);
      return el;
    });
    return () => pieces.forEach((el) => el.remove());
  }, [orderId]);

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div ref={confettiRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

      <div style={{
        background: 'white',
        borderRadius: 24,
        padding: '56px 48px',
        textAlign: 'center',
        maxWidth: 520,
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 1,
        animation: 'slideUp 0.4s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><IconParty size={48} color="var(--primary)" /></div>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12, color: 'var(--success)' }}>
          Order Placed Successfully!
        </h1>
        <p style={{ fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: 32 }}>
          Woohoo! Your order has been confirmed. We'll send you updates via email as it progresses. Get excited — cute outfits are on their way! <IconShirt size={18} style={{ verticalAlign: 'middle' }} />
        </p>

        <div style={{
          background: 'var(--primary-50)',
          border: '1px solid var(--primary-light)',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 32,
          display: 'inline-block',
          width: '100%',
        }}>
          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 4 }}>Order ID</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>{orderId}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 32 }}>
          {[
            { icon: <IconShirt size={24} />, label: (order?.items?.length || 0) + ' Items' },
            { icon: <IconPackage size={24} />, label: 'Order Placed' },
            { icon: <IconCheck size={24} />, label: 'Confirmed' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--gray-500)' }}>
              {item.icon}
              <span style={{ fontSize: 12, fontWeight: 600 }}>{item.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link to={`/order/${orderId}`} className="btn btn-primary btn-full btn-lg">
            <IconPackage size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Track My Order
          </Link>
          <Link to="/" className="btn btn-outline btn-full">
            Continue Shopping →
          </Link>
        </div>

        <p style={{ fontSize: 12, color: 'var(--gray-300)', marginTop: 20 }}>
          A confirmation email with your order details has been sent to your email address.
        </p>
      </div>
    </div>
  );
}
