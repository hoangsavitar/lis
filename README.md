# LIS BY LII — Lời chúc cùng món quà

MVP cho shop bán quà: shop in hàng loạt một QR chung trỏ tới `/mo-qua`. Người gửi tạo lời chúc, hệ thống sinh mã 6 số, người nhận quét QR và nhập mã để mở đúng thư.

## Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

- Tạo lời chúc: `http://localhost:3000/#tao-loi-chuc`
- Trang người nhận (URL để đưa vào QR chung): `http://localhost:3000/mo-qua`
- Link quản lý bí mật: được trả về sau khi tạo lời chúc
- Mã demo: `582913`

Khi deploy, copy `.env.example` thành `.env.local` và đặt `NEXT_PUBLIC_COMMON_QR_URL` bằng URL thật mà shop sẽ in lên tất cả QR.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- GSAP cho animation phong bì
- Phosphor Icons cho icon SVG
- Prisma schema cho PostgreSQL

## Lưu ý backend

API hiện lưu lời chúc bền vững vào `data/gifts.json`, phù hợp với máy đang chạy
website qua Cloudflare Tunnel: mã vẫn mở được sau khi khởi động lại server. Thư
mục dữ liệu được bỏ khỏi Git để không đưa lời chúc của khách lên repository.

Khi chuyển sang nền tảng serverless hoặc chạy nhiều máy, dùng schema PostgreSQL
trong `prisma/schema.prisma`, cấu hình `DATABASE_URL`, chạy migration và thay
repository file bằng Prisma.

Mã 6 số phù hợp cho lời chúc thông thường khi có rate limit/CAPTCHA. Không dùng luồng này cho dữ liệu nhạy cảm nếu chưa bổ sung HMAC lookup, rate limiting phân tán và phiên xem `HttpOnly`.
