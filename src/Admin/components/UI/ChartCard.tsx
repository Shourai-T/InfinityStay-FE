import React from "react";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
  return (
    <div className="card-luxury rounded-2xl p-8">
      <h3 className="text-xl font-heading font-bold text-white mb-6">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default ChartCard;
