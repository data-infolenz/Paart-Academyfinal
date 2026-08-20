import { useState } from 'react';
import { courses } from '../data/courses.js';
import { submitEnquiry } from '../api/enquiries.js';

const initialForm = {
  name: '',
  phone: '',
  email: '',
  district: '',
  courseInterested: '',
  message: '',
};

export function EnquiryForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const result = await submitEnquiry(form);
      setForm(initialForm);
      setStatus({ type: 'success', message: `${result.message} ID: ${result.enquiryId}` });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section enquirySection" id="enquiry">
      <div className="sectionHeader">
        <span>Enquiry</span>
        <h2>Talk to PAART Academy</h2>
      </div>

      <form className="enquiryForm" onSubmit={handleSubmit}>
        <label>
          Student name
          <input name="name" value={form.name} onChange={updateField} required />
        </label>

        <label>
          Phone number
          <input name="phone" value={form.phone} onChange={updateField} required />
        </label>

        <label>
          Email address
          <input name="email" type="email" value={form.email} onChange={updateField} />
        </label>

        <label>
          District
          <input name="district" value={form.district} onChange={updateField} />
        </label>

        <label>
          Interested course
          <select name="courseInterested" value={form.courseInterested} onChange={updateField} required>
            <option value="">Select course</option>
            {courses.map((course) => (
              <option key={course.title} value={course.title}>
                {course.title}
              </option>
            ))}
          </select>
        </label>

        <label className="fullWidth">
          Message
          <textarea name="message" rows="4" value={form.message} onChange={updateField} />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Enquiry'}
        </button>

        {status.message && <p className={status.type}>{status.message}</p>}
      </form>
    </section>
  );
}
