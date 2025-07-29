import Link from 'next/link';

export default function LoginPage() {
  return (
    <>
      <h3 className="text-center fw-light my-4">登入 Pawfect</h3>
      <form>
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
          <label htmlFor="password" className="form-label">
            密碼
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="請輸入密碼"
            autoComplete="current-password"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="d-grid mt-4 mb-3">
          <button type="submit" className="btn btn-primary">
            登入
          </button>
        </div>

        {/* Link to Register */}
        <div className="text-center">
          <small>
            還沒有帳號嗎？ <Link href="/register">立即註冊</Link>
          </small>
        </div>
      </form>
    </>
  );
}
