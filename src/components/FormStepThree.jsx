import { useState, useEffect } from 'react';
import { useFormContext } from '../context/FormContext';
import './FormStepThree.css';

function FormStepThree() {
  const { formData, updateFormData, validationTrigger } = useFormContext();
  
  // Load CEO data from context
  const ceoContact = formData?.step3?.leadershipContacts?.[0] || {};
  const [ceoFirstName, ceoLastName] = (ceoContact.name || '').split(' ');
  const [ceoData, setCeoData] = useState({
    firstName: ceoFirstName || '',
    lastName: ceoLastName || '',
    phone: ceoContact.workPhone || '',
    email: ceoContact.email || '',
    sameAsPrimary: ceoContact.sameAsPrimary || false,
  });

  // Error states
  const [errors, setErrors] = useState({
    ceoFirstName: '',
    ceoLastName: '',
    ceoPhone: '',
    ceoEmail: '',
    invoicingFirstName: '',
    invoicingLastName: '',
    invoicingPhone: '',
    invoicingEmail: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [touched, setTouched] = useState({});

  // Load Director data from context
  const directorContact = formData?.step3?.leadershipContacts?.[1] || {};
  const [dirFirstName, dirLastName] = (directorContact.name || '').split(' ');
  const [directorData, setDirectorData] = useState({
    firstName: dirFirstName || '',
    lastName: dirLastName || '',
    phone: directorContact.workPhone || '',
    email: directorContact.email || '',
    sameAsPrimary: directorContact.sameAsPrimary || false,
  });

  // Load Invoicing data from context
  const invoicingContact = formData?.step3?.leadershipContacts?.[2] || {};
  const [invFirstName, invLastName] = (invoicingContact.name || '').split(' ');
  const [invoicingData, setInvoicingData] = useState({
    firstName: invFirstName || '',
    lastName: invLastName || '',
    phone: invoicingContact.workPhone || '',
    email: invoicingContact.email || '',
    sameAsPrimary: invoicingContact.sameAsPrimary || false,
  });

  // Load billing address from context
  const savedAddress = formData?.step3?.billingAddress?.address || '';
  const addressParts = savedAddress.split(', ');
  const [billingAddress, setBillingAddress] = useState({
    streetAddress: addressParts[0] || '',
    city: addressParts[1] || '',
    state: addressParts[2]?.split(' ')[0] || '',
    zipCode: addressParts[2]?.split(' ')[1] || '',
  });

  // Validation functions
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'ceoFirstName':
      case 'ceoLastName':
      case 'invoicingFirstName':
      case 'invoicingLastName':
      case 'streetAddress':
      case 'city':
      case 'state':
        if (!value.trim()) {
          error = 'This field is required';
        }
        break;

      case 'ceoPhone':
      case 'invoicingPhone':
        if (!value.trim()) {
          error = 'Phone is required';
        } else if (!/^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/.test(value)) {
          error = 'Please enter a valid 10-digit phone number';
        }
        break;

      case 'ceoEmail':
      case 'invoicingEmail':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'zipCode':
        if (!value.trim()) {
          error = 'Zip code is required';
        } else if (!/^\d{5}(-\d{4})?$/.test(value)) {
          error = 'Please enter a valid zip code';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleBlur = (name, value) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handle "Same as Primary Contact" checkboxes
  useEffect(() => {
    if (ceoData.sameAsPrimary) {
      const [firstName, lastName] = formData.step1.primaryContact.name.split(' ');
      setCeoData(prev => ({
        ...prev,
        firstName: firstName || '',
        lastName: lastName || '',
        phone: formData.step1.primaryContact.workPhone,
        email: formData.step1.primaryContact.email,
      }));
      
      // Clear errors for these fields when auto-filled
      setErrors(prev => ({
        ...prev,
        ceoFirstName: '',
        ceoLastName: '',
        ceoPhone: '',
        ceoEmail: '',
      }));
    } else {
      // Clear fields when unchecked
      setCeoData(prev => ({
        ...prev,
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
      }));
    }
  }, [ceoData.sameAsPrimary, formData.step1.primaryContact]);

  useEffect(() => {
    if (directorData.sameAsPrimary) {
      const [firstName, lastName] = formData.step1.primaryContact.name.split(' ');
      setDirectorData(prev => ({
        ...prev,
        firstName: firstName || '',
        lastName: lastName || '',
        phone: formData.step1.primaryContact.workPhone,
        email: formData.step1.primaryContact.email,
      }));
      
      // Clear errors for these fields when auto-filled (Director is optional, but clear anyway)
      setErrors(prev => ({
        ...prev,
        directorFirstName: '',
        directorLastName: '',
        directorPhone: '',
        directorEmail: '',
      }));
    } else {
      // Clear fields when unchecked
      setDirectorData(prev => ({
        ...prev,
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
      }));
    }
  }, [directorData.sameAsPrimary, formData.step1.primaryContact]);

  useEffect(() => {
    if (invoicingData.sameAsPrimary) {
      const [firstName, lastName] = formData.step1.primaryContact.name.split(' ');
      setInvoicingData(prev => ({
        ...prev,
        firstName: firstName || '',
        lastName: lastName || '',
        phone: formData.step1.primaryContact.workPhone,
        email: formData.step1.primaryContact.email,
      }));
      
      // Clear errors for these fields when auto-filled
      setErrors(prev => ({
        ...prev,
        invoicingFirstName: '',
        invoicingLastName: '',
        invoicingPhone: '',
        invoicingEmail: '',
      }));
    } else {
      // Clear fields when unchecked
      setInvoicingData(prev => ({
        ...prev,
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
      }));
    }
  }, [invoicingData.sameAsPrimary, formData.step1.primaryContact]);

  // Track previous validation trigger to detect changes
  const [prevTrigger, setPrevTrigger] = useState(0);
  
  // Listen for validation trigger - validate all required fields
  useEffect(() => {
    // Only validate if this trigger is for Step 3
    if (validationTrigger.step === 3 && validationTrigger.count > prevTrigger) {
      setPrevTrigger(validationTrigger.count);
      const requiredFields = [
        'ceoFirstName', 'ceoLastName', 'ceoPhone', 'ceoEmail',
        'invoicingFirstName', 'invoicingLastName', 'invoicingPhone', 'invoicingEmail',
        'streetAddress', 'city', 'state', 'zipCode'
      ];
      
      const newErrors = {};
      const newTouched = {};
      
      // Validate CEO fields
      ['ceoFirstName', 'ceoLastName', 'ceoPhone', 'ceoEmail'].forEach(field => {
        const fieldKey = field.replace('ceo', '').toLowerCase();
        const value = ceoData[fieldKey === 'firstname' ? 'firstName' : fieldKey === 'lastname' ? 'lastName' : fieldKey];
        const error = validateField(field, value);
        newErrors[field] = error;
        newTouched[field] = true;
      });
      
      // Validate Invoicing fields
      ['invoicingFirstName', 'invoicingLastName', 'invoicingPhone', 'invoicingEmail'].forEach(field => {
        const fieldKey = field.replace('invoicing', '').toLowerCase();
        const value = invoicingData[fieldKey === 'firstname' ? 'firstName' : fieldKey === 'lastname' ? 'lastName' : fieldKey];
        const error = validateField(field, value);
        newErrors[field] = error;
        newTouched[field] = true;
      });
      
      // Validate Billing Address fields
      ['streetAddress', 'city', 'state', 'zipCode'].forEach(field => {
        const value = billingAddress[field];
        const error = validateField(field, value);
        newErrors[field] = error;
        newTouched[field] = true;
      });
      
      setErrors(prev => ({ ...prev, ...newErrors }));
      setTouched(prev => ({ ...prev, ...newTouched }));
      
      // Scroll to first error
      setTimeout(() => {
        const firstError = document.querySelector('.form-input.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }, 100);
    }
  }, [validationTrigger]);

  // Update context whenever local data changes
  useEffect(() => {
    // Format address only if there are values
    const addressParts = [
      billingAddress.streetAddress,
      billingAddress.city,
      `${billingAddress.state} ${billingAddress.zipCode}`.trim()
    ].filter(part => part); // Remove empty parts
    
    const formattedAddress = addressParts.join(', ');
    
    updateFormData('step3', {
      leadershipContacts: [
        {
          name: `${ceoData.firstName} ${ceoData.lastName}`.trim(),
          title: 'Chief Executive Officer (CEO)',
          workPhone: ceoData.phone,
          cellPhone: '',
          email: ceoData.email,
          sameAsPrimary: ceoData.sameAsPrimary,
        },
        {
          name: `${directorData.firstName} ${directorData.lastName}`.trim(),
          title: 'Director of Quality',
          workPhone: directorData.phone,
          cellPhone: '',
          email: directorData.email,
          sameAsPrimary: directorData.sameAsPrimary,
        },
        {
          name: `${invoicingData.firstName} ${invoicingData.lastName}`.trim(),
          title: 'Invoicing Contact',
          workPhone: invoicingData.phone,
          cellPhone: '',
          email: invoicingData.email,
          sameAsPrimary: invoicingData.sameAsPrimary,
        },
      ],
      billingAddress: {
        sameAsPrimary: false,
        address: formattedAddress,
        streetAddress: billingAddress.streetAddress,
        city: billingAddress.city,
        state: billingAddress.state,
        zipCode: billingAddress.zipCode,
      },
    });
  }, [ceoData, directorData, invoicingData, billingAddress]);

  return (
    <div className="form-step">
      <section className="section">
        <h2 className="section-title">Contact Information</h2>

        {/* CEO Contact Card */}
        <div className="contact-card">
          <h3 className="contact-card-title">Chief Executive Officer (CEO)</h3>

          <label className="checkbox">
            <input 
              type="checkbox" 
              name="ceoPrimary"
              checked={ceoData.sameAsPrimary}
              onChange={(e) => setCeoData(prev => ({ ...prev, sameAsPrimary: e.target.checked }))}
            />
            <span>Same as Primary Contact entered in Step 1</span>
          </label>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="ceoFirstName">
                First Name <span className="required">*</span>
              </label>
              <input
                id="ceoFirstName"
                name="ceoFirstName"
                type="text"
                className={`form-input ${errors.ceoFirstName && touched.ceoFirstName ? 'error' : ''}`}
                value={ceoData.firstName}
                onChange={(e) => {
                  setCeoData(prev => ({ ...prev, firstName: e.target.value }));
                  if (touched.ceoFirstName) {
                    const error = validateField('ceoFirstName', e.target.value);
                    setErrors(prev => ({ ...prev, ceoFirstName: error }));
                  }
                }}
                onBlur={(e) => handleBlur('ceoFirstName', e.target.value)}
              />
              {errors.ceoFirstName && touched.ceoFirstName && (
                <span className="error-message">{errors.ceoFirstName}</span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ceoLastName">
                Last Name <span className="required">*</span>
              </label>
              <input
                id="ceoLastName"
                name="ceoLastName"
                type="text"
                className={`form-input ${errors.ceoLastName && touched.ceoLastName ? 'error' : ''}`}
                value={ceoData.lastName}
                onChange={(e) => {
                  setCeoData(prev => ({ ...prev, lastName: e.target.value }));
                  if (touched.ceoLastName) {
                    const error = validateField('ceoLastName', e.target.value);
                    setErrors(prev => ({ ...prev, ceoLastName: error }));
                  }
                }}
                onBlur={(e) => handleBlur('ceoLastName', e.target.value)}
              />
              {errors.ceoLastName && touched.ceoLastName && (
                <span className="error-message">{errors.ceoLastName}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ceoPhone">
              Phone <span className="required">*</span>
            </label>
            <input
              id="ceoPhone"
              name="ceoPhone"
              type="tel"
              className={`form-input ${errors.ceoPhone && touched.ceoPhone ? 'error' : ''}`}
              value={ceoData.phone}
              onChange={(e) => {
                setCeoData(prev => ({ ...prev, phone: e.target.value }));
                if (touched.ceoPhone) {
                  const error = validateField('ceoPhone', e.target.value);
                  setErrors(prev => ({ ...prev, ceoPhone: error }));
                }
              }}
              onBlur={(e) => handleBlur('ceoPhone', e.target.value)}
            />
            {errors.ceoPhone && touched.ceoPhone && (
              <span className="error-message">{errors.ceoPhone}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ceoEmail">
              Email <span className="required">*</span>
            </label>
            <input
              id="ceoEmail"
              name="ceoEmail"
              type="email"
              className={`form-input ${errors.ceoEmail && touched.ceoEmail ? 'error' : ''}`}
              value={ceoData.email}
              onChange={(e) => {
                setCeoData(prev => ({ ...prev, email: e.target.value }));
                if (touched.ceoEmail) {
                  const error = validateField('ceoEmail', e.target.value);
                  setErrors(prev => ({ ...prev, ceoEmail: error }));
                }
              }}
              onBlur={(e) => handleBlur('ceoEmail', e.target.value)}
            />
            {errors.ceoEmail && touched.ceoEmail && (
              <span className="error-message">{errors.ceoEmail}</span>
            )}
          </div>
        </div>

        {/* Director of Quality Card */}
        <div className="contact-card">
          <h3 className="contact-card-title">Director of Quality</h3>

          <label className="checkbox">
            <input 
              type="checkbox" 
              name="directorPrimary"
              checked={directorData.sameAsPrimary}
              onChange={(e) => setDirectorData(prev => ({ ...prev, sameAsPrimary: e.target.checked }))}
            />
            <span>Same as Primary Contact entered in Step 1</span>
          </label>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="directorFirstName">
                First Name
              </label>
              <input
                id="directorFirstName"
                name="directorFirstName"
                type="text"
                className="form-input"
                value={directorData.firstName}
                onChange={(e) => setDirectorData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="directorLastName">
                Last Name
              </label>
              <input
                id="directorLastName"
                name="directorLastName"
                type="text"
                className="form-input"
                value={directorData.lastName}
                onChange={(e) => setDirectorData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="directorPhone">
              Phone
            </label>
            <input
              id="directorPhone"
              name="directorPhone"
              type="tel"
              className="form-input"
              value={directorData.phone}
              onChange={(e) => setDirectorData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="directorEmail">
              Email
            </label>
            <input
              id="directorEmail"
              name="directorEmail"
              type="email"
              className="form-input"
              value={directorData.email}
              onChange={(e) => setDirectorData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </div>

        {/* Invoicing Contact Card */}
        <div className="contact-card">
          <h3 className="contact-card-title">Invoicing Contact</h3>

          <label className="checkbox">
            <input 
              type="checkbox" 
              name="invoicingPrimary"
              checked={invoicingData.sameAsPrimary}
              onChange={(e) => setInvoicingData(prev => ({ ...prev, sameAsPrimary: e.target.checked }))}
            />
            <span>Same as Primary Contact entered in Step 1</span>
          </label>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="invoicingFirstName">
                First Name <span className="required">*</span>
              </label>
              <input
                id="invoicingFirstName"
                name="invoicingFirstName"
                type="text"
                className={`form-input ${errors.invoicingFirstName && touched.invoicingFirstName ? 'error' : ''}`}
                value={invoicingData.firstName}
                onChange={(e) => {
                  setInvoicingData(prev => ({ ...prev, firstName: e.target.value }));
                  if (touched.invoicingFirstName) {
                    const error = validateField('invoicingFirstName', e.target.value);
                    setErrors(prev => ({ ...prev, invoicingFirstName: error }));
                  }
                }}
                onBlur={(e) => handleBlur('invoicingFirstName', e.target.value)}
              />
              {errors.invoicingFirstName && touched.invoicingFirstName && (
                <span className="error-message">{errors.invoicingFirstName}</span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="invoicingLastName">
                Last Name <span className="required">*</span>
              </label>
              <input
                id="invoicingLastName"
                name="invoicingLastName"
                type="text"
                className={`form-input ${errors.invoicingLastName && touched.invoicingLastName ? 'error' : ''}`}
                value={invoicingData.lastName}
                onChange={(e) => {
                  setInvoicingData(prev => ({ ...prev, lastName: e.target.value }));
                  if (touched.invoicingLastName) {
                    const error = validateField('invoicingLastName', e.target.value);
                    setErrors(prev => ({ ...prev, invoicingLastName: error }));
                  }
                }}
                onBlur={(e) => handleBlur('invoicingLastName', e.target.value)}
              />
              {errors.invoicingLastName && touched.invoicingLastName && (
                <span className="error-message">{errors.invoicingLastName}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="invoicingPhone">
              Phone <span className="required">*</span>
            </label>
            <input
              id="invoicingPhone"
              name="invoicingPhone"
              type="tel"
              className={`form-input ${errors.invoicingPhone && touched.invoicingPhone ? 'error' : ''}`}
              value={invoicingData.phone}
              onChange={(e) => {
                setInvoicingData(prev => ({ ...prev, phone: e.target.value }));
                if (touched.invoicingPhone) {
                  const error = validateField('invoicingPhone', e.target.value);
                  setErrors(prev => ({ ...prev, invoicingPhone: error }));
                }
              }}
              onBlur={(e) => handleBlur('invoicingPhone', e.target.value)}
            />
            {errors.invoicingPhone && touched.invoicingPhone && (
              <span className="error-message">{errors.invoicingPhone}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="invoicingEmail">
              Email <span className="required">*</span>
            </label>
            <input
              id="invoicingEmail"
              name="invoicingEmail"
              type="email"
              className={`form-input ${errors.invoicingEmail && touched.invoicingEmail ? 'error' : ''}`}
              value={invoicingData.email}
              onChange={(e) => {
                setInvoicingData(prev => ({ ...prev, email: e.target.value }));
                if (touched.invoicingEmail) {
                  const error = validateField('invoicingEmail', e.target.value);
                  setErrors(prev => ({ ...prev, invoicingEmail: error }));
                }
              }}
              onBlur={(e) => handleBlur('invoicingEmail', e.target.value)}
            />
            {errors.invoicingEmail && touched.invoicingEmail && (
              <span className="error-message">{errors.invoicingEmail}</span>
            )}
          </div>

          {/* Billing Address Sub-section */}
          <div className="billing-section">
            <h4 className="billing-title">Billing Address</h4>

            <div className="form-group">
              <label className="form-label" htmlFor="streetAddress">
                Street Address <span className="required">*</span>
              </label>
              <input
                id="streetAddress"
                name="streetAddress"
                type="text"
                className={`form-input ${errors.streetAddress && touched.streetAddress ? 'error' : ''}`}
                value={billingAddress.streetAddress}
                onChange={(e) => {
                  setBillingAddress(prev => ({ ...prev, streetAddress: e.target.value }));
                  if (touched.streetAddress) {
                    const error = validateField('streetAddress', e.target.value);
                    setErrors(prev => ({ ...prev, streetAddress: error }));
                  }
                }}
                onBlur={(e) => handleBlur('streetAddress', e.target.value)}
              />
              {errors.streetAddress && touched.streetAddress && (
                <span className="error-message">{errors.streetAddress}</span>
              )}
            </div>

            <div className="form-row form-row-three">
              <div className="form-group">
                <label className="form-label" htmlFor="city">
                  City <span className="required">*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  className={`form-input ${errors.city && touched.city ? 'error' : ''}`}
                  value={billingAddress.city}
                  onChange={(e) => {
                    setBillingAddress(prev => ({ ...prev, city: e.target.value }));
                    if (touched.city) {
                      const error = validateField('city', e.target.value);
                      setErrors(prev => ({ ...prev, city: error }));
                    }
                  }}
                  onBlur={(e) => handleBlur('city', e.target.value)}
                />
                {errors.city && touched.city && (
                  <span className="error-message">{errors.city}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="state">
                  State <span className="required">*</span>
                </label>
                <select
                  id="state"
                  name="state"
                  className={`form-input ${errors.state && touched.state ? 'error' : ''}`}
                  value={billingAddress.state}
                  onChange={(e) => {
                    setBillingAddress(prev => ({ ...prev, state: e.target.value }));
                    if (touched.state) {
                      const error = validateField('state', e.target.value);
                      setErrors(prev => ({ ...prev, state: error }));
                    }
                  }}
                  onBlur={(e) => handleBlur('state', e.target.value)}
                >
                  <option value="">Select State</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  {/* Add more states as needed */}
                </select>
                {errors.state && touched.state && (
                  <span className="error-message">{errors.state}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="zipCode">
                  ZIP Code <span className="required">*</span>
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  className={`form-input ${errors.zipCode && touched.zipCode ? 'error' : ''}`}
                  value={billingAddress.zipCode}
                  onChange={(e) => {
                    setBillingAddress(prev => ({ ...prev, zipCode: e.target.value }));
                    if (touched.zipCode) {
                      const error = validateField('zipCode', e.target.value);
                      setErrors(prev => ({ ...prev, zipCode: error }));
                    }
                  }}
                  onBlur={(e) => handleBlur('zipCode', e.target.value)}
                />
                {errors.zipCode && touched.zipCode && (
                  <span className="error-message">{errors.zipCode}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FormStepThree;

