import DevicesAmountPerModel from './DevicesAmountPerModel/DevicesAmountPerModel';
import AgentsAndDevicesPerService from './AgentsAndDevicesPerService/AgentsAndDevicesPerService';

export default function Stats() {
	return (
		<div>
			<h2>Statistiques</h2>
			<DevicesAmountPerModel />
			<AgentsAndDevicesPerService />
		</div>
	);
}
