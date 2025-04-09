import React from 'react';

interface CustomLinkProps {
	to: string;
	title: string;
	children?: React.ReactNode;
}

const CustomLink = (props: CustomLinkProps) => {
	// 检查链接
	const url =
		props.to.startsWith('http://') ||
		props.to.startsWith('https://') ||
		props.to.startsWith('mailto')
			? props.to
			: `//${props.to}`;

	return (
		<a className="link" title={props.title} href={url} target="_blank" rel="noreferrer">
			{props.children}
		</a>
	);
};

export default CustomLink;
