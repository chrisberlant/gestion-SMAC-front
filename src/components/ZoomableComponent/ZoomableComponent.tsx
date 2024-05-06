import { Slider } from '@mantine/core';
import { ReactNode, useState } from 'react';

interface ZoomableComponentProps {
	children: ReactNode;
	className?: string;
}

export default function ZoomableComponent({
	children,
	className,
}: ZoomableComponentProps) {
	const [zoom, setZoom] = useState(100);
	return (
		<>
			<Slider
				pos='absolute'
				right={50}
				color='blue'
				size='sm'
				min={50}
				max={100}
				step={5}
				label={(value) => `${value}%`}
				marks={[{ value: 50 }, { value: 75 }, { value: 100 }]}
				value={zoom}
				onChange={setZoom}
				w={100}
			/>
			<div
				style={{ transform: `scale(${zoom / 100})` }}
				className={className}
			>
				{children}
			</div>
		</>
	);
}
