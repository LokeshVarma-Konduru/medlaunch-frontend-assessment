import './ProgressBar.css';

function ProgressBar({ title, currentStep, steps }) {
  return (
    <div className="progress-bar">
      <div className="progress-top">
        <h1 className="progress-title">{title}</h1>
        <span className="progress-step">
          Step {currentStep} of {steps.length}
        </span>
      </div>

      <div className="progress-track">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const fillWidth = isCompleted ? '100%' : isActive ? '80%' : '0%';
          const fillStateClass = isCompleted ? 'completed' : isActive ? 'active' : '';

          return (
            <div className="progress-segment" key={label}>
              <div className="segment-track">
                <div
                  className={`segment-fill ${fillStateClass}`}
                  style={{ width: fillWidth }}
                />
              </div>
              <div className="segment-label">{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressBar;

