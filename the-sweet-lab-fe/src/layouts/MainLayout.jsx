import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import FloatingSweetieChat from '../components/common/FloatingSweetieChat';

function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingSweetieChat />
    </>
  );
}

export default MainLayout;
