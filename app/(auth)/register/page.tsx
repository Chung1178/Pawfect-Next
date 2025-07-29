// app/(auth)/register/page.tsx

import Link from 'next/link';

export default function RegisterPage() {
  return (
    <>
      <h3 className="text-center fw-light my-4">註冊新帳號</h3>
      <form>
        {/* User Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            您的名稱
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="例如：陳小明"
            autoComplete="name"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            電子郵件
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="name@example.com"
            autoComplete="email"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="new-password" className="form-label">
            密碼
          </label>
          <input
            type="password"
            className="form-control"
            id="new-password"
            placeholder="至少 8 個字元"
            autoComplete="new-password"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="d-grid mt-4 mb-3">
          <button type="submit" className="btn btn-primary">
            註冊
          </button>
        </div>

        {/* Link to Login */}
        <div className="text-center">
          <small>
            已經有帳號了嗎？ <Link href="/login">前往登入</Link>
          </small>
        </div>
      </form>
    </>
  );
}
