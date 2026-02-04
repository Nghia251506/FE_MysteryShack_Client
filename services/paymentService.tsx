import axios from '@/lib/axios';

const PaymentService = {
    // Tạo URL thanh toán VNPay
    createPaymentUrl: async (packageId: number): Promise<string> => {
        // Dùng endpoint /api/payment/buy-vip của ông
        const response = await axios.post(`/payment/buy-vip`, null, {
            params: {
                packageId: packageId
            }
        });
        return response.data.paymentUrl;
    }
};

export default PaymentService;