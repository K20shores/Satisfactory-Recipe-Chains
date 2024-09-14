import fs from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

function make_tree(recipes, items, resources) {
  let nodes = {};
  for (let item of items) {
    nodes[item.className] = {
      id: item.className,
      name: item.name,
      parents: [],
      children: [],
      isResource: false,
      isRecipe: false,
    };
  }
  for (let resource of resources) {
    nodes[resource.className] = {
      id: resource.className,
      name: resource.name,
      parents: [],
      children: [],
      isResource: true,
      isRecipe: false,
    };
  }

  for (let recipe of recipes) {
    nodes[recipe.name] = {
      id: recipe.name,
      name: recipe.name,
      parents: [],
      children: [],
      isResource: false,
      isRecipe: true,
    };
    for (let product of recipe.products) {
      if (!nodes[product.name]) {
        nodes[product.name] = {
          id: product.name,
          name: product.name,
          parents: [],
          children: [],
          isResource: false,
          isRecipe: false,
        };
      }
      nodes[product.name].parents.push(recipe.name);
      nodes[recipe.name].children.push(product.name);
    }
    for (let ingredient of recipe.ingredients) {
      if (!nodes[ingredient.name]) {
        nodes[ingredient.name] = {
          id: ingredient.name,
          name: ingredient.name,
          parents: [],
          children: [],
          isResource: false,
          isRecipe: false,
        };
      }
      nodes[ingredient.name].children.push(recipe.name);
      nodes[recipe.name].parents.push(ingredient.name);
    }
  }

  return nodes;
}

function make_graph(recipes, items, resources, biomass) {
  let nodes = {};
  let edges = {};
  let edgeCounter = 1;

  for (let recipe of recipes) {
    nodes[recipe.name] = {
      name: recipe.name,
      duration: recipe.duration,
      powerConsumptionConstant: recipe.powerConsumptionConstant,
      powerConsumptionFactor: recipe.powerConsumptionFactor,
      isRecipe: true,
      isResource: false,
      products: recipe.products,
      ingredients: recipe.ingredients,
    };
    for (let product of recipe.products) {
      edges[`edge${edgeCounter++}`] = {
        source: recipe.name,
        target: product.name,
        amount: product.amount,
      };
    }
    for (let ingredient of recipe.ingredients) {
      edges[`edge${edgeCounter++}`] = {
        source: ingredient.name,
        target: recipe.name,
        amount: ingredient.amount,
      };
    }
  }

  for (let item of items) {
    nodes[item.className] = {
      name: item.name,
      isRecipe: false,
      isResource: false,
    };
  }

  for (let resource of resources) {
    nodes[resource.className] = {
      name: resource.name,
      isRecipe: false,
      isResource: true,
    };
  }

  for (let item of biomass) {
    nodes[item.className] = {
      name: item.name,
      isRecipe: false,
      isResource: false,
    };
  }

  return {
    nodes: nodes,
    edges: edges,
  };
}

function parse_ingredients(ingredients) {
  const regex = /ItemClass=.*?'\"\/Game\/FactoryGame\/(.*?)\"',Amount=(\d+)/g;
  let match;
  const result = [];

  while ((match = regex.exec(ingredients)) !== null) {
    const longName = match[1].replace(/\//g, ".");
    const itemName = longName.split(".").pop();
    result.push({
      name: itemName,
      amount: parseInt(match[2], 10),
    });
  }

  return result;
}

function parse_items(jsonData) {
  const item_native_class =
    "/Script/CoreUObject.Class'/Script/FactoryGame.FGItemDescriptor'";
  const targetObject = jsonData.find(
    (item) => item.NativeClass === item_native_class
  );

  if (!targetObject) {
    throw new Error("Item class not found");
  }

  return targetObject.Classes.map((item) => ({
    name: item.mDisplayName,
    className: item.ClassName,
    description: item.mDescription,
    energyValue: item.mEnergyValue,
    radioactiveDecay: item.mRadioactiveDecay,
  }));
}

function parse_recipes(jsonData) {
  const recipe_native_class =
    "/Script/CoreUObject.Class'/Script/FactoryGame.FGRecipe'";
  const targetObject = jsonData.find(
    (item) => item.NativeClass === recipe_native_class
  );

  if (!targetObject) {
    throw new Error("Recipe class not found");
  }

  //"mProducedIn": "(\"/Game/FactoryGame/Buildable/Factory/Packager/Build_Packager.Build_Packager_C\")",
  // Ignore any recipes that are produced in the Packager

  return targetObject.Classes.reduce((acc, item) => {
    if (!item.mProducedIn.includes("Packager")) {
      acc.push({
        name: item.mDisplayName,
        ingredients: parse_ingredients(item.mIngredients),
        products: parse_ingredients(item.mProduct),
        duration: item.mManufactoringDuration,
        powerConsumptionConstant: item.mVariablePowerConsumptionConstant,
        powerConsumptionFactor: item.mVariablePowerConsumptionFactor,
      });
    }
    return acc;
  }, []);
}

function parse_biomass(jsonData) {
  const biomass_native_class =
    "/Script/CoreUObject.Class'/Script/FactoryGame.FGItemDescriptorBiomass'";
  const targetObject = jsonData.find(
    (item) => item.NativeClass === biomass_native_class
  );

  if (!targetObject) {
    throw new Error("Biomass class not found");
  }

  return targetObject.Classes.map((item) => ({
    name: item.mDisplayName,
    className: item.ClassName,
    description: item.mDescription,
    energyValue: item.mEnergyValue,
    radioactiveDecay: item.mRadioactiveDecay,
  }));
}

function parse_resources(jsonData) {
  const recipe_native_class =
    "/Script/CoreUObject.Class'/Script/FactoryGame.FGResourceDescriptor'";
  const targetObject = jsonData.find(
    (item) => item.NativeClass === recipe_native_class
  );

  if (!targetObject) {
    throw new Error("Resource class not found");
  }

  return targetObject.Classes.map((item) => ({
    name: item.mDisplayName,
    className: item.ClassName,
    description: item.mDescription,
    energyValue: item.mEnergyValue,
    radioactiveDecay: item.mRadioactiveDecay,
  }));
}

const argv = yargs(hideBin(process.argv))
  .option("file", {
    alias: "f",
    type: "string",
    description: "Path to the file",
    demandOption: true,
  })
  .option("output", {
    alias: "o",
    type: "string",
    description: "Path to the output file",
    demandOption: true,
  }).argv;

const filePath = argv.file;
const outputPath = argv.output;

const data = fs.readFileSync(filePath);

const jsonData = JSON.parse(data);

const items = parse_items(jsonData);
const recipes = parse_recipes(jsonData);
const biomass = parse_biomass(jsonData);
const resources = parse_resources(jsonData);

const tree = make_tree(recipes, items, resources, biomass);
const graph = make_graph(recipes, items, resources, biomass);

const result = {
  recipes: recipes,
  items: items,
  resources: resources,
  tree: { ...tree },
  graph: { ...graph },
};

fs.writeFileSync(outputPath, JSON.stringify(result));
