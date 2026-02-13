"use client";

interface FilterButtonsProps {
  activeFilter: "all" | "Y" | "N";
  onFilterChange: (filter: "all" | "Y" | "N") => void;
  counts: {
    all: number;
    compliant: number;
    nonCompliant: number;
  };
}

export default function FilterButtons({ activeFilter, onFilterChange, counts }: FilterButtonsProps) {
  const buttons = [
    { id: "all" as const, label: "All", count: counts.all, color: "gray" as const },
    { id: "Y" as const, label: "Compliant", count: counts.compliant, color: "green" as const },
    { id: "N" as const, label: "Non-Compliant", count: counts.nonCompliant, color: "red" as const },
  ];

  return (
    <div className="flex gap-1.5">
      {buttons.map((button) => {
        const isActive = activeFilter === button.id;
        
        const colorClasses: Record<"gray" | "green" | "red", string> = {
          gray: isActive
            ? ""
            : "bg-white text-gray-700 hover:bg-gray-50",
          green: isActive
            ? ""
            : "bg-white text-green-700 hover:bg-green-50",
          red: isActive
            ? ""
            : "bg-white text-red-700 hover:bg-red-50",
        };

        return (
          <button
            key={button.id}
            onClick={() => onFilterChange(button.id)}
            className={`px-3 py-1.5 rounded-md border font-medium text-xs transition-colors ${
              colorClasses[button.color]
            }`}
            style={isActive ? { backgroundColor: '#be1549', color: '#fdf2f7', borderColor: '#be1549' } : { borderColor: '#e5d0da' }}
          >
            {button.label}
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
              {button.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
