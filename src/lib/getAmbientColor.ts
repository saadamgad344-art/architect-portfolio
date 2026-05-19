export async function getAmbientColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    // نضيف ?color للـ URL علشان يتجاوز الـ cache
    img.src = imageUrl.includes('?') 
      ? imageUrl + '&color=1' 
      : imageUrl + '?color=1';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve('80,80,80');
        ctx.drawImage(img, 0, 0, 50, 50);
        const data = ctx.getImageData(0, 0, 50, 50).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          // نتجاهل الألوان الداكنة جداً
          if (data[i] + data[i+1] + data[i+2] > 30) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }
        if (count === 0) return resolve('80,80,80');
        resolve(`${Math.round(r/count)},${Math.round(g/count)},${Math.round(b/count)}`);
      } catch {
        resolve('80,80,80');
      }
    };
    img.onerror = () => resolve('80,80,80');
  });
}