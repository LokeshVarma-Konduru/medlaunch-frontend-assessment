import { useState, useEffect } from 'react';
import { useFormContext } from '../context/FormContext';
import './FormStepThree.css';

function FormStepThree() {
  const { formData, updateFormData } = useFormContext();
  
  const [ceoData, setCeoData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    sameAsPrimary: false,
  });

  const [directorData, setDirectorData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    sameAsPrimary: false,
  });

  const [invoicingData, setInvoicingData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    sameAsPrimary: false,
  });

  const [billingAddress, setBillingAddress] = useState({
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
  });

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
    }
  }, [invoicingData.sameAsPrimary, formData.step1.primaryContact]);

  // Update context whenever local data changes
  useEffect(() => {
    updateFormData('step3', {
      leadershipContacts: [
        {
          name: `${ceoData.firstName} ${ceoData.lastName}`.trim(),
          title: 'Chief Executive Officer (CEO)',
          workPhone: ceoData.phone,
          cellPhone: '',
          email: ceoData.email,
        },
        {
          name: `${directorData.firstName} ${directorData.lastName}`.trim(),
          title: 'Director of Quality',
          workPhone: directorData.phone,
          cellPhone: '',
          email: directorData.email,
        },
        {
          name: `${invoicingData.firstName} ${invoicingData.lastName}`.trim(),
          title: 'Invoicing Contact',
          workPhone: invoicingData.phone,
          cellPhone: '',
          email: invoicingData.email,
        },
      ],
      billingAddress: {
        sameAsPrimary: false,
        address: `${billingAddress.streetAddress}, ${billingAddress.city}, ${billingAddress.state} ${billingAddress.zipCode}`.trim(),
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
                className="form-input"
                value={ceoData.firstName}
                onChange={(e) => setCeoData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="ceoLastName">
                Last Name <span className="required">*</span>
              </label>
              <input
                id="ceoLastName"
                name="ceoLastName"
                type="text"
                className="form-input"
                value={ceoData.lastName}
                onChange={(e) => setCeoData(prev => ({ ...prev, lastName: e.target.value }))}
              />
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
              className="form-input"
              value={ceoData.phone}
              onChange={(e) => setCeoData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ceoEmail">
              Email <span className="required">*</span>
            </label>
            <input
              id="ceoEmail"
              name="ceoEmail"
              type="email"
              className="form-input"
              value={ceoData.email}
              onChange={(e) => setCeoData(prev => ({ ...prev, email: e.target.value }))}
            />
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
                className="form-input"
                value={invoicingData.firstName}
                onChange={(e) => setInvoicingData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="invoicingLastName">
                Last Name <span className="required">*</span>
              </label>
              <input
                id="invoicingLastName"
                name="invoicingLastName"
                type="text"
                className="form-input"
                value={invoicingData.lastName}
                onChange={(e) => setInvoicingData(prev => ({ ...prev, lastName: e.target.value }))}
              />
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
              className="form-input"
              value={invoicingData.phone}
              onChange={(e) => setInvoicingData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="invoicingEmail">
              Email <span className="required">*</span>
            </label>
            <input
              id="invoicingEmail"
              name="invoicingEmail"
              type="email"
              className="form-input"
              value={invoicingData.email}
              onChange={(e) => setInvoicingData(prev => ({ ...prev, email: e.target.value }))}
            />
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
                className="form-input"
                value={billingAddress.streetAddress}
                onChange={(e) => setBillingAddress(prev => ({ ...prev, streetAddress: e.target.value }))}
              />
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
                  className="form-input"
                  value={billingAddress.city}
                  onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="state">
                  State <span className="required">*</span>
                </label>
                <select
                  id="state"
                  name="state"
                  className="form-input"
                  value={billingAddress.state}
                  onChange={(e) => setBillingAddress(prev => ({ ...prev, state: e.target.value }))}
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
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="zipCode">
                  ZIP Code <span className="required">*</span>
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  className="form-input"
                  value={billingAddress.zipCode}
                  onChange={(e) => setBillingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FormStepThree;

