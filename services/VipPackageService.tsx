import axios from '@/lib/axios'; // Đường dẫn tới file axios của ông
import { VipPackageDto } from '../types/vipPackage';

const VipPackageService = {
  // Reader lấy danh sách gói
  getAllPackages: async (): Promise<VipPackageDto[]> => {
    const response = await axios.get('/reader/vip-packages');
    console.log(response)
    return response.data;
  },

  // Xem chi tiết gói (để hiện Modal benefits)
  getPackageDetail: async (id: number): Promise<VipPackageDto> => {
    const response = await axios.get(`/reader/vip-packages/${id}`);
    return response.data;
  }
};

export default VipPackageService;