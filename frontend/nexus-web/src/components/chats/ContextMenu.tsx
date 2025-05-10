import React, { useEffect } from "react";

export interface ContextMenuOption {
  label: string;
  onClick: () => void;
}

interface ContextMenuProps {
  x: number;
  y: number;
  options: ContextMenuOption[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, options, onClose }) => {
  useEffect(() => {
    const handle = () => onClose();
    window.addEventListener("click", handle);
    return () => window.removeEventListener("click", handle);
  }, [onClose]);

  return (
    <ul
      className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden"
      style={{ top: y, left: x, minWidth: 160 }}
    >
      {options.map(({ label, onClick }) => (
        <li
          key={label}
          onClick={() => { onClick(); onClose(); }}
          className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          {label}
        </li>
      ))}
    </ul>
  );
};

export default ContextMenu;
