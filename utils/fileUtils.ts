/**
 * Chuyển đổi đối tượng File (từ input upload) sang Base64
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // FileReader nhận vào đối tượng File
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};