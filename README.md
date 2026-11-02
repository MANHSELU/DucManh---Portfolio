# Portfolio · Phan Đức Mạnh

Portfolio 3D dạng hệ hành tinh: ngôi sao trung tâm giới thiệu bản thân, các hành tinh mở dự án, quy trình, kỹ năng và liên hệ.

Công nghệ: Vite, React, React Three Fiber, Drei, Zustand, CSS Modules.

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
