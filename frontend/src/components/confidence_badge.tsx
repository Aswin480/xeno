import React from 'react';

interface ConfidenceBadgeProps {
  score: number;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score }) => {
  const percentage = Math.round(score * 100);

  // SVG parameters
  const radius = 32;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score * circumference);

  const getColorClass = () => {
    if (score >= 0.85) return 'stroke-accent-emerald text-accent-emerald';
    if (score >= 0.70) return 'stroke-accent-amber text-accent-amber';
    return 'stroke-accent-rose text-accent-rose';
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="relative flex items-center justify-center">
        {/* Circle SVG */}
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="rgba(255,255,255,0.05)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            className={`transition-all duration-1000 ease-out ${getColorClass()}`}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <span className="absolute text-sm font-bold text-text-primary">{percentage}%</span>
      </div>
      <span className="text-[9px] uppercase font-bold text-text-muted tracking-wider">AI Confidence</span>
    </div>
  );
};
export default ConfidenceBadge;
