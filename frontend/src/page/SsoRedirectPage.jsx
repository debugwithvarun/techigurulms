import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// ─── SsoRedirectPage ──────────────────────────────────────────────────────────
// Route: /sso-redirect   (standalone — no Navbar/Footer, see App.jsx)
//
// Acts as a same-tab bridge to any external SSO-protected service.
// Receives ?token=<ssoToken>&to=<destinationUrl> from Navbar's handleServiceClick,
// validates the destination against an allowlist, then does window.location.href.
//
// Why this exists instead of window.open():
//   • window.open() after any await is blocked by iOS Safari & Chrome Android
//     even when the user explicitly allows popups, because React's synthetic
//     event system breaks the "direct user gesture" chain.
//   • window.location.href is NEVER blocked — it's a plain navigation.
//   • The user sees a branded loading screen for ~800ms then lands on the app.

const ALLOWED_DESTINATIONS = [
  'imshopper-aimockinterview.hf.space',
  // Add more trusted external domains here as you add more services
];

const SsoRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const to    = searchParams.get('to');

    if (!token || !to) {
      setError('Missing redirect parameters.');
      return;
    }

    try {
      const destination = decodeURIComponent(to);
      const ssoToken    = decodeURIComponent(token);

      // Security: only redirect to explicitly whitelisted domains
      const destHost = new URL(destination).hostname;
      if (!ALLOWED_DESTINATIONS.includes(destHost)) {
        console.error('Blocked SSO redirect to untrusted domain:', destHost);
        setError('Redirect destination is not trusted.');
        return;
      }

      const finalUrl = `${destination}?sso=${encodeURIComponent(ssoToken)}`;

      // Small delay so the loading screen feels intentional, not broken
      const timer = setTimeout(() => {
        window.location.href = finalUrl;
      }, 800);

      return () => clearTimeout(timer);
    } catch {
      setError('Invalid redirect URL.');
    }
  }, [searchParams]);

  if (error) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif',
        gap: '1rem', padding: '2rem', textAlign: 'center', background: '#fafafa'
      }}>
        <div style={{ fontSize: '2.5rem' }}>⚠️</div>
        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
          Something went wrong
        </p>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
          {error} Please go back and try again.
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: '0.5rem', padding: '0.65rem 1.75rem',
            background: '#4f46e5', color: '#fff', border: 'none',
            borderRadius: '9999px', fontSize: '0.875rem',
            fontWeight: 600, cursor: 'pointer'
          }}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif',
      gap: '1.25rem', background: '#f8f7ff', color: '#4f46e5'
    }}>
      {/* Spinner */}
      <div style={{
        width: 48, height: 48,
        border: '4px solid #e0e7ff',
        borderTopColor: '#4f46e5',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Logo wordmark */}
      <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
        TechiGuru
      </p>
      <p style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>
        Signing you in…
      </p>
      <p style={{ fontSize: '0.8rem', color: '#818cf8', margin: 0 }}>
        You'll be redirected automatically
      </p>
    </div>
  );
};

export default SsoRedirectPage;