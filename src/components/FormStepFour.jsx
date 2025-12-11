import { useState, useRef, useEffect } from 'react';
import { useFormContext } from '../context/FormContext';
import './FormStepFour.css';

function FormStepFour() {
  const { formData, updateFormData } = useFormContext();
  const [selectedOption, setSelectedOption] = useState(formData.step4.siteConfiguration || '');
  const [uploadMethod, setUploadMethod] = useState(formData.step4.inputMethod || '');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Update context when selections change
  useEffect(() => {
    updateFormData('step4', {
      siteConfiguration: selectedOption,
      inputMethod: uploadMethod,
      locations: uploadedFiles.map(file => ({
        name: file.name,
        address: 'Pending file processing',
        ftes: 0,
        shifts: 0,
        milesToMain: 0,
        daysOpen: 'Pending'
      })),
      uploadedFile: uploadedFiles.length > 0 ? uploadedFiles[0].name : null,
    });
  }, [selectedOption, uploadMethod, uploadedFiles]);

  const handleFileUpload = (files) => {
    const fileArray = Array.from(files);
    
    // Filter for CSV/Excel files only
    const validFiles = fileArray.filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return ['csv', 'xlsx', 'xls'].includes(extension);
    });

    if (validFiles.length === 0) {
      alert('Please upload only CSV or Excel files');
      return;
    }

    // Add files to uploading state with progress
    const newUploadingFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
      progress: 0
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Simulate upload progress
    newUploadingFiles.forEach((fileObj) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        
        setUploadingFiles(prev => 
          prev.map(f => 
            f.id === fileObj.id ? { ...f, progress } : f
          )
        );

        if (progress >= 100) {
          clearInterval(interval);
          
          // Move to uploaded files
          setTimeout(() => {
            setUploadedFiles(prev => [...prev, fileObj]);
            setUploadingFiles(prev => prev.filter(f => f.id !== fileObj.id));
          }, 300);
        }
      }, 200);
    });
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="form-step">
      <section className="section">
        <h2 className="section-title">Do you have multiple sites or locations?</h2>

        <div className="option-cards">
          <label 
            className={`option-card ${selectedOption === 'single' ? 'selected' : ''}`}
            onClick={() => setSelectedOption('single')}
          >
            <input
              type="radio"
              name="siteType"
              value="single"
              checked={selectedOption === 'single'}
              onChange={() => setSelectedOption('single')}
            />
            <div className="option-content">
              <h3 className="option-title">Single Location</h3>
              <p className="option-description">We operate from one facility only</p>
            </div>
          </label>

          <label 
            className={`option-card ${selectedOption === 'multiple' ? 'selected' : ''}`}
            onClick={() => setSelectedOption('multiple')}
          >
            <input
              type="radio"
              name="siteType"
              value="multiple"
              checked={selectedOption === 'multiple'}
              onChange={() => setSelectedOption('multiple')}
            />
            <div className="option-content">
              <h3 className="option-title">Multiple Locations</h3>
              <p className="option-description">We have multiple facilities or practice locations</p>
            </div>
          </label>
        </div>
      </section>

      {/* Show upload section only when Multiple Locations is selected */}
      {selectedOption === 'multiple' && (
        <section className="section">
          <h2 className="section-title">How would you like to add your site information?</h2>

          <div className="upload-method-card">
            <label 
              className={`upload-option ${uploadMethod === 'csv' ? 'selected' : ''}`}
              onClick={() => setUploadMethod('csv')}
            >
              <input
                type="radio"
                name="uploadMethod"
                value="csv"
                checked={uploadMethod === 'csv'}
                onChange={() => setUploadMethod('csv')}
              />
              <div className="upload-option-content">
                <h3 className="upload-option-title">Upload CSV / Excel</h3>
                <p className="upload-option-description">Upload a spreadsheet with all site information</p>
              </div>
            </label>
          </div>

          {/* Show upload area when CSV option is selected */}
          {uploadMethod === 'csv' && (
            <div className="upload-wrapper">
              <div className="upload-area-container">
                <div 
                  className={`upload-area ${isDragging ? 'dragging' : ''}`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="upload-icon">
                    <img 
                      src="/Upload.svg" 
                      alt="Upload" 
                      width="48" 
                      height="48"
                    />
                  </div>
                  <h3 className="upload-title">Upload Site Information</h3>
                  <p className="upload-subtitle">Drag and drop your CSV or Excel file here, or click to select</p>
                  
                  <button type="button" className="select-file-btn" onClick={handleSelectFile}>
                    Select file
                  </button>
                  
                  <button type="button" className="download-template-link">
                    Download CSV Template
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                    multiple
                  />
                </div>
              </div>

              {/* Show uploaded and uploading files - OUTSIDE the dashed border */}
              {(uploadedFiles.length > 0 || uploadingFiles.length > 0) && (
                <div className="uploaded-section">
                  <h4 className="uploaded-title">Uploaded</h4>
                  
                  {/* Completed uploaded files - show Preview AND X button */}
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="file-item completed">
                      <div className="file-icon">
                        <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 0H2C0.9 0 0 0.9 0 2V22C0 23.1 0.9 24 2 24H18C19.1 24 20 23.1 20 22V8L12 0Z" fill="#0056A3"/>
                        </svg>
                      </div>
                      <div className="file-info">
                        <span className="file-name">{file.name}</span>
                        <span className="file-separator">•</span>
                        <button type="button" className="file-preview-link">Preview</button>
                      </div>
                      <span className="file-size">{file.size}</span>
                      <button 
                        type="button" 
                        className="file-remove-btn"
                        onClick={() => handleRemoveFile(file.id)}
                        aria-label="Remove file"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4L4 12M4 4L12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}

                  {/* Currently uploading files - show progress bar and X button */}
                  {uploadingFiles.map(file => (
                    <div key={file.id} className="file-item uploading">
                      <div className="file-icon">
                        <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 0H2C0.9 0 0 0.9 0 2V22C0 23.1 0.9 24 2 24H18C19.1 24 20 23.1 20 22V8L12 0Z" fill="#0056A3"/>
                        </svg>
                      </div>
                      <div className="file-details-uploading">
                        <div className="file-top-row">
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">{file.size}</span>
                        </div>
                        <div className="file-progress-bar">
                          <div 
                            className="file-progress-fill" 
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="file-remove-btn"
                        onClick={() => setUploadingFiles(prev => prev.filter(f => f.id !== file.id))}
                        aria-label="Remove file"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4L4 12M4 4L12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default FormStepFour;
