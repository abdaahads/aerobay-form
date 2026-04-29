export default function FormHeader() {
  return (
    <div className="form-header">
      <div className="logo-mark">
        <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 22L15 5L27 22H3Z" fill="url(#grad)" opacity="0.95"/>
          <circle cx="15" cy="18" r="4" fill="url(#grad)" opacity="0.6"/>
          <path d="M10 22Q15 16 20 22" stroke="url(#grad)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#0057FF', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#4D88FF', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <h1>AeroBay</h1>
      <p>Lab Setup Requirement Form</p>
    </div>
  );
}
