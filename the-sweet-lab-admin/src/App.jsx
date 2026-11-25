import { AdminAuthProvider } from './context/AdminAuthContext';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <AdminAuthProvider>
      <AppRouter />
    </AdminAuthProvider>
  );
}

export default App;
