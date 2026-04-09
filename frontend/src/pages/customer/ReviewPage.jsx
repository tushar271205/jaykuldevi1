import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { addReview } from '../../api/reviews';
import toast from 'react-hot-toast';
import { IconStar, IconCamera } from '../../components/common/Icons';

export default function ReviewPage() {
  const { orderId, productId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { toast.error('Please select a rating'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('rating', rating);
      formData.append('comment', comment);
      formData.append('orderId', orderId);
      images.forEach((img) => formData.append('images', img));
      await addReview(productId, formData);
      toast.success('Review submitted! Thank you');
      navigate('/account/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'var(--gray-50)',
    }}>
      <div className="card" style={{ maxWidth: 580, width: '100%' }}>
        <div className="card-header">
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>Rate & Review Product <IconStar size={18} color="#f59e0b" style={{ display: 'inline', verticalAlign: 'middle' }} /></h1>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Star Rating */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 12 }}>
                Your Rating *
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      fontSize: 40,
                      background: 'none', border: 'none',
                      cursor: 'pointer',
                      color: (hoverRating || rating) >= star ? '#f59e0b' : 'var(--gray-200)',
                      transition: 'all 0.15s',
                      transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                    }}
                  >
                    <IconStar size={32} />
                  </button>
                ))}
                {(hoverRating || rating) > 0 && (
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#f59e0b', marginLeft: 8 }}>
                    {RATING_LABELS[hoverRating || rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="form-group">
              <label className="form-label">Your Review</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Tell us about the product — quality, fit, fabric, etc."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Photo Upload */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 8 }}>
                Add Photos (up to 3)
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                {previews.map((src, i) => (
                  <div key={i} style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden', border: '2px solid var(--primary)' }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
                {previews.length < 3 && (
                  <label style={{
                    width: 72, height: 72, borderRadius: 8,
                    border: '2px dashed var(--gray-300)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--gray-400)',
                    flexDirection: 'column', gap: 4, fontSize: 11,
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconCamera size={20} /></span>
                    Add Photo
                    <input type="file" multiple accept="image/*" onChange={handleImages} style={{ display: 'none' }} />
                  </label>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="submit"
                className={`btn btn-primary btn-lg${loading ? ' btn-loading' : ''}`}
                disabled={loading}
                style={{ flex: 2 }}
              >
                {loading ? 'Submitting...' : <><span>Submit Review</span> <IconStar size={14} color="#f59e0b" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} /></>}
              </button>
              <Link to="/account/orders" className="btn btn-outline btn-lg" style={{ flex: 1 }}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
