import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postalCode',
})
export class PostalCodePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    // 5 chiffres consécutifs
    const match = value.match(/\d{5}/);

    return match ? match[0] : '';
  }

}
