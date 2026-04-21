/**
 * PasswordStrength — reusable password requirements checker
 * Props:
 *   password (string)  — the current password value
 *   show    (boolean)  — whether to render (default true)
 */

const RULES = [
  { id: 'len',     label: 'At least 8 characters',          test: (p) => p.length >= 8 },
  { id: 'upper',   label: 'One uppercase letter (A–Z)',      test: (p) => /[A-Z]/.test(p) },
  { id: 'lower',   label: 'One lowercase letter (a–z)',      test: (p) => /[a-z]/.test(p) },
  { id: 'number',  label: 'One number (0–9)',                test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'One special character (!@#$%…)',  test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export const validatePassword = (password) =>
  RULES.every((r) => r.test(password));

export const passwordError = (password) => {
  if (!password) return 'Password is required.';
  const failed = RULES.find((r) => !r.test(password));
  return failed ? `Password must contain: ${failed.label.toLowerCase()}.` : null;
};

export default function PasswordStrength({ password, show = true }) {
  if (!show || !password) return null;

  const passed = RULES.filter((r) => r.test(password)).length;
  const pct = (passed / RULES.length) * 100;

  const barColor =
    passed <= 1 ? '#f87171'   // red
    : passed <= 2 ? '#fb923c' // orange
    : passed <= 3 ? '#facc15' // yellow
    : passed <= 4 ? '#4ade80' // light green
    : '#22c55e';              // strong green

  const label =
    passed <= 1 ? 'Very Weak'
    : passed === 2 ? 'Weak'
    : passed === 3 ? 'Fair'
    : passed === 4 ? 'Good'
    : 'Strong';

  return (
    <div style={{ marginTop: 8 }}>
      {/* Strength bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'var(--gray-100)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: barColor,
            borderRadius: 3,
            transition: 'width 0.35s ease, background 0.35s ease',
          }} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: barColor, minWidth: 60, transition: 'color 0.3s' }}>
          {label}
        </span>
      </div>

      {/* Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
        {RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <div key={rule.id} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11, color: ok ? '#22c55e' : 'var(--gray-400)',
              transition: 'color 0.2s',
            }}>
              <span style={{
                width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                background: ok ? '#22c55e' : 'var(--gray-200)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, color: 'white', fontWeight: 700,
                transition: 'background 0.2s',
              }}>
                {ok ? '✓' : '–'}
              </span>
              {rule.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
