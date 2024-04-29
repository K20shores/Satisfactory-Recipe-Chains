import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

function parse_ingredients(ingredients) {
  const regex = /ItemClass=.*?'\"\/Game\/FactoryGame\/(.*?)\"',Amount=(\d+)/g;
  let match;
  const result = [];

  while ((match = regex.exec(ingredients)) !== null) {
    result.push({
      name: match[1].replace(/\//g, '.'),
      amount: parseInt(match[2], 10),
    });
  }

  return result;
}

const parse_items = (jsonData) => {
  const item_native_class = "/Script/CoreUObject.Class'/Script/FactoryGame.FGItemDescriptor'";
  const targetObject = jsonData.find(item => item.NativeClass === item_native_class);

  if (!targetObject) {
    throw new Error('Item class not found');
  }

  return targetObject.Classes.map(item => ({
      name: item.mDisplayName,
      className: item.ClassName,
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
    ingredients: parse_ingredients(item.mIngredients),
    product: parse_ingredients(item.mProduct),
    duration: item.mManufactoringDuration,
    powerConsumptionConstant: item.mVariablePowerConsumptionConstant,
    powerConsumptionFactor: item.mVariablePowerConsumptionFactor,
  }));
}

const parse_resources = (jsonData) => {
  const recipe_native_class = "/Script/CoreUObject.Class'/Script/FactoryGame.FGResourceDescriptor'";
  const targetObject = jsonData.find(item => item.NativeClass === recipe_native_class);

  if (!targetObject) {
    throw new Error('Resource class not found');
  }

  return targetObject.Classes.map(item => ({
    name: item.mDisplayName,
    description: item.mDescription,
    energyValue: item.mEnergyValue,
    radioactiveDecay: item.mRadioactiveDecay
  }));
}

const argv = yargs(hideBin(process.argv))
  .option('file', {
    alias: 'f',
    type: 'string',
    description: 'Path to the file',
    demandOption: true,
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'Path to the output file',
    demandOption: true,
  })
  .argv;

const filePath = argv.file;
const outputPath = argv.output;

const data = fs.readFileSync(filePath);

const jsonData = JSON.parse(data);

const result = {
  items: parse_items(jsonData),
  recipes: parse_recipes(jsonData),
  resources: parse_resources(jsonData),
};

fs.writeFileSync(outputPath, JSON.stringify(result));