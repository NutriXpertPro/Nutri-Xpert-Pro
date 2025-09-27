export function calculateBodyFatPercentageNavy(
	sex: 'Masculino' | 'Feminino',
	height: number,
	neck: number,
	waist: number,
	hip?: number
): number {
	let bodyFatPercentage: number;

	if (sex === 'Feminino' && hip) {
		bodyFatPercentage = (163.205 * Math.log10(waist + hip - neck)) - (97.684 * Math.log10(height)) - 78.387;
	} else if (sex === 'Masculino') {
		bodyFatPercentage = (86.010 * Math.log10(waist - neck)) - (70.041 * Math.log10(height)) + 36.76;
	} else {
		return 0; // Or throw an error, depending on desired error handling
	}

	// Limit between 5% and 50%
	return Math.max(5, Math.min(50, bodyFatPercentage));
}