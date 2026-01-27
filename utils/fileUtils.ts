/**
 * Chuyển đổi đối tượng File (từ input upload) sang Base64
 */
export const convertUrlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Lỗi chuyển đổi QR sang Base64:", error);
    return ""; // Trả về chuỗi rỗng nếu lỗi để không làm chết app
  }
};