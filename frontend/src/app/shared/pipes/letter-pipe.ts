import { Pipe, PipeTransform } from '@angular/core';
import { Cuisine } from '../models/cuisine.model';

export const CuisineDescriptions: Record<Cuisine, string> = {
  SIC: "Épicé (Mala)",
  GUA: "Saveurs authentiques des ingrédients frais",
  HUN: "Acide et épicé",
  SHA: "Salé et croustillant",
  JIA: "Léger, frais et raffiné",
  FUJ: "Soupes et ragoûts riches et savoureux",
  ANH: "Utilisation de produits locaux (herbes/gibier)",
  ZHE: "Fusion et poissons d'eau douce",
  STR: "Snacks et cuisine de rue",
  BOI: "Pâtisseries, desserts et boissons",
  DES: "Pâtisseries, desserts et boissons"
};

const CUISINES: Record<Cuisine, string> = {
  SIC: "Sichuan",
  GUA: "Guangdong",
  HUN: "Hunan",
  SHA: "Shandong",
  JIA: "Fujian",
  FUJ: "Jiangsu",
  ANH: "Anhui",
  ZHE: "Zhejiang",
  STR: "Street Food",
  BOI: "Boisson",
  DES: "Dessert"
};

@Pipe({
  name: 'cuisine',
})
export class CuisinePipe implements PipeTransform {

  transform(value: Cuisine): string {
    return CUISINES[value] || value;
  }

}
