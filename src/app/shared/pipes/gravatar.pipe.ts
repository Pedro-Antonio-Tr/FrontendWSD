import { Pipe, PipeTransform } from '@angular/core';
import { Md5 } from 'ts-md5';

@Pipe({
  name: 'gravatar',
  standalone: true
})
export class GravatarPipe implements PipeTransform {
  /**
   * Transforma un email en una URL de imagen de Gravatar.
   * @param email El correo del usuario
   * @param size Tamaño de la imagen en píxeles (por defecto 80)
   */
  transform(email: string | undefined, size: number = 80): string {
    if (!email) {
      // Imagen por defecto si por algún motivo no llega el email o no es válido
      return `https://www.gravatar.com/avatar/00000000000000000000000000000000?s=${size}&d=mp`;
    }

    /**
     * LÓGICA TÉCNICA:
     * 1. Limpiamos espacios con trim() y pasamos a minúsculas con toLowerCase().
     * 2. Generamos un hash MD5 (requisito de la API de Gravatar por privacidad).
     */
    const hash = Md5.hashStr(email.trim().toLowerCase());
    
    /**
     * Devolvemos la URL final. 
     * El parámetro 'd=identicon' genera automáticamente una figura geométrica única 
     * si el usuario no tiene una foto configurada en Gravatar.
     */
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
  }
}