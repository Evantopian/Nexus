interface DropdownProps<T> {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
  isEditMode: boolean;
}

const Dropdown = <T extends string>({
  label,
  value,
  options,
  onChange,
  isEditMode,
}: DropdownProps<T>) => {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      {isEditMode ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="mt-1 p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-800 dark:text-white"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      )}
    </div>
  );
};

export default Dropdown;
