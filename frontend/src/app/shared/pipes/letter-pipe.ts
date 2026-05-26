import { Pipe, PipeTransform } from '@angular/core';

export const CUISINE_DETAILS: Record<string, string> = {
  "Sichuanaise": "Épicé et anesthésiant (Poivre du Sichuan)",
  "Cantonaise": "Saveurs authentiques et ingrédients frais",
  "Hunanaise": "Acide et très épicé (Piment frais)",
  "Shandong": "Plats salés et croustillants, souvent aux fruits de mer",
  "Jiangsu": "Cuisine légère, fraîche et très raffinée",
  "Fujian": "Célèbre pour ses soupes et ragoûts riches en umami",
  "Anhui": "Cuisine de montagne utilisant des herbes sauvages",
  "Zhejiang": "Plats délicats à base de poissons d'eau douce",
  "International": "Saveurs du monde (Italie, Inde, etc.)",
  "Street Food": "Snacks rapides, grillades et cuisine de rue",
  "Boisson": "Bubble tea, jus de fruits frais et thés artisanaux",
  "Dessert": "Pâtisseries, douceurs sucrées et spécialités fines",
};

@Pipe({
  name: 'cuisineDesc',
})
export class CuisineDescPipe implements PipeTransform {
  transform(value: string): string {
    return CUISINE_DETAILS[value] || value;
  }

}
