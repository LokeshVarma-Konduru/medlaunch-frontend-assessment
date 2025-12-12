import './ActionBar.css';

function ActionBar({ currentStep, totalSteps, onPrevious, onSave, onContinue, onExit }) {
  const isLastStep = currentStep === totalSteps;
  
  return (
    <div className="action-bar">
      <div className="action-left">
        <button 
          type="button" 
          className="btn btn-outline"
          onClick={currentStep === 1 ? onExit : onPrevious}
        >
          {currentStep === 1 ? 'Exit' : 'Previous'}
        </button>
      </div>

      <div className="action-center">
        {!isLastStep && (
        <button type="button" className="btn btn-solid" onClick={onSave}>
          Save
        </button>
        )}
        <button type="button" className="btn btn-solid" onClick={onContinue}>
          {isLastStep ? 'Submit Application' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

export default ActionBar;

