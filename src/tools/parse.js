import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const parse_items = (jsonData) => {
  const item_native_class = "/Script/CoreUObject.Class'/Script/FactoryGame.FGItemDescriptor'";
  const targetObject = jsonData.find(item => item.NativeClass === item_native_class);

  if (!targetObject) {
    throw new Error('Item class not found');
  }

  return targetObject.Classes.map(item => ({
      name: item.mDisplayName,
      description: item.mDescription,
      energyValue: item.mEnergyValue,
      radioactiveDecay: item.mRadioactiveDecay
    }
  ));
}

const parse_recipes = (jsonData) => {
  const recipe_native_class = "/Script/CoreUObject.Class'/Script/FactoryGame.FGRecipe'";
  const targetObject = jsonData.find(item => item.NativeClass === recipe_native_class);

  if (!targetObject) {
    throw new Error('Recipe class not found');
  }

  return targetObject.Classes.map(item => ({
    name: item.mDisplayName,
    ingredients: item.mIngredients,
    product: item.mProduct,
    duration: item.mManufactoringDuration,
    powerConsumptionConstant: item.mVariablePowerConsumptionConstant,
    powerConsumptionFactor: item.mVariablePowerConsumptionFactor,
  }));
}

const argv = yargs(hideBin(process.argv))
  .option('file', {
    alias: 'f',
    type: 'string',
    description: 'Path to the file',
    demandOption: true,
  })
  .argv;

const filePath = argv.file;
console.log(`Reading file from ${filePath}`);

const data = fs.readFileSync(filePath);

const jsonData = JSON.parse(data);

const result = {
  items: parse_items(jsonData).slice(0,5),
  recipes: parse_recipes(jsonData).slice(0,5),
};

console.log(result);