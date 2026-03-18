"use client";

// Props for the FormInput component — extends standard HTML input attributes.
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

// Reusable form field with label, input and error message — used in EmployeeForm
const FormInput = ({ label, placeholder, error, ...props }: FormInputProps) => {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {label}
        </label>
        <input
          {...props}
          placeholder={placeholder}
          className="border-b border-gray-200 py-1.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-500 bg-transparent transition-colors"
        />
        {/*Displays validation error message if present — empty space reserved to prevent layout shift.*/}
        <p className="text-red-400 text-xs h-3">{error}</p>
      </div>
    </div>
  );
};

export default FormInput;
