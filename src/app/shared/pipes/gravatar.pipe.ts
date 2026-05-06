import { Pipe, PipeTransform } from '@angular/core';
import { Md5 } from 'ts-md5';

@Pipe({
  name: 'gravatar',
  standalone: true
})
export class GravatarPipe implements PipeTransform {
  transform(email: string | undefined, size: number = 80): string {
    if (!email) {
      // Imagen por defecto si por algún motivo no llega el email o no es válido
      return `https://www.gravatar.com/avatar/00000000000000000000000000000000?s=${size}&d=mp`;
    }
    const hash = Md5.hashStr(email.trim().toLowerCase());
    
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
  }
}