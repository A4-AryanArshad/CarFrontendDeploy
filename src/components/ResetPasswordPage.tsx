import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { API_BASE_URL } from '../config';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Extract token from URL - try multiple methods
    let extractedToken: string | null = null;
    
    // Method 1: useSearchParams (React Router)
    extractedToken = searchParams.get('token');
    
    // Method 2: Direct URL parsing
    if (!extractedToken) {
      const urlParams = new URLSearchParams(window.location.search);
      extractedToken = urlParams.get('token');
    }
    
    // Method 3: Manual parsing from window.location.search
    if (!extractedToken && window.location.search) {
      const search = window.location.search.substring(1);
      const params = new URLSearchParams(search);
      extractedToken = params.get('token');
    }
    
    // Method 4: Manual parsing from hash (if token is in hash)
    if (!extractedToken && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      extractedToken = params.get('token');
    }
    
    // Debug: Log token extraction
    console.log('Token extraction attempt:');
    console.log('- useSearchParams:', searchParams.get('token'));
    console.log('- window.location.search:', window.location.search);
    console.log('- window.location.href:', window.location.href);
    console.log('- Extracted token:', extractedToken ? 'Found' : 'Not found', extractedToken ? `(${extractedToken.substring(0, 20)}...)` : '');
    
    setToken(extractedToken);
    
    if (!extractedToken) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }
    
    if (!password) {
      setError('Please enter a new password.');
      return;
    }
    
    // Debug: Log what we're sending
    console.log('Submitting form:');
    console.log('- Token:', token ? `Present (${token.substring(0, 20)}...)` : 'MISSING');
    console.log('- Password:', password ? 'Present' : 'MISSING');
    
    try {
      const requestBody = { token, password };
      console.log('Request body JSON:', JSON.stringify(requestBody));
      console.log('Request body length:', JSON.stringify(requestBody).length);
      
      const res = await fetch(`${API_BASE_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      console.log('Response status:', res.status);
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Password has been reset.');
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ background: '#111', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
        <div style={{ background: '#181818', borderRadius: 16, boxShadow: '0 4px 24px #0006', padding: 32, minWidth: 340, maxWidth: 380, width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '2rem', marginBottom: 32, textAlign: 'center' }}>Reset Password</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <label htmlFor="password" style={{ color: '#eaeaea', fontWeight: 500, marginBottom: 4 }}>New Password</label>
            <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ background: '#111', color: '#eaeaea', border: '1.5px solid #232323', borderRadius: 8, padding: '10px 14px', fontSize: '1rem', marginBottom: 8 }} />
            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
            {message && <div style={{ color: 'green', marginBottom: 8 }}>{message}</div>}
            <button type="submit" style={{ background: '#ffd600', color: '#111', fontWeight: 600, border: 'none', borderRadius: 8, padding: '12px 0', fontSize: '1.1rem', marginTop: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 2px 8px #0003' }}>
              Reset Password
            </button>
          </form>
          <span style={{ fontSize: '0.98rem', color: '#ffd600', cursor: 'pointer', textAlign: 'center', marginTop: 12 }} onClick={() => navigate('/login')}>Back to Login</span>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResetPasswordPage; 