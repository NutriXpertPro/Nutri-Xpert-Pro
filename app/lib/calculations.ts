export interface BMRCalculation {
  bmr: number
  tdee: number
  massMagra: number
  massaGorda: number
  percentualGordura: number
}

export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  sex: 'Masculino' | 'Feminino'
): number {
  if (sex === 'Masculino') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
  }
}

export function getActivityFactor(activityLevel: string): number {
  const factors: { [key: string]: number } = {
    sedentario: 1.2,
    levemente_ativo: 1.375,
    moderadamente_ativo: 1.55,
    muito_ativo: 1.725,
    extremamente_ativo: 1.9
  }
  return factors[activityLevel] || 1.2
}

export function calculateTDEE(bmr: number, activityFactor: number): number {
  return bmr * activityFactor
}

export function calculateBodyComposition(
  weight: number,
  neck: number,
  waist: number,
  hip?: number,
  sex?: string
): { massMagra: number; massaGorda: number; percentualGordura: number } {
  // Fórmula simplificada para estimativa de gordura corporal
  let bodyFatPercentage: number
  
  if (sex === 'Feminino' && hip) {
    // Fórmula para mulheres (incluindo quadril)
    bodyFatPercentage = (163.205 * Math.log10(waist + hip - neck)) - (97.684 * Math.log10(170)) - 78.387
  } else {
    // Fórmula para homens
    bodyFatPercentage = (86.010 * Math.log10(waist - neck)) - (70.041 * Math.log10(170)) + 36.76
  }
  
  // Limitar entre 5% e 50%
  bodyFatPercentage = Math.max(5, Math.min(50, bodyFatPercentage))
  
  const massaGorda = (weight * bodyFatPercentage) / 100
  const massMagra = weight - massaGorda
  
  return {
    massMagra: Math.round(massMagra * 100) / 100,
    massaGorda: Math.round(massaGorda * 100) / 100,
    percentualGordura: Math.round(bodyFatPercentage * 100) / 100
  }
}

export function calculateMacros(calories: number, objetivo: string) {
  let proteinPercent: number
  let carbPercent: number
  let fatPercent: number
  
  switch (objetivo) {
    case 'emagrecimento':
      proteinPercent = 30
      carbPercent = 40
      fatPercent = 30
      break
    case 'ganho_massa':
      proteinPercent = 25
      carbPercent = 45
      fatPercent = 30
      break
    case 'ganho_peso':
      proteinPercent = 20
      carbPercent = 50
      fatPercent = 30
      break
    default:
      proteinPercent = 25
      carbPercent = 45
      fatPercent = 30
  }
  
  const protein = Math.round((calories * proteinPercent / 100) / 4) // 4 cal/g
  const carbs = Math.round((calories * carbPercent / 100) / 4) // 4 cal/g
  const fat = Math.round((calories * fatPercent / 100) / 9) // 9 cal/g
  
  return { protein, carbs, fat }
}