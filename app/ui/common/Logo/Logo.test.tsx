import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Logo from './Logo';

describe('Logo Component', () => {
  it('should render both desktop and mobile logos', () => {
    // Arrange & Act: 渲染 Logo 元件
    render(<Logo />);

    // Assert: 驗證兩張圖片都存在於文件中
    expect(screen.getByAltText('PetSitter Logo Desktop')).toBeInTheDocument();
    expect(screen.getByAltText('PetSitter Logo Mobile')).toBeInTheDocument();
  });

  it('should link to the homepage', () => {
    // Arrange & Act: 渲染 Logo 元件
    render(<Logo />);
    
    // Assert: 驗證元件外層的連結指向根目錄 "/"
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/');
  });
});