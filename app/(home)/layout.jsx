import Header from '../ui/layouts/Header';
import Footer from '../ui/layouts/Footer';


export default function HomeLayout({ children }) {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}