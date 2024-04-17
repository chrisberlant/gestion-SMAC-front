import { getModifiedValues } from '../src/utils';

describe('Get modified values between two objects', () => {
	const originalObject = {
		id: 1,
		firstName: 'John',
		lastName: 'Smith',
		email: 'john.smith@gmail.com',
	};
	const originalObjectCopy = { ...originalObject };
	const updatedObject = {
		id: 1,
		email: 'jane.smith@gmail.com',
		lastName: 'Smith',
		firstName: 'Jane',
	};

	const { id: firstId, ...originalObjectWithoutId } = originalObject;
	const { id: secondId, ...updatedObjectWithoutId } = updatedObject;

	it('should return only id property', () => {
		const result = getModifiedValues(originalObject, originalObjectCopy);
		expect(result).toStrictEqual({ id: 1 });
	});

	it('should return id, firstName and email properties', () => {
		const result = getModifiedValues(originalObject, updatedObject);
		expect(result).toStrictEqual({
			id: 1,
			firstName: 'Jane',
			email: 'jane.smith@gmail.com',
		});
	});

	it('should return firstName and email properties', () => {
		const result = getModifiedValues(
			originalObjectWithoutId,
			updatedObjectWithoutId
		);
		expect(result).toStrictEqual({
			firstName: 'Jane',
			email: 'jane.smith@gmail.com',
		});
	});
});
