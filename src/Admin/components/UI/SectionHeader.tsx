import React from "react";

interface SectionHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-display font-bold text-gradient mb-2">
          {title}
        </h1>
        <p className="text-lavender-300 font-body">{description}</p>
      </div>
      {action}
    </div>
  );
};

export default SectionHeader;
