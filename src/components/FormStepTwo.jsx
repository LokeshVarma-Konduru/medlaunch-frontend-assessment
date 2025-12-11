import { useFormContext } from '../context/FormContext';
import './FormStepTwo.css';

function FormStepTwo() {
  const { formData, updateFormData } = useFormContext();

  const handleChange = (e) => {
    updateFormData('step2', {
      facilityType: e.target.value,
    });
  };

  return (
    <div className="form-step">
      <section className="section">
        <h2 className="section-title">Facility and Organization Type</h2>

        <div className="form-group">
          <label className="form-label">
            Facility Type <span className="required">*</span>
          </label>

          <div className="radio-group">
            <label className="radio-option">
              <input 
                type="radio" 
                name="facilityType" 
                value="short-term"
                checked={formData.step2.facilityType === 'short-term'}
                onChange={handleChange}
              />
              <span>Short-Term Acute Care</span>
            </label>

            <label className="radio-option">
              <input 
                type="radio" 
                name="facilityType" 
                value="long-term"
                checked={formData.step2.facilityType === 'long-term'}
                onChange={handleChange}
              />
              <span>Long-Term Acute Care</span>
            </label>

            <label className="radio-option">
              <input 
                type="radio" 
                name="facilityType" 
                value="critical"
                checked={formData.step2.facilityType === 'critical'}
                onChange={handleChange}
              />
              <span>Critical Access</span>
            </label>

            <label className="radio-option">
              <input 
                type="radio" 
                name="facilityType" 
                value="childrens"
                checked={formData.step2.facilityType === 'childrens'}
                onChange={handleChange}
              />
              <span>Children's</span>
            </label>

            <label className="radio-option">
              <input 
                type="radio" 
                name="facilityType" 
                value="psychiatric"
                checked={formData.step2.facilityType === 'psychiatric'}
                onChange={handleChange}
              />
              <span>Free-Standing Psychiatric</span>
            </label>

            <label className="radio-option">
              <input 
                type="radio" 
                name="facilityType" 
                value="other"
                checked={formData.step2.facilityType === 'other'}
                onChange={handleChange}
              />
              <span>Other</span>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FormStepTwo;

