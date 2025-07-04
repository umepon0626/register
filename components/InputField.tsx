import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = "0",
}) => {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select input text on focus for easier editing
    e.target.select();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Allow only numeric input, or an empty string for clearing the field.
    if (/^\d*$/.test(value)) {
      onChange(e);
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          id={id}
          name={id}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-right text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors pr-10"
          autoComplete="off"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-400 sm:text-sm">
            円
          </span>
        </div>
      </div>
    </div>
  );
};

export default InputField;
