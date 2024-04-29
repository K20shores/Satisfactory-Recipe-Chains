export interface Ingredient {
  name: string;
  amount: number;
}

export interface Item {
  name: string;
  className: string;
  description: string;
  energyValue: number;
  radioactiveDecary: number;
}

export interface Recipe {
  name: string;
  ingredients: Ingredient[];
  product: Ingredient[];
  duration: number;
  powerConsumptionConstant: number;
  powerConsumptionFactor: number;
}

export interface Resource {
  name: string;
  className: string;
  description: string;
  energyValue: number;
  radioactiveDecary: number;
}

export interface Node { 
  id: number;
  title: string;
  children: string [];
}

export interface SatisfactoryData {
  items: Item[];
  recipes: Recipe[];
  resources: Resource[];
  tree: Node[];
}
