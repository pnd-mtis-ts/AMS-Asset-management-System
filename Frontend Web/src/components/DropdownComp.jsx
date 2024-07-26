import React, { useState, useEffect, useRef } from "react";

const DropdownComp = ({
  label,
  options,
  selectedOption,
  onOptionSelect,
  placeholder,
  name,
  displayKey,
  valueKey,
  enableSearch,
  notNull,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectOption = (option) => {
    onOptionSelect(name, option[valueKey]);
    setSearchTerm("");
    setIsOpen(false);
  };

  const filteredOptions = options.filter(
    (option) =>
      typeof option[displayKey] === "string" &&
      option[displayKey].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const selectedValue = options.filter(item => item[valueKey] === selectedOption).map(item => item[displayKey]);

  return (
    <div className="items-center flex my-3 w-full"> 
      <div className="label w-[50%]">{label}<span className={` ${notNull ? 'text-red-500' : 'hidden'}`}>*</span></div>
      <div className="relative inline-block w-full sm:w-64" ref={dropdownRef}>
        <div className="bg-gray-200 p-1 cursor-pointer border border-gray-300 rounded" onClick={toggleDropdown}>
          {selectedOption ? selectedValue : placeholder}
          <span className="float-right">{isOpen ? "▲" : "▼"}</span>
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded mt-1 z-10 shadow-lg justify-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="p-2 rounded-md border m-2"
              hidden={!enableSearch}
            />
            <ul className="max-h-[200px] overflow-auto mx-2">
              {enableSearch ? (
                filteredOptions.map((data, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectOption(data)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {data[displayKey]}
                </li>
              ))
              ) : (
                options.map((data, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectOption(data)}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                >
                  {data[valueKey]} {data[displayKey]}
                </li>
              ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownComp;
