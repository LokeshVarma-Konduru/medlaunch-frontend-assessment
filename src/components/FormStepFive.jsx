import { useState, useRef, useEffect } from 'react';
import { useFormContext } from '../context/FormContext';
import './FormStepFive.css';

function FormStepFive() {
  const { formData, updateFormData } = useFormContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState(formData?.step5?.services || []);
  const [selectedStandards, setSelectedStandards] = useState(formData?.step5?.standards || []);
  const [expirationDate, setExpirationDate] = useState(formData?.step5?.expirationDate || '');
  const [applicationDate, setApplicationDate] = useState(formData?.step5?.applicationDate || '');
  const [thrombolyticDates, setThrombolyticDates] = useState(formData?.step5?.thrombolyticDates || []);
  const [thrombectomyDates, setThrombectomyDates] = useState(formData?.step5?.thrombectomyDates || []);
  const [thrombolyticInputType, setThrombolyticInputType] = useState('text');
  const [thrombectomyInputType, setThrombectomyInputType] = useState('text');
  const [showOtherService, setShowOtherService] = useState(false);
  const [otherServiceValue, setOtherServiceValue] = useState(formData?.step5?.otherService || '');
  const [activeTab, setActiveTab] = useState('All Services');

  // Refs for date inputs
  const expirationDateRef = useRef(null);
  const applicationDateRef = useRef(null);
  const thrombolyticDatesRef = useRef(null);
  const thrombectomyDatesRef = useRef(null);

  // Sync local state to global formContext
  useEffect(() => {
    updateFormData('step5', {
      services: selectedServices,
      otherService: otherServiceValue,
      standards: selectedStandards,
      expirationDate: expirationDate,
      applicationDate: applicationDate,
      thrombolyticDates: thrombolyticDates,
      thrombectomyDates: thrombectomyDates,
    });
  }, [selectedServices, selectedStandards, expirationDate, applicationDate, thrombolyticDates, thrombectomyDates, otherServiceValue]);

  const allServices = {
    'Emergency & Critical Care': {
      category: 'Clinical',
      items: [
        'Emergency Department',
        'Neonatal Intensive Care Services',
        'Pediatric Intensive Care Services',
        'Pediatric Intensive Care Services'
      ]
    },
    'Cardiac Services': {
      category: 'Specialty',
      items: [
        'Cardiac Catheterization Laboratory',
        'Open Heart'
      ]
    },
    'Diagnostic Services': {
      category: 'Diagnostic',
      items: [
        'Magnetic Resonance Imaging (MRI)',
        'Diagnostic Radioisotope Facility',
        'Lithotripsy'
      ]
    },
    'Rehabilitation Services': {
      category: 'Rehabilitation',
      items: [
        'Physical Rehabilitation Services',
        'Physical Therapy',
        'Occupational Therapy',
        'Speech/Language Therapy',
        'Audiology'
      ]
    }
  };

  const getFilteredServices = () => {
    if (activeTab === 'All Services') {
      return allServices;
    }
    
    const filtered = {};
    Object.entries(allServices).forEach(([key, value]) => {
      if (value.category === activeTab) {
        filtered[key] = value;
      }
    });
    return filtered;
  };

  const services = getFilteredServices();

  const handleServiceToggle = (service) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const removeStandard = (standard) => {
    setSelectedStandards(prev => prev.filter(s => s !== standard));
  };

  const handleStandardSelect = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue && selectedValue !== 'Select Standard(s)') {
      if (!selectedStandards.includes(selectedValue)) {
        setSelectedStandards(prev => [...prev, selectedValue]);
      }
      // Reset dropdown
      event.target.value = 'Select Standard(s)';
    }
  };

  const removeThrombolyticDate = (date) => {
    setThrombolyticDates(prev => prev.filter(d => d !== date));
  };

  const removeThrombectomyDate = (date) => {
    setThrombectomyDates(prev => prev.filter(d => d !== date));
  };

  const handleDateSelect = (event, fieldType) => {
    const selectedDate = event.target.value;
    if (selectedDate) {
      // Convert YYYY-MM-DD to MM/DD/YYYY format
      const [year, month, day] = selectedDate.split('-');
      const formattedDate = `${month}/${day}/${year}`;
      
      // Add date to the appropriate array based on fieldType
      if (fieldType === 'thrombolytic') {
        if (!thrombolyticDates.includes(formattedDate)) {
          setThrombolyticDates(prev => [...prev, formattedDate]);
        }
        // Reset to text input
        setThrombolyticInputType('text');
      } else if (fieldType === 'thrombectomy') {
        if (!thrombectomyDates.includes(formattedDate)) {
          setThrombectomyDates(prev => [...prev, formattedDate]);
        }
        // Reset to text input
        setThrombectomyInputType('text');
      }
      
      // Reset the date input
      event.target.value = '';
    }
  };

  const handleCalendarClick = (fieldType) => {
    if (fieldType === 'thrombolytic') {
      setThrombolyticInputType('date');
      setTimeout(() => {
        thrombolyticDatesRef.current?.showPicker();
      }, 10);
    } else if (fieldType === 'thrombectomy') {
      setThrombectomyInputType('date');
      setTimeout(() => {
        thrombectomyDatesRef.current?.showPicker();
      }, 10);
    }
  };

  const handleBlur = (fieldType) => {
    setTimeout(() => {
      if (fieldType === 'thrombolytic' && !thrombolyticDatesRef.current?.value) {
        setThrombolyticInputType('text');
      } else if (fieldType === 'thrombectomy' && !thrombectomyDatesRef.current?.value) {
        setThrombectomyInputType('text');
      }
    }, 200);
  };

  return (
    <div className="form-step">
      {/* Service Offering Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Service Offering</h2>
          <p className="section-subtitle">Primary Site Service offering</p>
        </div>

        <div className="tab-container">
          {['All Services', 'Clinical', 'Surgical', 'Diagnostic', 'Rehabilitation', 'Specialty'].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="services-grid">
          {Object.entries(services).map(([category, data]) => (
            <div key={category} className="service-category">
              <h3 className="category-title">{category}</h3>
              {data.items.map((service) => (
                <label key={service} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                  />
                  <span className="checkbox-label">{service}</span>
                </label>
              ))}
            </div>
          ))}
        </div>

        <button 
          type="button" 
          className="add-service-btn"
          onClick={() => setShowOtherService(true)}
        >
          + Add Other Service
        </button>

        {/* Other Service Input Section */}
        {showOtherService && (
          <div className="other-service-section">
            <h3 className="other-service-title">Other Service</h3>
            <div className="other-service-input-wrapper">
              <input
                type="text"
                className="other-service-input"
                placeholder="Specify other service"
                value={otherServiceValue}
                onChange={(e) => setOtherServiceValue(e.target.value)}
              />
              <button
                type="button"
                className="close-other-service-btn"
                onClick={() => {
                  setShowOtherService(false);
                  setOtherServiceValue('');
                }}
                aria-label="Close other service"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Standards to Apply Section */}
      <section className="section">
        <h2 className="section-title">Standards to Apply</h2>

        <div className={`form-group ${selectedStandards.length === 0 ? 'no-pills' : ''}`}>
          <select className="form-select" onChange={handleStandardSelect} defaultValue="Select Standard(s)">
            <option value="Select Standard(s)" disabled>Select Standard(s)</option>
            <option value="Action1">Action1</option>
            <option value="Action2">Action2</option>
            <option value="Action3">Action3</option>
          </select>
        </div>

        {/* Light Pills - Standards */}
        {selectedStandards.length > 0 && (
          <div className="pills-container">
            {selectedStandards.map((standard, index) => (
              <span key={index} className="pill pill-light">
                {standard}
                <button
                  type="button"
                  className="pill-remove pill-remove-light"
                  onClick={() => removeStandard(standard)}
                  aria-label={`Remove ${standard}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Date Fields */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Expiration Date of Current Stroke Certification
            </label>
            <div className="date-input-wrapper">
              <input 
                ref={expirationDateRef}
                type="date" 
                className="form-input"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
              <img 
                src="/calendar.svg" 
                alt="Calendar" 
                className="calendar-icon" 
                onClick={() => expirationDateRef.current?.showPicker()}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Date of Application</label>
            <div className="date-input-wrapper">
              <input 
                ref={applicationDateRef}
                type="date" 
                className="form-input"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
              />
              <img 
                src="/calendar.svg" 
                alt="Calendar" 
                className="calendar-icon" 
                onClick={() => applicationDateRef.current?.showPicker()}
              />
            </div>
          </div>
        </div>

        {/* Multiple Dates Section */}
        <div className="form-group">
          <label className="form-label">
            Dates of last twenty-five thrombolytic administrations
          </label>
          <div className="date-input-wrapper">
            <input
              ref={thrombolyticDatesRef}
              type={thrombolyticInputType}
              className="form-input"
              placeholder="mm/dd/yyyy, mm/dd/yyyy"
              onChange={(e) => handleDateSelect(e, 'thrombolytic')}
              onClick={() => handleCalendarClick('thrombolytic')}
              onBlur={() => handleBlur('thrombolytic')}
            />
            <img 
              src="/calendar.svg" 
              alt="Calendar" 
              className="calendar-icon" 
              onClick={() => handleCalendarClick('thrombolytic')}
            />
          </div>

          {/* Solid Blue Pills - Thrombolytic Dates */}
          {thrombolyticDates.length > 0 && (
            <div className="pills-container">
              {thrombolyticDates.map((date, index) => (
                <span key={index} className="pill pill-solid">
                  {date}
                  <button
                    type="button"
                    className="pill-remove pill-remove-solid"
                    onClick={() => removeThrombolyticDate(date)}
                    aria-label={`Remove ${date}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Dates of last fifteen thrombectomies</label>
          <div className="date-input-wrapper">
            <input
              ref={thrombectomyDatesRef}
              type={thrombectomyInputType}
              className="form-input"
              placeholder="mm/dd/yyyy, mm/dd/yyyy"
              onChange={(e) => handleDateSelect(e, 'thrombectomy')}
              onClick={() => handleCalendarClick('thrombectomy')}
              onBlur={() => handleBlur('thrombectomy')}
            />
            <img 
              src="/calendar.svg" 
              alt="Calendar" 
              className="calendar-icon" 
              onClick={() => handleCalendarClick('thrombectomy')}
            />
          </div>

          {/* Solid Blue Pills - Thrombectomy Dates */}
          {thrombectomyDates.length > 0 && (
            <div className="pills-container">
              {thrombectomyDates.map((date, index) => (
                <span key={index} className="pill pill-solid">
                  {date}
                  <button
                    type="button"
                    className="pill-remove pill-remove-solid"
                    onClick={() => removeThrombectomyDate(date)}
                    aria-label={`Remove ${date}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default FormStepFive;

