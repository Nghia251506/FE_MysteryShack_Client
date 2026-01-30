// public/firebase-messaging-sw.js

// 1. Import các thư viện cần thiết từ CDN của Firebase
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// 2. Dán bộ config của bạn vào đây (Bỏ analytics vì SW không dùng cái đó)
const firebaseConfig = {
  apiKey: "AIzaSyA8bLTRK7Csl4WJ1XnL5KDV9MXRPj_saJ4",
  authDomain: "mystictarot-750bf.firebaseapp.com",
  projectId: "mystictarot-750bf",
  storageBucket: "mystictarot-750bf.firebasestorage.app",
  messagingSenderId: "43040274099",
  appId: "1:43040274099:web:38f8e0896e4bdb2b34a2c6",
  measurementId: "G-X8BBC8L8KX"
};


// 3. Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 4. Cấu hình cách hiển thị Popup khi tin nhắn đẩy về lúc đang đóng tab
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Nhận tin nhắn nền: ', payload);

  // Vì BE gửi dạng Data Message, thông tin sẽ nằm trong payload.data
  const { title, message, type } = payload.data;

  const notificationTitle = title || "Mystic Tarot";
  const notificationOptions = {
    body: message || "Bạn có một cập nhật mới về phiên xem bài.",
    icon: '/logo.png',
    data: payload.data, // Lưu lại data để khi click vào thông báo có thể điều hướng
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});