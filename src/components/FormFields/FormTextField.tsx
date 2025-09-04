interface FormTextFieldProps {
  label: string;
  fieldValue: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormTextField: React.FC<FormTextFieldProps> = ({
  label,
  fieldValue,
  onChange,
}) => {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-800">
        {label}
      </label>
      <input
        value={fieldValue}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200"
      />
    </div>
  );
};
