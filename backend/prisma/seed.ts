import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx'; // Import XLSX library

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const excelFilePath = path.join(__dirname, '..', '..', 'data', 'taco', 'Taco-4a-Edicao.xlsx');

  if (!fs.existsSync(excelFilePath)) {
    console.error(`Error: Excel file not found at ${excelFilePath}`);
    process.exit(1);
  }

  const workbook = XLSX.readFile(excelFilePath);
  const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
  const worksheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json(worksheet);

  // Clear existing Food data to prevent duplicates on re-seeding
  await prisma.food.deleteMany({});
  console.log('Cleared existing Food data.');

  for (const item of rawData) {
    // Map XLSX columns to Prisma Food model fields
    // IMPORTANT: Adjust these column names based on your actual Excel file headers
    const foodItem = {
      name: item['Alimento'] || item['Nome'] || 'Unknown Food',
      category: item['Grupo'] || item['Categoria'] || 'Unknown Category',
      calories: parseFloat(item['Energia (kcal)'] || item['Calorias'] || '0'),
      protein: parseFloat(item['Proteína (g)'] || item['Proteina'] || '0'),
      carbohydrates: parseFloat(item['Carboidrato (g)'] || item['Carboidratos'] || '0'),
      fat: parseFloat(item['Lipídios (g)'] || item['Gordura'] || '0'),
      fiber: parseFloat(item['Fibra Alimentar (g)'] || item['Fibra'] || '0'),
      sodium: parseFloat(item['Sódio (mg)'] || item['Sodio'] || '0'),
      calcium: parseFloat(item['Cálcio (mg)'] || item['Calcio'] || '0'),
      iron: parseFloat(item['Ferro (mg)'] || item['Ferro'] || '0'),
      magnesium: parseFloat(item['Magnésio (mg)'] || item['Magnesio'] || '0'),
      phosphorus: parseFloat(item['Fósforo (mg)'] || item['Fosforo'] || '0'),
      potassium: parseFloat(item['Potássio (mg)'] || item['Potassio'] || '0'),
      zinc: parseFloat(item['Zinco (mg)'] || item['Zinco'] || '0'),
      vitaminA: parseFloat(item['Vitamina A (mcg)'] || item['VitaminaA'] || '0'),
      vitaminB1: parseFloat(item['Vitamina B1 (mg)'] || item['VitaminaB1'] || '0'),
      vitaminB2: parseFloat(item['Vitamina B2 (mg)'] || item['VitaminaB2'] || '0'),
      vitaminB3: parseFloat(item['Vitamina B3 (mg)'] || item['VitaminaB3'] || '0'),
      vitaminB6: parseFloat(item['Vitamina B6 (mg)'] || item['VitaminaB6'] || '0'),
      vitaminB12: parseFloat(item['Vitamina B12 (mcg)'] || item['VitaminaB12'] || '0'),
      vitaminC: parseFloat(item['Vitamina C (mg)'] || item['VitaminaC'] || '0'),
      vitaminD: parseFloat(item['Vitamina D (mcg)'] || item['VitaminaD'] || '0'),
      vitaminE: parseFloat(item['Vitamina E (mg)'] || item['VitaminaE'] || '0'),
      folate: parseFloat(item['Folato (mcg)'] || item['Folato'] || '0'),
    };

    await prisma.food.create({ data: foodItem });
    console.log(`Created food item: ${foodItem.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
