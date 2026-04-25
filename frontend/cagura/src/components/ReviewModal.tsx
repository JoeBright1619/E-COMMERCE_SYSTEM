import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import './ReviewModal.css';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  productName: string;
  initialData?: { rating: number; comment: string | null };
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

const ReviewModal = ({ isOpen, onClose, onSubmit, productName, initialData }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setRating(initialData.rating);
        setComment(initialData.comment || '');
      } else {
        setRating(0);
        setComment('');
      }
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const activeRating = hoverRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onSubmit(rating, comment);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal-header">
          <h3>{initialData ? 'Edit Review' : 'Write a Review'}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <p className="text-secondary mb-4">How was your experience with <strong>{productName}</strong>?</p>

        {error && <div className="review-modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="review-modal-form">
          <div className="review-rating-selector">
            <label>Rating</label>
            <div className="stars-interactive-row">
              <div
                className="stars-interactive"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={`star-btn${activeRating >= star ? ' active' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      size={32}
                      fill={activeRating >= star ? '#f4b740' : 'transparent'}
                      color={activeRating >= star ? '#f4b740' : '#d8ccbf'}
                    />
                  </button>
                ))}
              </div>
              <span className="star-rating-label">
                {activeRating > 0 ? RATING_LABELS[activeRating] : 'Select a rating'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="review-comment">Comment (Optional)</label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others what you thought about this product..."
              rows={4}
            />
          </div>

          <div className="review-modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
