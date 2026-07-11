/*
 * Utilitario de compresión de imágenes
 * Convierte archivos de imagen a base64 comprimido para guardar en Firestore
 * Redimensiona a 400x400 con object-fit cover y exporta como JPEG q0.7
 */

// Tamaño máximo del archivo original antes de comprimir
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Tamaño del base64 comprimido: Firestore limita docs a 1MB
export const MAX_BASE64_SIZE = 900 * 1024; // 900KB

/*
 * Convierte un archivo de imagen a base64 comprimido
 * Devuelve una Promise que resuelve con el string data:image/jpeg;base64,...
 */
export const fileToCompressedBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const SIZE = 400;
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d');

        // object-fit: cover — recorta centrando
        const scale = Math.max(SIZE / img.width, SIZE / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (SIZE - w) / 2;
        const y = (SIZE - h) / 2;
        ctx.drawImage(img, x, y, w, h);

        const base64 = canvas.toDataURL('image/jpeg', 0.7);
        if (base64.length > MAX_BASE64_SIZE) {
          reject(new Error('La imagen comprimida sigue siendo muy grande. Usá una más chica.'));
          return;
        }
        resolve(base64);
      };
      img.onerror = () => reject(new Error('No se pudo cargar la imagen.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
};