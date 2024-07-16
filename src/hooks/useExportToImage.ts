import { useEffect } from 'react';
// @ts-ignore
import { useScreenshot } from 'use-react-screenshot';

const useExportToImage = () => {
	const [image, takeScreenshot] = useScreenshot();
	const downloadScreenshot = () => {
		const link = document.createElement('a');
		link.href = image;
		link.download = `appareils_par_modèle_export_${Date.now()}.png`;
		link.click();
	};

	useEffect(() => {
		if (image) downloadScreenshot();
	}, [image]);

	return takeScreenshot;
};

export default useExportToImage;
