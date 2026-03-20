interface EmptyStateProps {
  title: string;
  subtitle: string;
}

const EmptyState = ({ title, subtitle }: EmptyStateProps) => {
  return (
    <div>
      <div className="py-10 text-center">
        <p className="text-sm font-semibold text-gray-400">{title}</p>
        <p className="text-xs text-gray-300 mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

export default EmptyState;
