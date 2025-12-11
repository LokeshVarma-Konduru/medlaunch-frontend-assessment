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
    });
  };

  const value = {
    formData,
    updateFormData,
    updateNestedFormData,
    getAllFormData,
    resetForm,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

