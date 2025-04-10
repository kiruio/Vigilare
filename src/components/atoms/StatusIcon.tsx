import React from 'react';

interface StatusIconProps {
	color: string;
	afterColor: string;
	className?: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({
	color = 'bg-normal',
	afterColor = 'bg-normal',
	className,
}) => {
	return (
		<div
			className={`rounded-full relative
      max-md:w-30px max-md:min-w-30px max-md:h-30px
      max-md:after:w-30px max-md:after:w-30px
      max-sm:hidden
      after:content-empty after:absolute after:inset-0 after:rounded-full 
      after:animate-breathing after:animate-duration-2s after:animate-iteration-infinite
      ${color} after:${afterColor} ${className}`}
		/>
	);
};

export default StatusIcon;
