import ZoomableComponent from '../ZoomableComponent/ZoomableComponent';
import DevicesAmountPerModel from './DevicesAmountPerModel/DevicesAmountPerModel';
import AgentsAndDevicesPerService from './AgentsAndDevicesPerService/AgentsAndDevicesPerService';

export default function Stats() {
	return (
		<ZoomableComponent className='stats'>
			<DevicesAmountPerModel />
			<AgentsAndDevicesPerService />
		</ZoomableComponent>
	);
}
