import './servicesTable.css';
import { useMemo, useState } from 'react';
import {
	MantineReactTable,
	// createRow,
	type MRT_ColumnDef,
	type MRT_Row,
	type MRT_TableOptions,
	useMantineReactTable,
} from 'mantine-react-table';
import { ActionIcon, Button, Flex, Text, Tooltip } from '@mantine/core';
import { ModalsProvider, modals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import {
	QueryClient,
	QueryClientProvider,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { ServiceType } from '../../../@types/types';
import { useGetAllServices, useUpdateService } from '@utils/serviceQueries';

function ServicesTable2() {
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string | undefined>
	>({});
	//keep track of rows that have been edited
	const [editedServices, setEditedServices] = useState<
		Record<string, ServiceType>
	>({});

	//call CREATE hook
	// const { mutateAsync: createUser, isLoading: isCreatingUser } =
	// 	useCreateUser();

	//call READ hook
	const { data: services, isLoading, isError } = useGetAllServices();
	//call UPDATE hook
	const { mutateAsync: updateService } = useUpdateService();
	//call DELETE hook
	// const { mutateAsync: deleteUser, isLoading: isDeletingUser } =
	// 	useDeleteUser();

	//CREATE action
	// const handleCreateUser: MRT_TableOptions<User>['onCreatingRowSave'] =
	// 	async ({ values, exitCreatingMode }) => {
	// 		const newValidationErrors = validateUser(values);
	// 		if (Object.values(newValidationErrors).some((error) => !!error)) {
	// 			setValidationErrors(newValidationErrors);
	// 			return;
	// 		}
	// 		setValidationErrors({});
	// 		await createUser(values);
	// 		exitCreatingMode();
	// 	};

	//UPDATE action
	// const handleSaveUsers = async () => {
	// 	if (Object.values(validationErrors).some((error) => !!error)) return;
	// 	await updateUsers(Object.values(editedServices));
	// 	setEditedUsers({});
	// };

	//DELETE action
	// const openDeleteConfirmModal = (row: MRT_Row<ServiceType>) =>
	// 	modals.openConfirmModal({
	// 		title: 'Supprimer le service ?',
	// 		children: (
	// 			<Text>
	// 				Voulez-vous vraiment supprimer le service{' '}
	// 				{row.original.title} ? Cette action est irréversible.
	// 			</Text>
	// 		),
	// 		labels: { confirm: 'Supprimer', cancel: 'Annuler' },
	// 		confirmProps: { color: 'red' },
	// 		onConfirm: () => deleteUser(row.original.id),
	// 	});

	const columns = useMemo<MRT_ColumnDef<ServiceType>[]>(
		() => [
			{
				accessorKey: 'id',
				header: 'Id',
				enableEditing: false,
				size: 80,
			},
			{
				accessorKey: 'title',
				header: 'Title',
				mantineEditTextInputProps: ({ cell, row }) => ({
					type: 'string',
					required: true,
					error: validationErrors?.[cell.id],
					//store edited service in state to be saved later
					onBlur: (event) => {
						const validationError = !validateRequired(
							event.currentTarget.value
						)
							? 'Required'
							: undefined;
						setValidationErrors({
							...validationErrors,
							[cell.id]: validationError,
						});
						setEditedServices({
							...editedServices,
							[row.id]: row.original,
						});
					},
				}),
			},
		],
		[editedServices, validationErrors]
	);

	const table = useMantineReactTable({
		columns,
		data: services!,
		createDisplayMode: 'row', // ('modal', and 'custom' are also available)
		editDisplayMode: 'cell', // ('modal', 'row', 'cell', and 'custom' are also available)
		enableEditing: true,
		enableRowActions: true,
		positionActionsColumn: 'last',
		getRowId: (row) => row.id,
		mantineToolbarAlertBannerProps: isLoadingUsersError
			? {
					color: 'red',
					children: 'Error loading data',
			  }
			: undefined,
		mantineTableContainerProps: {
			sx: {
				minHeight: '500px',
			},
		},
		onCreatingRowCancel: () => setValidationErrors({}),
		onCreatingRowSave: handleCreateUser,
		renderRowActions: ({ row }) => (
			<Tooltip label='Delete'>
				<ActionIcon
					color='red'
					onClick={() => openDeleteConfirmModal(row)}
				>
					<IconTrash />
				</ActionIcon>
			</Tooltip>
		),
		renderBottomToolbarCustomActions: () => (
			<Flex align='center' gap='md'>
				<Button
					color='blue'
					onClick={handleSaveUsers}
					disabled={
						Object.keys(editedUsers).length === 0 ||
						Object.values(validationErrors).some((error) => !!error)
					}
					loading={isUpdatingUser}
				>
					Save
				</Button>
				{Object.values(validationErrors).some((error) => !!error) && (
					<Text color='red'>Fix errors before submitting</Text>
				)}
			</Flex>
		),
		renderTopToolbarCustomActions: ({ table }) => (
			<Button
				onClick={() => {
					table.setCreatingRow(true); //simplest way to open the create row modal with no default values
					//or you can pass in a row object to set default values with the `createRow` helper function
					// table.setCreatingRow(
					//   createRow(table, {
					//     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
					//   }),
					// );
				}}
			>
				Create New User
			</Button>
		),
		state: {
			isLoading: isLoading,
			isSaving: isUpdatingService, // || isDeletingUser,
			showAlertBanner: isError,
			showProgressBars: Error,
		},
	});

	return <MantineReactTable table={table} />;
}

//CREATE hook (post new user to api)
// function useCreateUser() {
// 	const queryClient = useQueryClient();
// 	return useMutation({
// 		mutationFn: async (user: User) => {
// 			//send api update request here
// 			await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
// 			return Promise.resolve();
// 		},
// 		//client side optimistic update
// 		onMutate: (newUserInfo: User) => {
// 			queryClient.setQueryData(
// 				['users'],
// 				(prevUsers: any) =>
// 					[
// 						...prevUsers,
// 						{
// 							...newUserInfo,
// 							id: (Math.random() + 1).toString(36).substring(7),
// 						},
// 					] as User[]
// 			);
// 		},
// 		// onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
// 	});
// }

//DELETE hook (delete user in api)
function useDeleteUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (userId: string) => {
			//send api update request here
			await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
			return Promise.resolve();
		},
		//client side optimistic update
		onMutate: (userId: string) => {
			queryClient.setQueryData(['users'], (prevUsers: any) =>
				prevUsers?.filter((user: User) => user.id !== userId)
			);
		},
		// onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
	});
}

const validateRequired = (value: string) => !!value?.length;
const validateEmail = (email: string) =>
	!!email.length &&
	email
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);

function validateUser(user: User) {
	return {
		firstName: !validateRequired(user.firstName)
			? 'First Name is Required'
			: '',
		lastName: !validateRequired(user.lastName)
			? 'Last Name is Required'
			: '',
		email: !validateEmail(user.email) ? 'Incorrect Email Format' : '',
	};
}

export default ServicesTable2;
