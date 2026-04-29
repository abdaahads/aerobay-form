interface FormFooterProps {
  onSubmit: () => void;
  onReset: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

export default function FormFooter({ onSubmit, onReset, isSubmitting, isSubmitted }: FormFooterProps) {
  return (
    <>
      {/* Success Message */}
      <div className={`success-msg ${isSubmitted ? 'show' : ''}`}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" fill="var(--success)"/>
          <path d="M8 14l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p>
          <strong>Form submitted successfully!</strong><br/>
          Our team will review your lab requirements and get in touch within 2 business days.
        </p>
      </div>

      {/* Submit Row */}
      <div className="submit-row">
        <button
          type="button"
          className="btn-submit"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" fill="none"/>
              </svg>
              Submitting…
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Submit
            </>
          )}
        </button>
        <button type="button" className="btn-reset" onClick={onReset}>
          Reset Form
        </button>
        <p className="form-note">
          Fields marked * are required.<br/>
          Your data is handled securely.
        </p>
      </div>
    </>
  );
}
