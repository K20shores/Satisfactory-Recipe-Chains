import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

function make_tree(items, recipes, resources) {
  // create a map of item class names to item names
  let item_map = {};
  for (let item of items) {
    item_map[item.className] = item.name;
  }

  for (let resource of resources) {
    item_map[resource.className] = resource.name;
  }

  // create a map of product names to the recipes that produce them
  let terminals = {};
  for (let recipe of recipes) {
    for (let product of recipe.product) {
      const product_name = item_map[product.name.split('.').pop()];
      if (!product_name) {
        console.log(`Product not found in item map: ${product.name}`)
        continue;
      }
      if (!terminals[product_name]) {
        terminals[product_name] = {
          produced_by: [recipe.name]
        }
      }
      else {
        terminals[product_name].produced_by.push(recipe.name)
      }
    }
  }

  // iterate over the terminals and form them into a useable tree for v-treeview
  let id = 0;
  let tree = [];
  for (let terminal in terminals) {
    let node = {
      id: id++,
      title: terminal,
      children: terminals[terminal].produced_by
    }
    tree.push(node)
  }

  return tree;
}

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

function parse_items(jsonData) {
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

function parse_recipes(jsonData) {
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

function parse_resources(jsonData){
  const recipe_native_class = "/Script/CoreUObject.Class'/Script/FactoryGame.FGResourceDescriptor'";
  const targetObject = jsonData.find(item => item.NativeClass === recipe_native_class);

  if (!targetObject) {
    throw new Error('Resource class not found');
  }

  return targetObject.Classes.map(item => ({
    name: item.mDisplayName,
    className: item.ClassName,
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

const items = parse_items(jsonData);
const recipes = parse_recipes(jsonData);
const resources = parse_resources(jsonData);
const tree = make_tree(items, recipes, resources);

const result = {
  items: items,
  recipes: recipes,
  resources: resources,
  tree: tree
};

fs.writeFileSync(outputPath, JSON.stringify(result));