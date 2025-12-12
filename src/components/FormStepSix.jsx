import { useState, useEffect } from 'react';
import { useFormContext } from '../context/FormContext';
import './FormStepSix.css';

function FormStepSix({ onNavigateToStep }) {
  const { formData, updateFormData, validationTrigger } = useFormContext();
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    facilityDetails: true,
    leadershipContacts: true,
    siteInformation: true,
    servicesAndCertifications: true
  });
  
  const [showCheckboxError, setShowCheckboxError] = useState(false);
  // Initialize prevTrigger with current count to avoid showing error on mount
  const [prevTrigger, setPrevTrigger] = useState(validationTrigger?.count || 0);

  // Debug: Log formData to console
  console.log('FormStepSix - formData:', formData);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleEdit = (stepNumber) => {
    if (onNavigateToStep) {
      onNavigateToStep(stepNumber);
    }
  };

  // Helper function to get facility type display name
  const getFacilityTypeDisplay = (type) => {
    if (!type) return 'Not selected';
    const types = {
      'short-term': 'Short-Term Acute Care',
      'long-term': 'Long-Term Acute Care',
      'critical': 'Critical Access',
      'childrens': 'Children\'s',
      'psychiatric': 'Free-Standing Psychiatric',
      'other': 'Other'
    };
    return types[type] || type;
  };

  // Check if formData exists
  if (!formData) {
    return <div className="form-step">Loading form data...</div>;
  }

  // Check if form is completely empty (no data filled)
  const isFormEmpty = !formData.step1?.legalEntityName && 
                      !formData.step1?.dbaName && 
                      !formData.step1?.primaryContact?.name &&
                      !formData.step2?.facilityType &&
                      !formData.step3?.leadershipContacts?.[0]?.name;

  // Mock/Sample data for empty form
  const mockData = {
    basicInfo: {
      legalEntityName: 'Sample Hospital Corporation',
      dbaName: 'Sample Regional Medical Center',
      primaryContact: {
        name: 'John Doe',
        title: 'Chief Executive Officer',
        workPhone: '(555) 123-4567',
        cellPhone: '(555) 987-6543',
        email: 'john.doe@samplehospital.com',
        emailVerified: true,
        address: '123 Healthcare Way, Medical City, ST 12345'
      }
    },
    facilityDetails: {
      facilityType: 'Short-Term Acute Care'
    },
    leadershipContacts: {
      ceo: {
        name: 'John Doe',
        phone: '(555) 123-4567',
        email: 'john.doe@samplehospital.com'
      },
      directorOfQuality: {
        name: 'Jane Smith',
        phone: '(555) 234-5678',
        email: 'jane.smith@samplehospital.com'
      },
      invoicingContact: {
        name: 'Robert Brown',
        title: 'Invoicing Contact',
        phone: '(555) 456-7890',
        email: 'robert.brown@samplehospital.com',
        billingAddress: '456 Financial Plaza, Suite 200, Medical City, ST 12345'
      }
    },
    siteInformation: {
      configuration: 'Multiple Locations (3 sites)',
      inputMethod: 'File Upload',
      locations: [
        {
          name: 'Practice Location 1',
          address: '456 Medical Plaza, Suite 100 Healthcare City, ST 12346',
          ftes: '45',
          shifts: '2',
          milesToMain: '5',
          daysOpen: 'M, T, W, TH, F'
        },
        {
          name: 'Practice Location 2',
          address: '789 Wellness Blvd, Suburb Town, ST 12347',
          ftes: '30',
          shifts: '1',
          milesToMain: '12',
          daysOpen: 'M, T, W, TH, F, SA'
        },
        {
          name: 'Practice Location 3',
          address: '321 Care Center Drive, Rural County, ST 12348',
          ftes: '25',
          shifts: '1',
          milesToMain: '28',
          daysOpen: 'M, W, F'
        }
      ]
    },
    servicesAndCertifications: {
      services: ['Emergency Department', 'Cardiac Catheterization Lab', 'MRI', 'Physical Therapy', 'NICU', 'Obstetric Services'],
      otherService: '',
      standards: ['Action1', 'Action2'],
      expirationDate: '12/31/2025',
      applicationDate: '01/15/2024',
      thrombolyticDates: '01/15/2024, 02/20/2024, 03/10/2024',
      thrombectomyDates: '01/10/2024, 02/15/2024'
    }
  };

  // Use mock data if form is empty, otherwise use actual data
  const displayData = isFormEmpty ? mockData : {
    basicInfo: {
      legalEntityName: formData?.step1?.legalEntityName || 'Not provided',
      dbaName: formData?.step1?.dbaName || 'Not provided',
      primaryContact: {
        name: formData?.step1?.primaryContact?.name || 'Not provided',
        title: formData?.step1?.primaryContact?.title || 'Not provided',
        workPhone: formData?.step1?.primaryContact?.workPhone || 'Not provided',
        cellPhone: formData?.step1?.primaryContact?.cellPhone || 'Not provided',
        email: formData?.step1?.primaryContact?.email || 'Not provided',
        emailVerified: formData?.step1?.primaryContact?.emailVerified || false,
        address: formData?.step1?.primaryContact?.address || 'Not provided'
      }
    },
    facilityDetails: {
      facilityType: getFacilityTypeDisplay(formData?.step2?.facilityType) || 'Not selected'
    },
    leadershipContacts: {
      ceo: {
        name: formData?.step3?.leadershipContacts?.[0]?.name || 'Not provided',
        phone: formData?.step3?.leadershipContacts?.[0]?.workPhone || 'Not provided',
        email: formData?.step3?.leadershipContacts?.[0]?.email || 'Not provided'
      },
      directorOfQuality: {
        name: formData?.step3?.leadershipContacts?.[1]?.name || 'Not provided',
        phone: formData?.step3?.leadershipContacts?.[1]?.workPhone || 'Not provided',
        email: formData?.step3?.leadershipContacts?.[1]?.email || 'Not provided'
      },
      invoicingContact: {
        name: formData?.step3?.leadershipContacts?.[2]?.name || 'Not provided',
        title: formData?.step3?.leadershipContacts?.[2]?.title || 'Invoicing Contact',
        phone: formData?.step3?.leadershipContacts?.[2]?.workPhone || 'Not provided',
        email: formData?.step3?.leadershipContacts?.[2]?.email || 'Not provided',
        billingAddress: formData?.step3?.billingAddress?.address || 'Not provided'
      }
    },
    siteInformation: {
      configuration: formData?.step4?.siteConfiguration === 'single' 
        ? 'Single Location' 
        : formData?.step4?.siteConfiguration === 'multiple' 
        ? `Multiple Locations (${formData?.step4?.locations?.length || 0} sites)` 
        : 'Not selected',
      inputMethod: formData?.step4?.inputMethod === 'manual' 
        ? 'Manual Entry' 
        : formData?.step4?.inputMethod === 'file-upload' 
        ? 'File Upload' 
        : 'Not selected',
      locations: formData?.step4?.locations || []
    },
    servicesAndCertifications: {
      services: Array.isArray(formData?.step5?.services) ? formData.step5.services : [],
      otherService: formData?.step5?.otherService || '',
      standards: Array.isArray(formData?.step5?.standards) ? formData.step5.standards : [],
      expirationDate: formData?.step5?.expirationDate || 'Not provided',
      applicationDate: formData?.step5?.applicationDate || 'Not provided',
      thrombolyticDates: Array.isArray(formData?.step5?.thrombolyticDates) && formData.step5.thrombolyticDates.length > 0
        ? formData.step5.thrombolyticDates.join(', ') 
        : 'Not provided',
      thrombectomyDates: Array.isArray(formData?.step5?.thrombectomyDates) && formData.step5.thrombectomyDates.length > 0
        ? formData.step5.thrombectomyDates.join(', ') 
        : 'Not provided'
    }
  };

  // Listen for validation trigger - show error if checkbox not checked
  useEffect(() => {
    // Only validate if this trigger is for Step 6
    if (validationTrigger.step === 6 && validationTrigger.count > prevTrigger) {
      setPrevTrigger(validationTrigger.count);
      
      // Show error if checkbox not checked
      if (!formData.step6.agreedToTerms) {
        setShowCheckboxError(true);
        
        // Scroll to checkbox
        setTimeout(() => {
          const checkbox = document.querySelector('.checkbox-agreement');
          if (checkbox) {
            checkbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [validationTrigger]);

  const handleAgreementChange = (e) => {
    updateFormData('step6', { agreedToTerms: e.target.checked });
    // Clear error when checkbox is checked
    if (e.target.checked) {
      setShowCheckboxError(false);
    }
  };

  return (
    <div className="form-step review-step">
      <h2 className="review-main-title">Hospital Information</h2>

      {/* Basic Information */}
      <section className="review-section">
        <div className="review-section-header" onClick={() => toggleSection('basicInfo')}>
          <div className="header-left">
            <button type="button" className="collapse-btn" aria-label="Toggle section">
              <svg
                className={`collapse-icon ${expandedSections.basicInfo ? 'expanded' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h3 className="review-section-title">Basic Information</h3>
          </div>
          <button type="button" className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(1); }}>Edit</button>
        </div>
        {expandedSections.basicInfo && (
          <div className="review-content">
          <div className="review-row">
            <span className="review-label">Legal Entity Name</span>
            <span className="review-value">{displayData.basicInfo.legalEntityName}</span>
          </div>
          <div className="review-row">
            <span className="review-label">d/b/a Name</span>
            <span className="review-value">{displayData.basicInfo.dbaName}</span>
          </div>
          <div className="review-row">
            <span className="review-label">Primary Contact</span>
            <div className="review-value">
              <div className="contact-info">
                <p className="contact-name">{displayData.basicInfo.primaryContact.name}</p>
                <p className="contact-title">{displayData.basicInfo.primaryContact.title}</p>
                <p className="contact-detail">
                  Work: {displayData.basicInfo.primaryContact.workPhone} | Cell: {displayData.basicInfo.primaryContact.cellPhone}
                </p>
                <p className="contact-detail">
                  Email: {displayData.basicInfo.primaryContact.email}
                  <span className="verified-badge">Verified</span>
                </p>
                <p className="contact-detail">Address: {displayData.basicInfo.primaryContact.address}</p>
              </div>
            </div>
          </div>
        </div>
        )}
      </section>

      {/* Facility Details */}
      <section className="review-section">
        <div className="review-section-header" onClick={() => toggleSection('facilityDetails')}>
          <div className="header-left">
            <button type="button" className="collapse-btn" aria-label="Toggle section">
              <svg
                className={`collapse-icon ${expandedSections.facilityDetails ? 'expanded' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h3 className="review-section-title">Facility Details</h3>
          </div>
          <button type="button" className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(2); }}>Edit</button>
        </div>
        {expandedSections.facilityDetails && (
          <div className="review-content">
          <div className="review-row">
            <span className="review-label">Facility Type</span>
            <span className="review-value">{displayData.facilityDetails.facilityType}</span>
          </div>
        </div>
        )}
      </section>

      {/* Leadership Contacts */}
      <section className="review-section">
        <div className="review-section-header" onClick={() => toggleSection('leadershipContacts')}>
          <div className="header-left">
            <button type="button" className="collapse-btn" aria-label="Toggle section">
              <svg
                className={`collapse-icon ${expandedSections.leadershipContacts ? 'expanded' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h3 className="review-section-title">Leadership Contacts</h3>
          </div>
          <button type="button" className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(3); }}>Edit</button>
        </div>
        {expandedSections.leadershipContacts && (
          <div className="review-content">
          <div className="review-row">
            <span className="review-label">CEO</span>
            <div className="review-value">
              <div className="contact-info-compact">
                <p className="contact-name">{displayData.leadershipContacts.ceo.name}</p>
                <p className="contact-detail">Phone: {displayData.leadershipContacts.ceo.phone}</p>
                <p className="contact-detail">Email: {displayData.leadershipContacts.ceo.email}</p>
              </div>
            </div>
          </div>
          <div className="review-row">
            <span className="review-label">Director of Quality</span>
            <div className="review-value">
              <div className="contact-info-compact">
                <p className="contact-name">{displayData.leadershipContacts.directorOfQuality.name}</p>
                <p className="contact-detail">Phone: {displayData.leadershipContacts.directorOfQuality.phone}</p>
                <p className="contact-detail">Email: {displayData.leadershipContacts.directorOfQuality.email}</p>
              </div>
            </div>
          </div>
          <div className="review-row">
            <span className="review-label">Invoicing Contact</span>
            <div className="review-value">
              <div className="contact-info-compact">
                <p className="contact-name">{displayData.leadershipContacts.invoicingContact.name}</p>
                <p className="contact-detail">Title: {displayData.leadershipContacts.invoicingContact.title}</p>
                <p className="contact-detail">Phone: {displayData.leadershipContacts.invoicingContact.phone}</p>
                <p className="contact-detail">Email: {displayData.leadershipContacts.invoicingContact.email}</p>
                <p className="contact-detail">Billing Address: {displayData.leadershipContacts.invoicingContact.billingAddress}</p>
              </div>
            </div>
          </div>
        </div>
        )}
      </section>

      {/* Site Information */}
      <section className="review-section">
        <div className="review-section-header" onClick={() => toggleSection('siteInformation')}>
          <div className="header-left">
            <button type="button" className="collapse-btn" aria-label="Toggle section">
              <svg
                className={`collapse-icon ${expandedSections.siteInformation ? 'expanded' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h3 className="review-section-title">Site Information</h3>
          </div>
          <button type="button" className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(4); }}>Edit</button>
        </div>
        {expandedSections.siteInformation && (
          <div className="review-content">
          <div className="review-row">
            <span className="review-label">Site Configuration</span>
            <span className="review-value">{displayData.siteInformation.configuration}</span>
          </div>
          {formData?.step4?.siteConfiguration === 'multiple' && (
            <div className="review-row">
              <span className="review-label">Input Method</span>
              <div className="review-value">
                <div>{displayData.siteInformation.inputMethod}</div>
                {displayData.siteInformation.locations.map((location, index) => (
                  <div key={index} className="location-block">
                    <h4 className="location-title">{location.name}</h4>
                    <p className="location-detail">{location.address}</p>
                    <p className="location-detail">FTEs: {location.ftes} | Shifts: {location.shifts} | Miles to Main: {location.milesToMain}</p>
                    <p className="location-detail">Days Open: {location.daysOpen}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        )}
      </section>

      {/* Services & Certifications */}
      <section className="review-section">
        <div className="review-section-header" onClick={() => toggleSection('servicesAndCertifications')}>
          <div className="header-left">
            <button type="button" className="collapse-btn" aria-label="Toggle section">
              <svg
                className={`collapse-icon ${expandedSections.servicesAndCertifications ? 'expanded' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h3 className="review-section-title">Services & Certifications</h3>
          </div>
          <button type="button" className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(5); }}>Edit</button>
        </div>
        {expandedSections.servicesAndCertifications && (
          <div className="review-content">
          <div className="review-row">
            <span className="review-label">Services Provided</span>
            <div className="review-value">
              {displayData.servicesAndCertifications.services.length > 0 ? (
                <div className="pills-display">
                  {displayData.servicesAndCertifications.services.map((service, index) => (
                    <span key={index} className="display-pill">{service}</span>
                  ))}
                </div>
              ) : (
                <span>Not provided</span>
              )}
            </div>
          </div>
          <div className="review-row">
            <span className="review-label">Standards to Apply</span>
            <div className="review-value">
              {displayData.servicesAndCertifications.standards.length > 0 ? (
                <div className="pills-display">
                  {displayData.servicesAndCertifications.standards.map((standard, index) => (
                    <span key={index} className="display-pill bold">{standard}</span>
                  ))}
                </div>
              ) : (
                <span>Not provided</span>
              )}
            </div>
          </div>
          <div className="review-row">
            <span className="review-label">Date of Application</span>
            <span className="review-value">{displayData.servicesAndCertifications.applicationDate}</span>
          </div>
          <div className="review-row">
            <span className="review-label">Expiration Date of Current Stroke Certification</span>
            <span className="review-value">{displayData.servicesAndCertifications.expirationDate}</span>
          </div>
          <div className="review-row">
            <span className="review-label">Dates of last twenty-five thrombolytic administrations</span>
            <div className="review-value">
              {displayData.servicesAndCertifications.thrombolyticDates === 'Not provided' ? (
                <span>{displayData.servicesAndCertifications.thrombolyticDates}</span>
              ) : (
                <p className="dates-list">{displayData.servicesAndCertifications.thrombolyticDates}</p>
              )}
            </div>
          </div>
          <div className="review-row">
            <span className="review-label">Dates of last fifteen thrombectomies</span>
            <div className="review-value">
              {displayData.servicesAndCertifications.thrombectomyDates === 'Not provided' ? (
                <span>{displayData.servicesAndCertifications.thrombectomyDates}</span>
              ) : (
                <p className="dates-list">{displayData.servicesAndCertifications.thrombectomyDates}</p>
              )}
            </div>
          </div>
        </div>
        )}
      </section>

      {/* Ready to Submit */}
      <section className="submit-section">
        <h3 className="submit-title">Ready to Submit?</h3>
        <label className={`checkbox-agreement ${showCheckboxError ? 'error' : ''}`}>
          <input
            type="checkbox"
            checked={formData.step6.agreedToTerms}
            onChange={handleAgreementChange}
          />
          <span className="checkbox-label">
            I certify that all information provided is accurate and complete to the best of my knowledge <span className="required">*</span>
          </span>
        </label>
        {showCheckboxError && (
          <span className="error-message">Please check this box to confirm before submitting</span>
        )}
        <p className="submit-note">
          By submitting this form, you agree to our terms and conditions. DNV will review your application and contact you within 2-3 business days.
        </p>
        <div className="submit-actions">
          <button type="button" className="btn btn-outline">Download as PDF</button>
          <button type="button" className="btn btn-outline">Export to CSV</button>
        </div>
      </section>
    </div>
  );
}

export default FormStepSix;

