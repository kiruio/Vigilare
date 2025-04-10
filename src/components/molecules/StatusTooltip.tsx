import React from 'react';

interface StatusTooltipProps {
	date: string;
	status: 'normal' | 'error' | 'none';
	uptime?: number;
	downTimes?: number;
	duration?: string;
}

const StatusTooltip: React.FC<StatusTooltipProps> = ({
	date,
	status,
	uptime,
	downTimes,
	duration,
}) => {
	const statusText = {
		normal: `可用率 ${uptime}%`,
		error: `故障 ${downTimes} 次，累计 ${duration}，可用率 ${uptime}%`,
		none: '无数据',
	}[status];

	return (
		<div className="flex flex-col">
			<div className="text-16px opacity-70">{date}</div>
			<div>{statusText}</div>
		</div>
	);
};

export default StatusTooltip;
