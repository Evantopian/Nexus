import { Filter } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  active?: boolean;
}

interface FilterBarProps {
  options: FilterOption[];
  onFilterChange?: (filterId: string) => void;
}

const FilterBar = ({ options, onFilterChange }: FilterBarProps) => {
  return (
    <div className="bg-gray-200 dark:bg-gray-700 rounded-md p-3 mb-6 flex flex-wrap gap-2 items-center">
      <div className="flex items-center">
        <Filter className="h-4 w-4 text-gray-700 dark:text-gray-300 mr-2" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">
          Filters:
        </span>
      </div>
      <div className="flex space-x-2 overflow-x-auto pb-1 hide-scrollbar">
        {options.map((option) => (
          <button
            key={option.id}
            className={`${option.active ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300" : "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"} rounded-md px-3 py-1 text-xs font-medium hover:${option.active ? "bg-indigo-200 dark:bg-indigo-800" : "bg-gray-200 dark:bg-gray-500"}`}
            onClick={() => onFilterChange && onFilterChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
