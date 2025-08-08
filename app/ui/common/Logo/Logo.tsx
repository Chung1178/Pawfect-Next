import Image from "next/image";
import Link from "next/link";

interface LogoProps{
    className?: string;
    onClick?: () => void;
}

export default function Logo({className, onClick}: LogoProps) {
  return (
    <>
      <Link href="/" className={className} onClick={onClick}>
        <Image
          src="/layout/layout-header-logo.png"
          alt="PetSitter Logo Desktop"
          width={178}
          height={48}
          className="d-none d-lg-block"
          priority
        />
        <Image
          src="/layout/layout-header-logo-sm.png"
          alt="PetSitter Logo Mobile"
          width={140}
          height={40}
          className="d-lg-none"
          priority
        />
      </Link>
    </>
  );
}
