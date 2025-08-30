import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconStyle: string;
  textStyle: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconStyle,
  textStyle,
}) => {
  return (
    <div className="card-luxury rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lavender-400 font-body text-sm">{title}</p>
          <p className={`text-2xl font-heading font-bold ${textStyle}`}>
            {value}
          </p>
        </div>
        <div
          className={`w-12 h-12 ${iconStyle} rounded-xl flex items-center justify-center`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
