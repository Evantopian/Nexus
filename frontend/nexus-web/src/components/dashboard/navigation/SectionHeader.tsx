interface SectionHeaderProps {
  title: string;
  expanded: boolean;
}

const SectionHeader = ({ title, expanded }: SectionHeaderProps) => (
  <div className="flex items-center px-3 py-2">
    {expanded ? (
      <h3 className="text-xs font-semibold text-gray-500">{title}</h3>
    ) : (
      <div className="w-full border-t border-gray-200 my-2"></div>
    )}
  </div>
);

export default SectionHeader;
