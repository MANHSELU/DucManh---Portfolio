export const projects = [
  {
    id: "etask",
    name: "eTask",
    images: [
      "/projects/etask-tong-quan.png",
      "/projects/etask-dang-nhap.png",
      "/projects/etask-van-ban.png",
      "/projects/etask-nhiem-vu.png",
      "/projects/etask-uy-quyen.png",
    ],
    summary: {
      vi: "Hệ thống quản lý văn bản đến và giao nhiệm vụ cho cơ quan nhà nước. Văn bản được vào sổ, trình lãnh đạo, chuyển xuống đơn vị rồi thành nhiệm vụ có hạn xử lý.",
      en: "Incoming document management and task assignment for public agencies. Documents are registered, submitted to managers, routed to departments, and turned into tasks with deadlines.",
    },
    features: {
      vi: [
        "Vào sổ văn bản đến, đọc nội dung từ tệp PDF và ảnh chụp.",
        "Trình lãnh đạo, chuyển đơn vị, giao nhiệm vụ kèm hạn xử lý.",
        "Theo dõi tiến độ, xin gia hạn, ủy quyền khi lãnh đạo vắng.",
        "Lịch công tác, thông báo và bảng tổng hợp theo vai trò.",
      ],
      en: [
        "Register incoming documents and read content from PDFs and photos.",
        "Submit to managers, route to departments, assign tasks with deadlines.",
        "Track progress, request extensions, delegate when managers are away.",
        "Work calendar, notifications, and role-based dashboards.",
      ],
    },
    stack: ["React", "TanStack Query", "Node.js", "Express", "Prisma", "PostgreSQL"],
    role: {
      vi: "Phân tích nghiệp vụ, thiết kế và phát triển toàn bộ hệ thống.",
      en: "Business analysis, design, and full-stack development.",
    },
  },
  {
    id: "agm",
    name: {
      vi: "AGM · Quản lý và vận hành garage ô tô",
      en: "AGM · Automotive garage operations",
    },
    images: [
      "/projects/agm-trang-chu.jpg",
      "/projects/agm-dang-nhap.jpg",
      "/projects/agm-dich-vu.jpg",
      "/projects/agm-quy-trinh.jpg",
      "/projects/agm-doi-ngu.jpg",
    ],
    summary: {
      vi: "Hệ thống quản lý garage ô tô gồm trang web cho nhân viên, trang web và ứng dụng di động cho khách hàng: từ đặt lịch, tiếp nhận xe, sửa chữa, xuất phụ tùng đến thanh toán.",
      en: "Car garage management with a staff web app plus a customer website and mobile app: from booking, vehicle intake, and repairs to parts and payment.",
    },
    features: {
      vi: [
        "Khách hàng xem dịch vụ, phụ tùng và đặt lịch hẹn trên web hoặc điện thoại.",
        "Lễ tân tiếp nhận xe, lập lệnh sửa chữa, báo giá, thanh toán và xử lý cứu hộ.",
        "Quản lý xưởng phân công kỹ thuật viên, theo dõi tiến độ và ghi chú sửa chữa.",
        "Kho phụ tùng nhập xuất, nhà cung cấp, gợi ý nhập hàng; thống kê và phân tích bằng AI.",
      ],
      en: [
        "Customers browse services and parts and book appointments on web or mobile.",
        "Reception handles intake, repair orders, quotes, payments, and roadside rescue.",
        "Workshop leads assign technicians, track progress, and keep repair notes.",
        "Parts inventory with suppliers and restock suggestions; statistics and AI analysis.",
      ],
    },
    stack: ["React", "TypeScript", "Node.js", "Express", "Sequelize", "PostgreSQL"],
    role: {
      vi: "Quản lý dự án, phân tích nghiệp vụ và phát triển backend.",
      en: "Project management, business analysis, and backend development.",
    },
  },
];
