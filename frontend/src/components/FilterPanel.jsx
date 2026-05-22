import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function FilterPanel({ filters, onFilterChange }) {
  const [expandedFilters, setExpandedFilters] = useState({});

  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-soft-beige border-opacity-20 p-6">
      <h3 className="text-lg font-bold text-dark-gray mb-6">Filters</h3>

      {filters.map((filter) => (
        <div key={filter.id} className="mb-6 pb-6 border-b border-soft-beige border-opacity-20 last:border-0">
          {/* Filter Header */}
          <button
            onClick={() => toggleFilter(filter.id)}
            className="flex items-center justify-between w-full text-left font-medium text-dark-gray hover:text-sage-green transition-colors"
          >
            <span>{filter.label}</span>
            <FiChevronDown
              size={18}
              className={`transition-transform duration-300 ${
                expandedFilters[filter.id] ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Filter Options */}
          {expandedFilters[filter.id] && (
            <div className="mt-3 space-y-2">
              {filter.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={option.checked || false}
                    onChange={() =>
                      onFilterChange(filter.id, option.id, !option.checked)
                    }
                    className="w-4 h-4 rounded border-2 border-soft-beige accent-sage-green cursor-pointer"
                  />
                  <span className="text-neutral-gray group-hover:text-dark-gray transition-colors">
                    {option.label}
                    {option.count && <span className="text-xs ml-1">({option.count})</span>}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
