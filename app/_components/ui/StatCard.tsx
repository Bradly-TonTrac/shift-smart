interface StatCardProps {
  label: string;
  value: number;
  subtext: string;
  valueColor: string;
  subtextColor: string;
  dot?: string;
}

const StatCard = ({
  label,
  value,
  subtext,
  valueColor,
  subtextColor,
  dot,
}: StatCardProps) => {
  return (
    <div>
      <div className="flex flex-col gap-1 bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-6 items-center hover:shadow-md transition-all duration-200">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${dot} `} />
          <span className={`text-4xl font-bold ${valueColor}`}>{value}</span>
        </div>
        <span className={`text-xs ${subtextColor}`}>{subtext}</span>
      </div>
    </div>
  );
};

export default StatCard;
