import { useState, useEffect } from 'react';
import { useFormContext } from '../context/FormContext';
import './FormStepOne.css';

function FormStepOne() {
  const { formData, updateFormData, updateNestedFormData } = useFormContext();
  const [localData, setLocalData] = useState({
    legalEntityName: formData.step1.legalEntityName || '',
    dbaName: formData.step1.dbaName || '',
    sameAsLegal: false,
    firstName: formData.step1.primaryContact.name.split(' ')[0] || '',
    lastName: formData.step1.primaryContact.name.split(' ')[1] || '',
    title: formData.step1.primaryContact.title || '',
    workPhone: formData.step1.primaryContact.workPhone || '',
    cellPhone: formData.step1.primaryContact.cellPhone || '',
    email: formData.step1.primaryContact.email || '',
  });

  // Handle "Same as Legal Entity Name" checkbox
  useEffect(() => {
    if (localData.sameAsLegal) {
      setLocalData(prev => ({
        ...prev,
        dbaName: prev.legalEntityName,
      }));
    }
  }, [localData.sameAsLegal, localData.legalEntityName]);

  // Update context whenever local data changes
  useEffect(() => {
    updateFormData('step1', {
      legalEntityName: localData.legalEntityName,
      dbaName: localData.dbaName,
      primaryContact: {
        name: `${localData.firstName} ${localData.lastName}`.trim(),
        title: localData.title,
        workPhone: localData.workPhone,
        cellPhone: localData.cellPhone,
        email: localData.email,
        emailVerified: false,
        address: '',
      },
    });
  }, [localData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="form-step">
      <section className="section">
        <h2 className="section-title">Identify Healthcare Organization</h2>

        <div className="form-group">
          <label className="form-label" htmlFor="legalEntity">
            Legal Entity Name <span className="required">*</span>
          </label>
          <input
            id="legalEntity"
            name="legalEntityName"
            type="text"
            className="form-input"
            placeholder=""
            value={localData.legalEntityName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="doingBusinessAs">
            Doing Business As (d/b/a) Name <span className="required">*</span>
          </label>
          <input
            id="doingBusinessAs"
            name="dbaName"
            type="text"
            className="form-input"
            placeholder=""
            value={localData.dbaName}
            onChange={handleChange}
          />
          
          <label className="checkbox">
            <input 
              type="checkbox" 
              name="sameAsLegal" 
              checked={localData.sameAsLegal}
              onChange={handleChange}
            />
            <span>Same as Legal Entity Name</span>
          </label>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Primary Contact Information</h2>
          <p className="section-subtitle">
            Primary contact receives all DNV Healthcare official communications
          </p>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="firstName">
              First Name <span className="required">*</span>
            </label>
            <input 
              id="firstName" 
              name="firstName" 
              type="text" 
              className="form-input"
              value={localData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="lastName">
              Last Name <span className="required">*</span>
            </label>
            <input 
              id="lastName" 
              name="lastName" 
              type="text" 
              className="form-input"
              value={localData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input 
            id="title" 
            name="title" 
            type="text" 
            className="form-input"
            value={localData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="workPhone">
              Work Phone <span className="required">*</span>
            </label>
            <input 
              id="workPhone" 
              name="workPhone" 
              type="tel" 
              className="form-input"
              value={localData.workPhone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cellPhone">
              Cell Phone
            </label>
            <input 
              id="cellPhone" 
              name="cellPhone" 
              type="tel" 
              className="form-input"
              value={localData.cellPhone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group email-group">
          <div className="email-label-row">
            <label className="form-label" htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <button type="button" className="refresh-btn" aria-label="Refresh">
              <img src="/Refresh.svg" alt="Refresh" />
            </button>
          </div>
          <input 
            id="email" 
            name="email" 
            type="email" 
            className="form-input"
            value={localData.email}
            onChange={handleChange}
          />
          <div className="email-actions">
            <button type="button" className="link-button">
              Send Verification Email
            </button>
            <span className="status-pill">Not verified</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FormStepOne;

