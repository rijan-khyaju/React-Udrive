import { useEffect, useState } from 'react';
import { getPendingReviews, approveReview, rejectReview } from '../../services/reviewService.js';
import { getSectionContent, updateSectionContent } from '../../services/siteContentService.js';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      setError('');
      try {
        const pending = await getPendingReviews();
        setReviews(pending);
      } catch (err) {
        console.error('[ReviewsPage] loadReviews error:', err);
        setError('Unable to load pending reviews.');
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  const handleApprove = async (review) => {
    setError('');
    try {
      await approveReview(review);
      setReviews((prev) => prev.filter((item) => item.id !== review.id));
      setStatusMessage('Review approved successfully.');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error('[ReviewsPage] handleApprove error:', err);
      setError('Unable to approve review.');
    }
  };

  const handleReject = async (reviewId) => {
    setError('');
    try {
      await rejectReview(reviewId);
      setReviews((prev) => prev.filter((item) => item.id !== reviewId));
      setStatusMessage('Review rejected successfully.');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error('[ReviewsPage] handleReject error:', err);
      setError('Unable to reject review.');
    }
  };

  // Published testimonials (previously in SettingsPage)
  const [testimonialsList, setTestimonialsList] = useState({ items: [] });
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [testimonialsSaveMsg, setTestimonialsSaveMsg] = useState('');

  useEffect(() => {
    async function loadTestimonialsListContent() {
      setTestimonialsLoading(true);
      try {
        const l = await getSectionContent('homepageTestimonialsList');
        if (l && Array.isArray(l.items)) {
          setTestimonialsList({ items: l.items });
        }
      } catch (error) {
        console.error('[ReviewsPage] loadTestimonialsListContent error:', error);
      } finally {
        setTestimonialsLoading(false);
      }
    }

    loadTestimonialsListContent();
  }, []);

  const handleSaveTestimonialsListContent = async () => {
    try {
      await updateSectionContent('homepageTestimonialsList', testimonialsList);
      setTestimonialsSaveMsg('Testimonials saved successfully!');
    } catch (error) {
      console.error('[ReviewsPage] save testimonials error:', error);
      setTestimonialsSaveMsg('Error saving testimonials.');
    }
    setTimeout(() => setTestimonialsSaveMsg(''), 3000);
  };

  return (
    <section className="admin-page admin-reviews">
      <div className="bookings-page-header">
        <div>
          <h2>Reviews</h2>
          <p className="page-copy">Approve or reject pending student review submissions.</p>
        </div>
      </div>

      <div className="admin-card admin-card-large">
        <div className="admin-card-header">
          <h3>Review queue</h3>
          <span>{reviews.length} pending</span>
        </div>

        <div style={{ height: 400, overflowY: 'auto', background: '#f7f7f7', border: '1px solid #e5e5e5', borderRadius: 8 }}>
          <div style={{ position: 'sticky', top: 0, background: '#f7f7f7', zIndex: 1, padding: '16px', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ margin: 0, fontSize: 18 }}>Review Queue ({reviews.length} pending)</h4>
          </div>
          <div style={{ padding: 16 }}>
            {loading ? (
              <div style={{ minHeight: 260, display: 'grid', placeItems: 'center', color: '#444' }}>
                <p>Loading pending reviews...</p>
              </div>
            ) : error ? (
              <div style={{ minHeight: 260, display: 'grid', placeItems: 'center' }}>
                <p className="error-message">{error}</p>
              </div>
            ) : reviews.length === 0 ? (
              <div style={{ minHeight: 260, display: 'grid', placeItems: 'center', color: '#444' }}>
                <p>No pending reviews.</p>
              </div>
            ) : (
              <div className="review-list" style={{ display: 'grid', gap: 18 }}>
                {reviews.map((review) => (
                  <div key={review.id} className="admin-card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <h4 style={{ margin: 0 }}>{review.name || 'Student'}</h4>
                          <span style={{ color: 'var(--yellow)', fontSize: 18 }}>
                            {'★'.repeat(review.stars || 0)}{'☆'.repeat(5 - (review.stars || 0))}
                          </span>
                        </div>
                        <p style={{ marginTop: 12, color: 'var(--dark)' }}>{review.text}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button
                          className="action-btn"
                          type="button"
                          onClick={() => handleApprove(review)}
                        >
                          Approve
                        </button>
                        <button
                          className="action-btn action-delete"
                          type="button"
                          onClick={() => handleReject(review.id)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {statusMessage && <p style={{ color: 'var(--green)', marginTop: 16 }}>{statusMessage}</p>}
      </div>

      <div className="admin-card admin-card-large" style={{ marginTop: 18 }}>
        <div className="admin-card-header">
          <h3>Published Testimonials</h3>
          <span>Manage testimonials shown on the homepage</span>
        </div>

        {testimonialsLoading ? (
          <p>Loading testimonials...</p>
        ) : (
          <div style={{ height: 500, overflowY: 'auto', paddingRight: 8, position: 'relative' }}>
            <div style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 1, padding: '16px 0 12px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: 18 }}>Published Testimonials ({testimonialsList.items.length})</h4>
            </div>
            <div style={{ display: 'grid', gap: 16, padding: '16px 0 0' }}>
              {testimonialsList.items.map((t, idx) => (
                <div key={t.id || idx} style={{ position: 'relative', background: '#fff', borderRadius: 8, boxShadow: '0 14px 30px rgba(0, 0, 0, 0.08)', padding: 20, borderLeft: '4px solid #f0c000', display: 'grid', gap: 14 }}>
                  <button
                    type="button"
                    onClick={() => {
                      const copy = { ...testimonialsList };
                      copy.items = copy.items.filter((_, i) => i !== idx);
                      setTestimonialsList(copy);
                    }}
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: '#ff4d4f',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 10px',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Remove
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0c000', display: 'grid', placeItems: 'center', color: '#000', fontWeight: 700, fontSize: 14 }}>
                        {t.initials || 'AS'}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4, color: '#111', overflowWrap: 'break-word' }}>{t.name || 'Student'}</div>
                        <div style={{ color: '#777', fontSize: 13 }}>{t.role || 'Role'}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: 6 }}>
                    <label style={{ fontWeight: 600, color: '#333' }}>Stars</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={t.stars}
                        onChange={(e) => {
                          const v = Math.max(1, Math.min(5, Number(e.target.value) || 1));
                          const copy = { ...testimonialsList };
                          copy.items = copy.items.map((x, i) => i === idx ? { ...x, stars: v } : x);
                          setTestimonialsList(copy);
                        }}
                        style={{ width: 72, padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fafafa' }}
                      />
                      <span style={{ color: '#f0c000', fontSize: 18, letterSpacing: 1 }}>
                        {'★'.repeat(t.stars || 0)}{'☆'.repeat(5 - (t.stars || 0))}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: 6 }}>
                    <label style={{ fontWeight: 600, color: '#333' }}>Initials</label>
                    <input
                      type="text"
                      value={t.initials}
                      onChange={(e) => {
                        const copy = { ...testimonialsList };
                        copy.items = copy.items.map((x, i) => i === idx ? { ...x, initials: e.target.value } : x);
                        setTestimonialsList(copy);
                      }}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fafafa' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gap: 6 }}>
                    <label style={{ fontWeight: 600, color: '#333' }}>Review</label>
                    <textarea
                      rows={4}
                      value={t.text}
                      onChange={(e) => {
                        const copy = { ...testimonialsList };
                        copy.items = copy.items.map((x, i) => i === idx ? { ...x, text: e.target.value } : x);
                        setTestimonialsList(copy);
                      }}
                      style={{ width: '100%', minHeight: 110, padding: '14px 14px', borderRadius: 12, border: '1px solid #ddd', resize: 'vertical', background: '#fafafa', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 0 16px' }}>
              <button
                className="btn-primary"
                type="button"
                onClick={() => {
                  setTestimonialsList((prev) => ({ items: [...prev.items, { id: Date.now(), name: '', role: '', text: '', stars: 5, initials: '' }] }));
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '14px 18px',
                  borderRadius: 10,
                  border: '2px dashed #f0c000',
                  background: 'transparent',
                  color: '#333',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                + Add Testimonial
              </button>
              <button
                className="btn-primary"
                type="button"
                onClick={handleSaveTestimonialsListContent}
                style={{
                  width: '100%',
                  background: '#f0c000',
                  color: '#000',
                  border: 'none',
                  borderRadius: 10,
                  padding: '16px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Save Testimonials
              </button>
              {testimonialsSaveMsg && <span style={{ color: '#111', fontWeight: 600 }}>{testimonialsSaveMsg}</span>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
