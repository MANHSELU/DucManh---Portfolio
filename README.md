# Portfolio · Phan Đức Mạnh

Portfolio cá nhân dạng 3D: một hệ hành tinh có thể xoay và bấm vào. Ngôi sao ở giữa là phần giới thiệu bản thân, mỗi hành tinh xung quanh mở ra một phần nội dung. Trang có hai ngôn ngữ, tiếng Việt và tiếng Anh.

## Giới thiệu

- **Họ tên:** Phan Đức Mạnh
- **Vai trò:** Phân tích nghiệp vụ - Phát triển phần mềm
- **Nơi ở:** Đà Nẵng, Việt Nam
- **Email:** ducmanh.it.work@gmail.com
- **GitHub:** https://github.com/MANHSELU
- **Facebook:** https://www.facebook.com/ucmanh.385561

Lập trình viên đến từ Việt Nam, thích phân tích nhu cầu nghiệp vụ và chuyển chúng thành giải pháp phần mềm thiết thực. Xem mỗi dự án là cơ hội để học thêm và làm quen với những bài toán mới.

## Portfolio có gì

Trang gồm 5 phần, mỗi phần là một hành tinh:

| Phần | Nội dung |
| --- | --- |
| Giới thiệu | Ảnh chân dung, nhân vật 3D, giới thiệu bản thân, vai trò và các dự án đang làm |
| Dự án | Hai dự án có ảnh chụp màn hình, mô tả, tính năng chính, công nghệ và vai trò của tôi |
| Quy trình | Cách tôi làm việc từ phân tích yêu cầu đến bàn giao |
| Kỹ năng | Ngôn ngữ lập trình, framework, cơ sở dữ liệu và công cụ |
| Liên hệ | Email, GitHub, Facebook, có nút sao chép nhanh |

### Dự án nổi bật

- **eTask:** hệ thống quản lý văn bản đến và giao nhiệm vụ cho cơ quan nhà nước. Văn bản được vào sổ, trình lãnh đạo, chuyển xuống đơn vị rồi thành nhiệm vụ có hạn xử lý. Công nghệ: React, TanStack Query, Node.js, Express, Prisma, PostgreSQL.
- **AGM:** hệ thống quản lý và vận hành garage ô tô gồm web cho nhân viên, web và ứng dụng di động cho khách hàng, đi từ đặt lịch, tiếp nhận xe, sửa chữa, xuất phụ tùng đến thanh toán. Công nghệ: React, TypeScript, Node.js, Express, Sequelize, PostgreSQL.

### Kỹ năng

| Nhóm | Công nghệ |
| --- | --- |
| Ngôn ngữ lập trình | JavaScript, Java, HTML, CSS |
| Framework | React JS, Node.js, Spring Boot, Sequelize |
| Cơ sở dữ liệu | MySQL, PostgreSQL, SQL Server |
| Công cụ hỗ trợ | Git, GitHub, Postman, Jira, Claude |

## Công nghệ dùng để làm trang

Vite, React, React Three Fiber, Drei, Zustand, CSS Modules.

## Chạy trên máy

```
npm install
npm run dev
```

Mở địa chỉ được in ra (thường là http://localhost:5173).

## Cấu trúc thư mục

```
portfolio/
├── public/
│   ├── models/
│   │   ├── chibi-businessman/white_mesh.glb   model gốc của nhân vật
│   │   └── human/human.bin                    file đã tô màu, trang đọc file này
│   └── projects/          ảnh chụp màn hình dự án
├── scripts/
│   ├── reference/character.png   ảnh mẫu dùng để tô màu nhân vật
│   ├── paint-character.mjs       chiếu ảnh mẫu lên model
│   └── bake-human.mjs            tạo human.bin từ white_mesh.glb
├── src/
│   ├── data/              toàn bộ nội dung: sửa chữ ở đây
│   │   ├── profile.js     tên, vai trò, giới thiệu, liên hệ, đường dẫn ảnh
│   │   ├── projects.js    dự án và case study
│   │   ├── process.js     quy trình làm việc
│   │   ├── skills.js      kỹ năng
│   │   └── sections.js    5 phần và nhãn của chúng
│   ├── scene/             cảnh 3D
│   │   ├── galaxy/        ngôi sao, hành tinh, quỹ đạo và nhãn
│   │   ├── human/         nhân vật: đọc human.bin, chất liệu, component Human
│   │   ├── CameraRig.jsx  camera bay tới phần được chọn
│   │   └── layout.js      kích thước, quỹ đạo và góc camera
│   ├── panels/            các lớp thông tin hiện ra khi bấm
│   ├── components/        menu, khung lớp, nút dùng chung
│   ├── store/             trạng thái chung (công trình đang chọn, đang rê chuột)
│   ├── hooks/
│   └── styles/            màu và chữ dùng chung
└── index.html
```

Chữ có gạch chân nét đứt trên trang là chỗ chưa có thông tin thật. Trong code, các chỗ đó được bọc bằng `todo("...")` trong `src/data/`. Điền xong thì bỏ `todo(...)` đi.

## Model nhân vật 3D

Nhân vật làm từ `public/models/chibi-businessman/white_mesh.glb`, một model trắng không có màu. Màu lấy từ ảnh mẫu `scripts/reference/character.png` (cùng dáng đứng với model):

- Mặt trước: ảnh mẫu được chiếu thẳng lên model, giữ nguyên mắt, kính, áo, quần, giày.
- Hai bên và sau lưng: lấy màu gần nhất trong ảnh, sau gáy tô màu tóc, sau lưng dưới vạt áo tô màu quần.

Vị trí ảnh so với model nằm trong `REFERENCE` ở `scripts/paint-character.mjs`. Trang đọc file đã tô màu `public/models/human/human.bin` (2 MB). Sau khi đổi model hoặc ảnh mẫu, chạy lại lệnh sau để tạo lại file đó:

```
npm run bake:human
```

Ảnh dự án: lưu vào `public/projects/` và điền vào trường `image` trong `src/data/projects.js`, ví dụ `image: "/projects/etask.png"`.

## Đưa lên GitHub rồi Vercel

```
git init
git add .
git commit -m "feat: add 3d room portfolio"
git branch -M main
git remote add origin https://github.com/MANHSELU/portfolio.git
git push -u origin main
```

Trên vercel.com: **Add New → Project**, chọn repository `portfolio`. Framework Preset là **Vite**, Build Command `npm run build`, Output Directory `dist`. Bấm **Deploy**.

Từ lần sau chỉ cần `git add .`, `git commit -m "..."`, `git push`, Vercel tự deploy lại.

## Tài nguyên

- Model nhân vật OBJ do chủ dự án cung cấp.
