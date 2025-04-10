import React from 'react';

interface CustomLinkProps {
	to: string;
	title: string;
	children?: React.ReactNode;
	className?: string;
}

const CustomLink: React.FC<CustomLinkProps> = ({ to, title, children, className }) => {
	const normalizedUrl = /^(https?:|mailto:)/.test(to) ? to : `//${to}`;

	return (
		<a
			className={`text-secondary hover:text-primary font-bold transition-colors duration-300 ${className}`}
			href={normalizedUrl}
			target="_blank"
			rel="noreferrer"
			title={title}
		>
			{children}
		</a>
	);
};

export default CustomLink;
