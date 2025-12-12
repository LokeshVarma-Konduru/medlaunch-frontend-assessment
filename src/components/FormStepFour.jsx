import { useState, useRef, useEffect } from 'react';
import { useFormContext } from '../context/FormContext';
import './FormStepFour.css';

function FormStepFour() {
  const { formData, updateFormData } = useFormContext();
  const [selectedOption, setSelectedOption] = useState(formData.step4.siteConfiguration || '');
  const [uploadMethod, setUploadMethod] = useState(formData.step4.inputMethod || '');
  const [uploadedFiles, setUploadedFiles] = useState(() => {
    if (formData.step4.uploadedFileData) {
      return [formData.step4.uploadedFileData];
    }
    return [];
  });
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    updateFormData('step4', {
      siteConfiguration: selectedOption,
      inputMethod: uploadMethod,
      locations: uploadedFiles.length > 0 && uploadedFiles[0].locations 
        ? uploadedFiles[0].locations 
        : [],
      uploadedFile: uploadedFiles.length > 0 ? uploadedFiles[0].name : null,
      uploadedFileData: uploadedFiles.length > 0 ? uploadedFiles[0] : null,
    });
  }, [selectedOption, uploadMethod, uploadedFiles]);

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          
          const locations = lines.slice(1).map(line => {
            const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
            const cleanValues = values.map(v => v.trim().replace(/^"|"$/g, ''));
            
            // Combine address parts for display
            const street = cleanValues[1] || '';
            const city = cleanValues[2] || '';
            const state = cleanValues[3] || '';
            const zipCode = cleanValues[4] || '';
            const fullAddress = `${street}, ${city}, ${state} ${zipCode}`;
            
            return {
              name: cleanValues[0] || 'Unknown Location',
              address: fullAddress,
              ftes: cleanValues[5] || '0',
              shifts: cleanValues[6] || '0',
              milesToMain: cleanValues[7] || '0',
              daysOpen: cleanValues[8] || ''
            };
          });
          
          resolve(locations);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

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
    const newUploadingFiles = validFiles.map(file => {
      // Format file size - show KB for files under 1MB
      let fileSize;
      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB < 1) {
        fileSize = (file.size / 1024).toFixed(2) + ' KB';
      } else {
        fileSize = sizeInMB.toFixed(2) + ' MB';
      }
      
      return {
        id: Date.now() + Math.random(),
        name: file.name,
        size: fileSize,
        progress: 0,
        rawFile: file // Store the actual file for parsing
      };
    });

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
          
          // Move to uploaded files and parse CSV
          setTimeout(async () => {
            setUploadedFiles(prev => [...prev, fileObj]);
            setUploadingFiles(prev => prev.filter(f => f.id !== fileObj.id));
            
            // Parse CSV file if it exists
            if (fileObj.rawFile && fileObj.name.endsWith('.csv')) {
              try {
                const locations = await parseCSV(fileObj.rawFile);
                // Update formData with parsed locations
                updateFormData('step4', {
                  siteConfiguration: selectedOption,
                  inputMethod: uploadMethod,
                  locations: locations,
                  uploadedFile: fileObj.name,
                });
              } catch (error) {
                console.error('Error parsing CSV:', error);
              }
            }
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
    // Reset file input so user can re-upload the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="form-step">
      <section className="section">
        <h2 className="section-title">Do you have multiple sites or locations?</h2>

        <div className="option-cards">
          <div 
            className={`option-card ${selectedOption === 'single' ? 'selected' : ''}`}
            onClick={() => setSelectedOption(selectedOption === 'single' ? '' : 'single')}
          >
            <div className="option-content">
              <h3 className="option-title">Single Location</h3>
              <p className="option-description">We operate from one facility only</p>
            </div>
          </div>

          <div 
            className={`option-card ${selectedOption === 'multiple' ? 'selected' : ''}`}
            onClick={() => setSelectedOption(selectedOption === 'multiple' ? '' : 'multiple')}
          >
            <div className="option-content">
              <h3 className="option-title">Multiple Locations</h3>
              <p className="option-description">We have multiple facilities or practice locations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Show upload section only when Multiple Locations is selected */}
      {selectedOption === 'multiple' && (
        <section className="section">
          <h2 className="section-title">How would you like to add your site information?</h2>

          <div className="upload-method-card">
            <div 
              className={`upload-option ${uploadMethod === 'file-upload' ? 'selected' : ''}`}
              onClick={() => setUploadMethod(uploadMethod === 'file-upload' ? '' : 'file-upload')}
            >
              <div className="upload-option-content">
                <h3 className="upload-option-title">Upload CSV / Excel</h3>
                <p className="upload-option-description">Upload a spreadsheet with all site information</p>
              </div>
            </div>
          </div>

          {/* Show upload area when CSV option is selected */}
          {uploadMethod === 'file-upload' && (
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
                        <img src="/Document.svg" alt="Document" width="24" height="24" />
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
                        <img src="/Document.svg" alt="Document" width="24" height="24" />
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
