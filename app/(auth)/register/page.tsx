'use client';

import { useAuth } from '@/app/lib/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 8) {
      setError('密碼長度不得少於 8 個字元');
      return;
    }

    try {
      await register(formData);
      alert('註冊成功！將為您登入並導向首頁。');
      router.push('/');
    } catch (err: any) {
      setError(err.message || '發生未知錯誤，請稍後再試');
    }
  };

  return (
    <>
      <h3 className="text-center fw-light my-4">註冊新帳號</h3>
      <form onSubmit={handleSubmit}>
        {/* User Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            您的名稱
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            placeholder="例如：陳小明"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
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
            name="email"
            placeholder="name@example.com"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            placeholder="至少 8 個字元"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {/* Submit Button */}
        <div className="d-grid mt-4 mb-3">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span className="ms-2">註冊登入中...</span>
              </>
            ) : (
              '註冊'
            )}
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
