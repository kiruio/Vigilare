import React from 'react';

interface CustomLinkProps {
	children?: React.ReactNode;
	style?: React.CSSProperties;
	className?: string;
}

const Tag = (props: CustomLinkProps) => {
	return (
		<span
			className={
				"box-border m-0 p-0 text-[rgba(0,0,0,0.88)] text-12px lh-20px list-none font--apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji' inline-block h-auto me-8px p-l-7px p-r-7px rd-16px whitespace-nowrap bg-[#fafafa] border-1px border-solid border-[#d9d9d9] border-rd-4px op-100 " +
				props.className
			}
			style={props.style}
		>
			{props.children}
		</span>
	);
};

export default Tag;
