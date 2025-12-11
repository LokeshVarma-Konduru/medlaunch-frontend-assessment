import { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
};

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    // Step 1: DNV Quote Request
    step1: {
      legalEntityName: '',
      dbaName: '',
      primaryContact: {
        name: '',
        title: '',
        workPhone: '',
        cellPhone: '',
        email: '',
        emailVerified: false,
        address: '',
      },
    },
    // Step 2: Facility Details
    step2: {
      facilityType: '', // 'hospital', 'ambulatory', 'urgent-care', 'other'
    },
    // Step 3: Leadership Contacts
    step3: {
      leadershipContacts: [
        {
          name: '',
          title: '',
          workPhone: '',
          cellPhone: '',
          email: '',
          sameAsPrimary: false,
        },
      ],
      billingAddress: {
        sameAsPrimary: false,
        address: '',
      },
    },
    // Step 4: Site Information
    step4: {
      siteConfiguration: '', // 'single' or 'multiple'
      inputMethod: '', // 'manual' or 'file-upload'
      locations: [],
      uploadedFile: null,
    },
    // Step 5: Services & Certifications
    step5: {
      services: [],
      otherService: '',
      standards: [],
      expirationDate: '',
      applicationDate: '',
      thrombolyticDates: [],
      thrombectomyDates: [],
    },
    // Step 6: Review & Submit
    step6: {
      agreedToTerms: false,
    },
  });

  const updateFormData = (step, data) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        ...data,
      },
    }));
  };

  const updateNestedFormData = (step, field, data) => {
    setFormData(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: data,
      },
    }));
  };

  const getAllFormData = () => formData;

  // Validation regex patterns
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\d\s\-\(\)]{10,}$/,  // At least 10 digits, allows various formats
    zipCode: /^\d{5}(-\d{4})?$/,  // 12345 or 12345-6789
  };

  // Helper to validate phone has at least 10 digits
  const isValidPhone = (phone) => {
    const digits = phone.replace(/\D/g, ''); // Remove non-digits
    return digits.length >= 10;
  };

  // Validate specific step
  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return (
          formData.step1.legalEntityName.trim() !== '' &&
          formData.step1.dbaName.trim() !== '' &&
          formData.step1.primaryContact.name.trim() !== '' &&
          formData.step1.primaryContact.title.trim() !== '' &&
          formData.step1.primaryContact.workPhone.trim() !== '' &&
          isValidPhone(formData.step1.primaryContact.workPhone) &&
          formData.step1.primaryContact.email.trim() !== '' &&
          patterns.email.test(formData.step1.primaryContact.email)
        );
      
      case 2:
        return formData.step2.facilityType !== '';
      
      case 3:
        // Only validate CEO contact (first contact) - others are optional
        const ceoContact = formData.step3.leadershipContacts[0];
        if (!ceoContact) return false;
        
        const ceoNameParts = ceoContact.name.trim().split(' ');
        return (
          ceoNameParts.length >= 2 &&
          ceoNameParts[0] !== '' &&
          ceoNameParts[1] !== '' &&
          ceoContact.workPhone.trim() !== '' &&
          isValidPhone(ceoContact.workPhone) &&
          ceoContact.email.trim() !== '' &&
          patterns.email.test(ceoContact.email)
        );
      
      case 4:
        return formData.step4.siteConfiguration !== '';
      
      case 5:
        return (
          formData.step5.services.length > 0 &&
          formData.step5.standards.length > 0
        );
      
      case 6:
        return formData.step6.agreedToTerms === true;
      
      default:
        return true;
    }
  };

  const resetForm = () => {
    setFormData({
      step1: {
        legalEntityName: '',
        dbaName: '',
        primaryContact: {
          name: '',
          title: '',
          workPhone: '',
          cellPhone: '',
          email: '',
          emailVerified: false,
          address: '',
        },
      },
      step2: {
        facilityType: '',
      },
      step3: {
        leadershipContacts: [
          {
            name: '',
            title: '',
            workPhone: '',
            cellPhone: '',
            email: '',
            sameAsPrimary: false,
          },
        ],
        billingAddress: {
          sameAsPrimary: false,
          address: '',
        },
      },
      step4: {
        siteConfiguration: '',
        inputMethod: '',
        locations: [],
        uploadedFile: null,
      },
      step5: {
        services: [],
        otherService: '',
        standards: [],
        expirationDate: '',
        applicationDate: '',
        thrombolyticDates: [],
        thrombectomyDates: [],
      },
      step6: {
        agreedToTerms: false,
      },
    });
  };

  const value = {
    formData,
    updateFormData,
    updateNestedFormData,
    getAllFormData,
    resetForm,
    validateStep,
    patterns,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

