import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postalCode',
})
export class PostalCodePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    // Regex qui cherche exactement 5 chiffres consécutifs (\d{5})
    const match = value.match(/\d{5}/);

    // Si on trouve un match, on le retourne, sinon on retourne vide
    return match ? match[0] : '';
  }

}
