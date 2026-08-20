const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function submitEnquiry(payload) {
  const response = await fetch(`${API_URL}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to submit enquiry.');
  }

  return data;
}
