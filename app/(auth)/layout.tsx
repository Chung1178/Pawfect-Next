import Logo from '../ui/common/Logo/Logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-light d-flex flex-column vh-100">
      <header className="py-6">
        <div className="text-center">
          <Logo className="d-inline-block" />
        </div>
      </header>

      <main className="container my-auto">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7 col-sm-9">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body p-5">{children}</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6"></footer>
    </div>
  );
}
