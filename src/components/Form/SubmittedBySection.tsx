import { useFormStore } from '../../store/formStore';

export default function SubmittedBySection() {
  const { submitterName, targetDate, additionalNotes, setField } = useFormStore();

  return (
    <>
      <div className="section-label">Submitted By</div>
      <div className="grid-2">
        <div className="field">
          <label htmlFor="submitterName">Your Name *</label>
          <input
            type="text"
            id="submitterName"
            value={submitterName}
            onChange={(e) => setField('submitterName', e.target.value)}
            placeholder="Full name"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="targetDate">Target Setup Date</label>
          <input
            type="date"
            id="targetDate"
            value={targetDate}
            onChange={(e) => setField('targetDate', e.target.value)}
            placeholder="DD / MM / YYYY"
          />
        </div>
      </div>

      <div className="field" style={{ marginTop: '16px' }}>
        <label htmlFor="remarks">Additional Notes / Remarks</label>
        <textarea
          id="remarks"
          value={additionalNotes}
          onChange={(e) => setField('additionalNotes', e.target.value)}
          rows={3}
          style={{ resize: 'vertical', minHeight: '90px' }}
          placeholder="Any specific requirements, room dimensions, power specifications, etc."
        />
      </div>
    </>
  );
}
