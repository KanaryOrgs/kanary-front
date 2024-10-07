import React, { useState } from 'react';
import "./Dropdown.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';


const Dropdown = ({ label, items, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="dropdown">
      <button onClick={toggleDropdown} className="dropdown-button">
        {label} <FontAwesomeIcon icon={faCaretDown} />
      </button>
      {isOpen && (
        <div className="dropdown-content">
          {items.map((item, index) => (
            <div key={index} className="dropdown-item" onClick={() => { onSelect(item); setIsOpen(false); }}>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Dropdown;