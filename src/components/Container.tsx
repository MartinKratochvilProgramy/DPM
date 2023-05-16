import React from 'react';

type PropsI = {
	className?: string | undefined;
	children: React.ReactNode;
};

const Container: React.FC<PropsI> = props => (
	<div
		className={`container p-8 mx-auto xl:px-8 ${
			props.className ? props.className : ''
		}`}>
		{props.children}
	</div>
);

export default Container;
