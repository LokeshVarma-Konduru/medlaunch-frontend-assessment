import { useState, useEffect } from 'react';
import { useFormContext } from '../context/FormContext';
import './FormStepOne.css';

function FormStepOne() {
  const { formData, updateFormData, updateNestedFormData, validationTrigger } = useFormContext();
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

  const [errors, setErrors] = useState({
    legalEntityName: '',
    dbaName: '',
    firstName: '',
    lastName: '',
    title: '',
    workPhone: '',
    email: '',
  });

  const [touched, setTouched] = useState({});
  const [prevTrigger, setPrevTrigger] = useState(0);

  useEffect(() => {
    if (validationTrigger.step === 1 && validationTrigger.count > prevTrigger) {
      setPrevTrigger(validationTrigger.count);
      const requiredFields = ['legalEntityName', 'dbaName', 'firstName', 'lastName', 'title', 'workPhone', 'email'];
      const newErrors = {};
      const newTouched = {};
      
      requiredFields.forEach(field => {
        const value = localData[field];
        const error = validateField(field, value);
        newErrors[field] = error;
        newTouched[field] = true;
      });
      
      setErrors(prev => ({ ...prev, ...newErrors }));
      setTouched(prev => ({ ...prev, ...newTouched }));
      
      setTimeout(() => {
        const firstError = document.querySelector('.form-input.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }, 100);
    }
  }, [validationTrigger]);

  useEffect(() => {
    if (localData.sameAsLegal) {
      setLocalData(prev => ({
        ...prev,
        dbaName: prev.legalEntityName,
      }));
      
      setErrors(prev => ({
        ...prev,
        dbaName: '',
      }));
    }
  }, [localData.sameAsLegal, localData.legalEntityName]);

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

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'legalEntityName':
      case 'dbaName':
      case 'firstName':
      case 'lastName':
      case 'title':
        if (!value.trim()) {
          error = 'This field is required';
        }
        break;

      case 'workPhone':
        if (!value.trim()) {
          error = 'Work phone is required';
        } else if (!/^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/.test(value)) {
          error = 'Please enter a valid 10-digit phone number';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setLocalData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
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
            className={`form-input ${errors.legalEntityName && touched.legalEntityName ? 'error' : ''}`}
            placeholder=""
            value={localData.legalEntityName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.legalEntityName && touched.legalEntityName && (
            <span className="error-message">{errors.legalEntityName}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="doingBusinessAs">
            Doing Business As (d/b/a) Name <span className="required">*</span>
          </label>
          <input
            id="doingBusinessAs"
            name="dbaName"
            type="text"
            className={`form-input ${errors.dbaName && touched.dbaName ? 'error' : ''}`}
            placeholder=""
            value={localData.dbaName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.dbaName && touched.dbaName && (
            <span className="error-message">{errors.dbaName}</span>
          )}
          
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
              className={`form-input ${errors.firstName && touched.firstName ? 'error' : ''}`}
              value={localData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.firstName && touched.firstName && (
              <span className="error-message">{errors.firstName}</span>
            )}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="lastName">
              Last Name <span className="required">*</span>
            </label>
            <input 
              id="lastName" 
              name="lastName" 
              type="text" 
              className={`form-input ${errors.lastName && touched.lastName ? 'error' : ''}`}
              value={localData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.lastName && touched.lastName && (
              <span className="error-message">{errors.lastName}</span>
            )}
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
            className={`form-input ${errors.title && touched.title ? 'error' : ''}`}
            value={localData.title}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.title && touched.title && (
            <span className="error-message">{errors.title}</span>
          )}
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
              className={`form-input ${errors.workPhone && touched.workPhone ? 'error' : ''}`}
              value={localData.workPhone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.workPhone && touched.workPhone && (
              <span className="error-message">{errors.workPhone}</span>
            )}
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
            className={`form-input ${errors.email && touched.email ? 'error' : ''}`}
            value={localData.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && touched.email && (
            <span className="error-message">{errors.email}</span>
          )}
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

