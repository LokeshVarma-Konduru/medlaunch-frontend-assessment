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
  const [validationTrigger, setValidationTrigger] = useState({ step: 0, count: 0 });
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

  // Helper to validate phone has exactly 10 digits
  const isValidPhone = (phone) => {
    const digits = phone.replace(/\D/g, ''); // Remove non-digits
    return digits.length === 10;
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
        // Validate CEO contact (required)
        const ceoContact = formData.step3.leadershipContacts[0];
        if (!ceoContact) return false;
        
        const ceoNameParts = ceoContact.name.trim().split(' ');
        const ceoValid = (
          ceoNameParts.length >= 2 &&
          ceoNameParts[0] !== '' &&
          ceoNameParts[1] !== '' &&
          ceoContact.workPhone.trim() !== '' &&
          isValidPhone(ceoContact.workPhone) &&
          ceoContact.email.trim() !== '' &&
          patterns.email.test(ceoContact.email)
        );

        // Validate Invoicing contact (required)
        const invoicingContact = formData.step3.leadershipContacts[2];
        if (!invoicingContact) return false;
        
        const invoicingNameParts = invoicingContact.name.trim().split(' ');
        const invoicingValid = (
          invoicingNameParts.length >= 2 &&
          invoicingNameParts[0] !== '' &&
          invoicingNameParts[1] !== '' &&
          invoicingContact.workPhone.trim() !== '' &&
          isValidPhone(invoicingContact.workPhone) &&
          invoicingContact.email.trim() !== '' &&
          patterns.email.test(invoicingContact.email)
        );

        // Validate billing address (required) - check individual fields
        const billing = formData.step3.billingAddress;
        const isValidZip = /^\d{5}(-\d{4})?$/.test(billing.zipCode || '');
        const billingValid = (
          billing.streetAddress && billing.streetAddress.trim() !== '' &&
          billing.city && billing.city.trim() !== '' &&
          billing.state && billing.state.trim() !== '' &&
          billing.zipCode && billing.zipCode.trim() !== '' &&
          isValidZip
        );

        return ceoValid && invoicingValid && billingValid;
      
      case 4:
        // Stage 4 is optional - no asterisks in Figma
        return true;
      
      case 5:
        // Stage 5 is optional - no asterisks in Figma
        return true;
      
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

  const triggerValidation = (step) => {
    setValidationTrigger(prev => ({ step, count: prev.count + 1 }));
  };

  const value = {
    formData,
    updateFormData,
    updateNestedFormData,
    getAllFormData,
    resetForm,
    validateStep,
    triggerValidation,
    validationTrigger,
    patterns,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

