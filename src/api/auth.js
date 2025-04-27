const BASE_URL = "http://localhost:5000/api/auth";

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Login failed');
  return data;
}

// NEW: request OTP
export async function requestOtp(email) {
  const response = await fetch(`${BASE_URL}/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'OTP request failed');
  return data;
}

// NEW: verify OTP and signup
export async function verifyOtpAndSignup(formData) {
  const response = await fetch(`${BASE_URL}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Signup failed');
  return data;
}
