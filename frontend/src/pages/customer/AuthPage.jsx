import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as authApi from '../../api/auth';
import toast from 'react-hot-toast';
import { IconShirt, IconCheck, IconHeart, IconPackage, IconGift, IconBoy, IconGirl, IconChild, IconWarning, IconEye, IconEyeOff } from '../../components/common/Icons';

const STEPS = { EMAIL: 'email', OTP: 'otp', DETAILS: 'details', PASSWORD: 'password' };

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated } = useAuth();

  const isRegister = location.pathname === '/register';
  const [mode, setMode] = useState(isRegister ? 'register' : 'login');

  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [tempToken, setTempToken] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate(location.state?.from || '/');
  }, [isAuthenticated]);

  useEffect(() => {
    if (otpTimer > 0) {
      const t = setTimeout(() => setOtpTimer((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [otpTimer]);

  useEffect(() => {
    setMode(isRegister ? 'register' : 'login');
    setStep(STEPS.EMAIL);
    setOtp(['', '', '', '', '', '']);
    setErrors({});
  }, [isRegister]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Please enter a valid email' });
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      await authApi.sendOTP(email, mode);
      setStep(STEPS.OTP);
      setOtpTimer(60);
      toast.success(`OTP sent to ${email}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP';
      if (mode === 'login' && err.response?.status === 404) {
        toast.error('No account found. Please register first.');
        setMode('register');
        navigate('/register');
      } else {
        setErrors({ email: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
    if (newOtp.every((d) => d) && val) {
      verifyOTP(newOtp.join(''));
    }
  };

  const handleOTPKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const handleOTPPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = Array.from({ length: 6 }, (_, i) => pasted[i] || '');
    setOtp(newOtp);
    if (pasted.length === 6) verifyOTP(pasted);
  };

  const verifyOTP = async (otpStr) => {
    setLoading(true);
    setErrors({});
    try {
      const res = await authApi.verifyOTP(email, otpStr, mode);
      setTempToken(res.data.tempToken);
      if (mode === 'register') {
        setStep(STEPS.DETAILS);
      } else {
        setStep(STEPS.PASSWORD);
      }
      toast.success('OTP verified!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid OTP. Please check and try again.';
      console.error('OTP verify error:', err.response?.status, msg);
      setErrors({ otp: msg });
      // Reset OTP fields so user can retype
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } finally {
      setLoading(false);
    }
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      const user = await register({ tempToken, name, mobile, password, gender });
      toast.success(`Welcome to Jay Kuldevi, ${user.name}!`);
      navigate('/');
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) { setErrors({ password: 'Password is required' }); return; }
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(location.state?.from || '/');
    } catch (err) {
      setErrors({ password: err.response?.data?.message || 'Invalid credentials' });
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
      padding: '80px 20px 40px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 960,
        background: 'white',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }}>
        {/* LEFT — Brand Panel */}
        <div style={{
          background: 'linear-gradient(145deg, var(--primary) 0%, var(--primary-dark) 100%)',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }} className="hide-mobile">
          <div style={{ position: 'absolute', top: -80, right: -80, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48, textDecoration: 'none' }}>
              <img src="/FullLogo.jpg" alt="Jay Kuldevi Logo" style={{ height: 40, width: 'auto', borderRadius: 6, objectFit: 'contain' }} />
              <span style={{ fontFamily: 'var(--font-brand)', fontSize: 28, fontWeight: 550, color: 'white', letterSpacing: '2.5px', textTransform: 'uppercase', textShadow: '0.1px 0 0 white' }}>Jay Kuldevi</span>
            </Link>

            <h2 style={{ color: 'white', fontSize: 28, marginBottom: 14, lineHeight: 1.3 }}>
              {mode === 'register' ? 'Join the Jay Kuldevi Family!' : 'Welcome Back!'}
            </h2>
            <p style={{ opacity: 0.85, lineHeight: 1.7, fontSize: 14, marginBottom: 32 }}>
              {mode === 'register'
                ? 'Create your account to shop adorable kids\' clothing, track orders, and get exclusive offers!'
                : 'Log in to continue shopping, track orders, and enjoy exclusive member discounts.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                [<IconCheck size={16} key="check" />, '10 Days Standard Returns'],
                [<IconHeart size={16} key="heart" />, 'Exclusive Deals & Discounts'],
                [<IconPackage size={16} key="pkg" />, 'Easy Order Tracking'],
                [<IconGift size={16} key="gift" />, '10% OFF on 1st Order'],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, opacity: 0.9 }}>
                  <span>{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', opacity: 0.15, marginTop: 24 }}><img src="/FullLogo.jpg" alt="Watermark Logo" style={{ height: 80, borderRadius: 12, mixBlendMode: 'luminosity' }} /></div>
        </div>

        {/* RIGHT — Form */}
        <div style={{ padding: '48px 44px' }}>
          {/* Mode toggle */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
              {mode === 'login' ? 'Login to Your Account' : 'Create Your Account'}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <span
                style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  navigate(mode === 'login' ? '/register' : '/login');
                  setStep(STEPS.EMAIL);
                  setErrors({});
                  setOtp(['', '', '', '', '', '']);
                }}
              >
                {mode === 'login' ? 'Register' : 'Login'}
              </span>
            </p>
          </div>

          {/* Progress Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
            {[STEPS.EMAIL, STEPS.OTP, mode === 'register' ? STEPS.DETAILS : STEPS.PASSWORD].map((s, i) => (
              <div key={s} style={{
                width: step === s ? 24 : 8, height: 8,
                borderRadius: 4,
                background: [STEPS.EMAIL, STEPS.OTP, STEPS.DETAILS, STEPS.PASSWORD].indexOf(step) >= i
                  ? 'var(--primary)' : 'var(--gray-200)',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>

          {/* STEP 1: Email */}
          {step === STEPS.EMAIL && (
            <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className={`form-input${errors.email ? ' error' : ''}`}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  id="email-input"
                />
                {errors.email && <span className="form-error"><IconWarning size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {errors.email}</span>}
              </div>
              <button
                type="submit"
                className={`btn btn-primary btn-full btn-lg${loading ? ' btn-loading' : ''}`}
                disabled={loading}
                id="send-otp-btn"
              >
                {loading ? 'Sending...' : 'GET OTP →'}
              </button>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === STEPS.OTP && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <p style={{ fontSize: 14, color: 'var(--gray-600)' }}>
                  OTP sent to <strong>{email}</strong>
                </p>
                <button
                  style={{ fontSize: 12, color: 'var(--primary)', marginTop: 4, cursor: 'pointer', background: 'none', border: 'none', fontWeight: 600 }}
                  onClick={() => { setStep(STEPS.EMAIL); setOtp(['', '', '', '', '', '']); }}
                >
                  Change email
                </button>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOTPKeyDown(e, idx)}
                    onPaste={idx === 0 ? handleOTPPaste : undefined}
                    style={{
                      width: 48, height: 52,
                      textAlign: 'center',
                      fontSize: 24, fontWeight: 700,
                      border: `2px solid ${errors.otp ? 'var(--error)' : digit ? 'var(--primary)' : 'var(--gray-200)'}`,
                      borderRadius: 10,
                      outline: 'none',
                      transition: 'border-color 0.15s',
                      color: 'var(--gray-800)',
                    }}
                  />
                ))}
              </div>

              {errors.otp && <p style={{ color: 'var(--error)', fontSize: 13, textAlign: 'center', marginBottom: 12 }}><IconWarning size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {errors.otp}</p>}

              <button
                className={`btn btn-primary btn-full btn-lg${loading ? ' btn-loading' : ''}`}
                onClick={() => verifyOTP(otp.join(''))}
                disabled={loading || otp.some((d) => !d)}
                id="verify-otp-btn"
              >
                {loading ? 'Verifying...' : 'VERIFY OTP →'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--gray-400)' }}>
                {otpTimer > 0 ? (
                  <span>Resend OTP in <strong>{otpTimer}s</strong></span>
                ) : (
                  <button
                    style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', fontSize: 13 }}
                    onClick={async () => {
                      try {
                        await authApi.sendOTP(email, mode);
                        setOtpTimer(60);
                        setOtp(['', '', '', '', '', '']);
                        setErrors({});
                        document.getElementById('otp-0')?.focus();
                        toast.success('New OTP sent to your email!');
                      } catch (err) {
                        const msg = err.response?.data?.message || 'Failed to resend OTP';
                        console.error('Resend OTP error:', err.response?.status, msg);
                        toast.error(msg);
                      }
                    }}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3a: Register Details */}
          {step === STEPS.DETAILS && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {errors.form && (
                <div style={{ background: 'var(--error-light)', color: 'var(--error)', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>
                  <IconWarning size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {errors.form}
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className={`form-input${errors.name ? ' error' : ''}`} type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} id="name-input" />
                {errors.name && <span className="form-error"><IconWarning size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input className="form-input" type="tel" placeholder="10-digit mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className={`form-input${errors.password ? ' error' : ''}`}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password-input"
                  />
                  <button type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', fontSize: 14 }}
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
                {errors.password && <span className="form-error"><IconWarning size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {errors.password}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['male', 'female', 'other'].map((g) => (
                    <label key={g} style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 6, padding: '8px', border: `1.5px solid ${gender === g ? 'var(--primary)' : 'var(--gray-200)'}`,
                      borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                      background: gender === g ? 'var(--primary-50)' : 'white',
                      color: gender === g ? 'var(--primary)' : 'var(--gray-600)',
                      textTransform: 'capitalize',
                    }}>
                      <input type="radio" name="gender" value={g} checked={gender === g} onChange={(e) => setGender(e.target.value)} style={{ display: 'none' }} />
                      {g === 'male' ? <IconBoy size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> : g === 'female' ? <IconGirl size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> : <IconChild size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />} {g}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className={`btn btn-primary btn-full btn-lg${loading ? ' btn-loading' : ''}`} disabled={loading} id="register-btn">
                {loading ? 'Creating account...' : 'CREATE ACCOUNT →'}
              </button>
            </form>
          )}

          {/* STEP 3b: Login Password */}
          {step === STEPS.PASSWORD && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <p style={{ fontSize: 14, color: 'var(--gray-600)' }}>
                  Signing in as <strong>{email}</strong>
                </p>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className={`form-input${errors.password ? ' error' : ''}`}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                    id="login-password-input"
                  />
                  <button type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', fontSize: 14 }}
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                  </button>
                </div>
                {errors.password && <span className="form-error"><IconWarning size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {errors.password}</span>}
              </div>
              <button type="submit" className={`btn btn-primary btn-full btn-lg${loading ? ' btn-loading' : ''}`} disabled={loading} id="login-btn">
                {loading ? 'Logging in...' : 'LOGIN →'}
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep(STEPS.EMAIL)} style={{ color: 'var(--gray-400)' }}>
                ← Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
