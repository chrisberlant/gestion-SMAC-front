import ZoomableComponent from '../ZoomableComponent/ZoomableComponent';
import DevicesAmountPerModel from './DevicesAmountPerModel/DevicesAmountPerModel';
import AgentsAndDevicesPerService from './AgentsAndDevicesPerService/AgentsAndDevicesPerService';

function Stats() {
	return (
		<ZoomableComponent>
			<DevicesAmountPerModel />
			<AgentsAndDevicesPerService />
		</ZoomableComponent>
	);
}

export default Stats;
