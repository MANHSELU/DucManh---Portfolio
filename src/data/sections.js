export const sections = [
  { id: "gioi-thieu", nav: { vi: "Giới thiệu", en: "About" }, spot: { vi: "Nhà của tôi · Giới thiệu", en: "My home · About" } },
  { id: "du-an", nav: { vi: "Dự án", en: "Projects" }, spot: { vi: "Tòa phần mềm · Dự án", en: "Software hub · Projects" } },
  { id: "quy-trinh", nav: { vi: "Quy trình", en: "Process" }, spot: { vi: "Công trường · Quy trình", en: "Workshop · Process" } },
  { id: "ky-nang", nav: { vi: "Kỹ năng", en: "Skills" }, spot: { vi: "Thư viện · Kỹ năng", en: "Library · Skills" } },
  { id: "lien-he", nav: { vi: "Liên hệ", en: "Contact" }, spot: { vi: "Bưu điện · Liên hệ", en: "Post office · Contact" } },
];

export const isSection = (id) => sections.some((section) => section.id === id);
