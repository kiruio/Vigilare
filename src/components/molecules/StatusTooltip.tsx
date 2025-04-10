import React from 'react';
import { useI18n } from '../../hooks/useLocales';

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
	const { t } = useI18n();
	const statusText = {
		normal: t('card.detail.normal').replace('{percent}', uptime!.toString()),
		error: t('card.detail.error')
			.replace('{times}', downTimes!.toString())
			.replace('{duration}', duration!)
			.replace('{percent}', uptime!.toString()), //`故障 ${downTimes} 次，累计 ${duration}，可用率 ${uptime}%`,
		none: t('card.detail.unknown'),
	}[status];

	return (
		<div className="flex flex-col">
			<div className="text-16px opacity-70">{date}</div>
			<div>{statusText}</div>
		</div>
	);
};

export default StatusTooltip;
