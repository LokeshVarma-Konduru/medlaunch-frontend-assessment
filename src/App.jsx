import { useState, useEffect } from 'react';
import { useFormContext } from './context/FormContext';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import FormStepOne from './components/FormStepOne';
import FormStepTwo from './components/FormStepTwo';
import FormStepThree from './components/FormStepThree';
import FormStepFour from './components/FormStepFour';
import FormStepFive from './components/FormStepFive';
import FormStepSix from './components/FormStepSix';
import ActionBar from './components/ActionBar';
import SupportChat from './components/SupportChat';
import './App.css';

const steps = [
  'DNV Quote Request',
  'Facility Details',
  'Leadership Contacts',
  'Site Information',
  'Services & Certifications',
  'Review & Submit',
];

function App() {
  const { getAllFormData, validateStep, triggerValidation } = useFormContext();
  const [currentStep, setCurrentStep] = useState(1);

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleContinue = () => {
    // Validate current step before proceeding
    if (!validateStep(currentStep)) {
      // Trigger validation to show all errors for current step
      triggerValidation(currentStep);
      // Scroll to top to see error messages
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If on last step (Review & Submit), handle submission
    if (currentStep === steps.length) {
      handleSubmit();
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleExit = () => {
    // Exit button does nothing - just for UI purposes
  };

  const handleSave = () => {
    const formData = getAllFormData();
    console.log('Form saved at step:', currentStep);
    console.log('Current form data:', formData);
    alert('Form progress saved!');
  };

  const handleSubmit = () => {
    const completeFormData = getAllFormData();
    
    console.log('='.repeat(80));
    console.log('FORM SUBMISSION - COMPLETE DATA');
    console.log('='.repeat(80));
    console.log(JSON.stringify(completeFormData, null, 2));
    console.log('='.repeat(80));
    
    alert('Form submitted successfully! Check the console (F12) to see the complete form data.');
  };

  const navigateToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <FormStepOne />;
      case 2:
        return <FormStepTwo />;
      case 3:
        return <FormStepThree />;
      case 4:
        return <FormStepFour />;
      case 5:
        return <FormStepFive />;
      case 6:
        return <FormStepSix onNavigateToStep={navigateToStep} />;
      default:
        return <div>Step {currentStep} - Coming soon</div>;
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="content-wrapper">
          <section className="progress-section">
            <ProgressBar
              title="New DNV Quote Request"
              currentStep={currentStep}
              steps={steps}
            />
          </section>

          <section className="form-card">
            {renderCurrentStep()}
          </section>

          <ActionBar
            currentStep={currentStep}
            totalSteps={steps.length}
            onPrevious={handlePrevious}
            onSave={handleSave}
            onContinue={handleContinue}
            onExit={handleExit}
          />
      </div>
      </main>
      <SupportChat />
      </div>
  );
}

export default App;
