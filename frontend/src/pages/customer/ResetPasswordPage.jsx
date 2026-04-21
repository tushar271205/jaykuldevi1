import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPasswordByToken } from '../../api/auth';
import toast from 'react-hot-toast';
import { IconWarning, IconEye, IconEyeOff } from '../../components/common/Icons';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordByToken(token, password);
      setDone(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password. The link may have expired.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #e8f5e9 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: 24,
        padding: '48px 40px',
        maxWidth: 440,
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        textAlign: 'center',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 28 }}>
          <img src="/FullLogo.jpg" alt="Jay Kuldevi" style={{ height: 48, borderRadius: 8 }} />
        </Link>

        {done ? (
          <>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: '#d1fae5', margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32,
            }}>✅</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#065f46', marginBottom: 10 }}>
              Password Reset!
            </h1>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>
              Your password has been updated successfully.<br />
              Redirecting you to login...
            </p>
            <Link to="/login" className="btn btn-primary btn-full">
              Go to Login →
            </Link>
          </>
        ) : (
          <>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--primary-50, #e8f4f8)', margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
            }}>🔐</div>

            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
              Set New Password
            </h1>
            <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 28, lineHeight: 1.5 }}>
              Choose a strong new password for your Jay Kuldevi account.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>
                  <IconWarning size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {error}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    id="new-password-input"
                  />
                  <button
                    type="button"
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  id="confirm-password-input"
                />
              </div>

              <button
                type="submit"
                className={`btn btn-primary btn-full btn-lg${loading ? ' btn-loading' : ''}`}
                disabled={loading}
                id="reset-password-submit"
              >
                {loading ? 'Resetting...' : 'RESET PASSWORD →'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <Link to="/login" style={{ fontSize: 13, color: 'var(--gray-400)', textDecoration: 'none' }}>
                  ← Back to Login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
