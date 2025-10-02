import { LucideIcon } from 'lucide-react';

interface FunctionalCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
  bgColor: string;
}

export default function FunctionalCard({ icon, title, description, bgColor }: FunctionalCardProps) {
  return (
    <div className={`bg-gradient-to-br ${bgColor} backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-brand-text-icon/20 hover:border-brand-text-icon/40 transition-all duration-300`}>
      <div className="flex flex-col items-start space-y-4">
        <div className="p-2 bg-brand-text-icon/10 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-white mb-2">{title}</h3>
          <p className="text-brand-text-light text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}