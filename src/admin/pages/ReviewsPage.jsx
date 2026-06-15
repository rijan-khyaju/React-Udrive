import { useEffect, useState } from 'react';
import { getPendingReviews, approveReview, rejectReview } from '../../services/reviewService.js';

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

        {loading ? (
          <p>Loading pending reviews...</p>
        ) : error ? (
          <div>
            <p className="error-message">{error}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ padding: 24, color: '#444' }}>
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

        {statusMessage && <p style={{ color: 'var(--green)', marginTop: 16 }}>{statusMessage}</p>}
      </div>
    </section>
  );
}
