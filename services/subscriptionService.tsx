import axios from '@/lib/axios';
import { SubscriptionDTO } from '../types/subscription';

const SubscriptionService = {
  // Lấy gói hiện tại của người dùng đang login
  getCurrentSubscription: async (): Promise<SubscriptionDTO> => {
    // API này anh em mình đã thống nhất ở BE là /api/subscriptions/current
    const response = await axios.get('/subscriptions/current');
    return response.data;
  }
};

export default SubscriptionService;