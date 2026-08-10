import { useState } from "react";

const FeedbackForm = ({ complaintNumber }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const submitFeedback = async (e) => {
    e.preventDefault();

    if (!rating) {
      setError("Please select a rating.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      /*
       * Connect your backend API here later.
       *
       * Example:
       *
       * await feedbackApi.createFeedback({
       *   complaintNumber,
       *   rating,
       *   comment,
       * });
       */

      console.log("Feedback:", {
        complaintNumber,
        rating,
        comment,
      });

      setSubmitted(true);
    } catch (err) {
      console.error(
        "Feedback submission failed:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to submit feedback."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="feedback-success">

        <div className="feedback-success-icon">
          ✓
        </div>

        <h3>
          Thank you for your feedback!
        </h3>

        <p>
          Your feedback has been recorded for
          complaint{" "}
          <strong>
            {complaintNumber}
          </strong>.
        </p>

      </div>
    );
  }

  return (
    <form
      className="feedback-form"
      onSubmit={submitFeedback}
    >

      {/* Complaint Number */}

      <div className="feedback-complaint-number">

        <span>
          Complaint
        </span>

        <strong>
          #{complaintNumber}
        </strong>

      </div>


      {/* Rating */}

      <div className="feedback-rating-section">

        <label>
          How would you rate the resolution?
        </label>

        <div className="rating-stars">

          {[1, 2, 3, 4, 5].map(
            (star) => (
              <button
                key={star}
                type="button"
                className={
                  star <= rating
                    ? "rating-star active"
                    : "rating-star"
                }
                onClick={() =>
                  setRating(star)
                }
                aria-label={`Rate ${star} out of 5`}
              >
                ★
              </button>
            )
          )}

        </div>

        {rating > 0 && (
          <span className="rating-text">
            {rating === 1 &&
              "Very Poor"}

            {rating === 2 &&
              "Poor"}

            {rating === 3 &&
              "Average"}

            {rating === 4 &&
              "Good"}

            {rating === 5 &&
              "Excellent"}
          </span>
        )}

      </div>


      {/* Comment */}

      <div className="feedback-comment-section">

        <label htmlFor="feedback-comment">
          Additional Comments
        </label>

        <textarea
          id="feedback-comment"
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          placeholder="Tell us about your experience..."
          rows={5}
          maxLength={1000}
        />

        <small>
          {comment.length}/1000
        </small>

      </div>


      {/* Error */}

      {error && (
        <div className="feedback-error">
          {error}
        </div>
      )}


      {/* Submit */}

      <button
        type="submit"
        className="feedback-submit-btn"
        disabled={submitting}
      >
        {submitting
          ? "Submitting..."
          : "Submit Feedback"}
      </button>

    </form>
  );
};

export default FeedbackForm;