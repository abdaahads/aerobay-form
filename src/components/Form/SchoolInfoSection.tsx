import { useFormStore } from '../../store/formStore';

export default function SchoolInfoSection() {
  const { schoolName, schoolCode, contactPerson, contactEmail, contactPhone, setField } = useFormStore();

  return (
    <>
      <div className="section-label">School Information</div>
      <div className="grid-2">
        <div className="field">
          <label htmlFor="schoolName">School Name *</label>
          <input
            type="text"
            id="schoolName"
            value={schoolName}
            onChange={(e) => setField('schoolName', e.target.value)}
            placeholder="e.g. Delhi Public School"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="schoolCode">Institution Code</label>
          <input
            type="text"
            id="schoolCode"
            value={schoolCode}
            onChange={(e) => setField('schoolCode', e.target.value)}
            placeholder="e.g. DPS-2024"
          />
        </div>
      </div>

      <div className="grid-3">
        <div className="field">
          <label htmlFor="contactName">Contact Person *</label>
          <input
            type="text"
            id="contactName"
            value={contactPerson}
            onChange={(e) => setField('contactPerson', e.target.value)}
            placeholder="Full name"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="contactEmail">Email Address *</label>
          <input
            type="email"
            id="contactEmail"
            value={contactEmail}
            onChange={(e) => setField('contactEmail', e.target.value)}
            placeholder="email@school.edu"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="contactPhone">Phone Number</label>
          <input
            type="tel"
            id="contactPhone"
            value={contactPhone}
            onChange={(e) => setField('contactPhone', e.target.value)}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>
      </div>
    </>
  );
}
