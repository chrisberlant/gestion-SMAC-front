import { useQuery } from '@tanstack/react-query';
import { ModelType } from '../types';
import fetchApi from './fetchApi';

//TODO changer les types
export const useGetAllAttributedLines = () => {
	return useQuery({
		queryKey: ['attributedLines'],
		queryFn: async () => {
			return (await fetchApi('/getAllLines/attributed')) as ModelType[];
		},
	});
};

export const useGetAllResiliatedLines = () => {
	return useQuery({
		queryKey: ['resiliatedLines'],
		queryFn: async () => {
			return (await fetchApi('/getAllLines/resiliated')) as ModelType[];
		},
	});
};
