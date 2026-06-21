export const loadImage = async (url: string): Promise<string> => {
  if (url.startsWith('data:')) return url;
  
  let targetUrl = url;
  if (url.includes('github.com') && url.includes('/blob/')) {
    targetUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
  }
  
  try {
    const response = await fetch(targetUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("Fetch failed, falling back to Image + Canvas", error);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = url;
    });
  }
};
