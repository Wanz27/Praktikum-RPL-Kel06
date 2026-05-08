import React, { useState } from 'react';

function CustomDropdown({ options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="custom-select-container">
      <div
        className="dash-select custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{ color: value ? '#1a3252' : '#94a3b8', fontWeight: value ? 700 : 400 }}
      >
        {value || placeholder}
      </div>
      {isOpen && (
        <div className="custom-select-menu">
          {options.map(opt => (
            <div
              key={opt}
              className={`custom-select-option ${value === opt ? 'selected' : ''}`}
              onClick={() => { onChange(opt); setIsOpen(false); }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;
