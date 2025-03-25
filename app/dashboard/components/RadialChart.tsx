import React from 'react';

interface RadialChartProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
}

const RadialChart: React.FC<RadialChartProps> = ({
    percentage,
    size = 120,
    strokeWidth = 30
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="bg-transparent h-max w-max p-1 overflow-hidden">
            <div className='flex flex-col items-center justify-start '>
              {/* <RadialChart percentage={50} /> */}
                <div className="relative" style={{ width: size, height: size / 2 }}>
                    <svg
                        className="transform rotate-180"
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                    >
                        <circle
                            className="text-black"
                            strokeWidth={strokeWidth}
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx={size / 2}
                            cy={size / 2}
                        />
                        <circle
                            className="text-[#7C3AED]"
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx={size / 2}
                            cy={size / 2}
                        />
                    </svg>

                </div>
            </div>
          </div>
       
    );
};

export default RadialChart;