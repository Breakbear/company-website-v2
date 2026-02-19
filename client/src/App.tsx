import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

const Layout = lazy(() => import('./components/Layout'));
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminNews = lazy(() => import('./pages/admin/News'));
const AdminContacts = lazy(() => import('./pages/admin/Contacts'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const AdminContentChecklist = lazy(() => import('./pages/admin/ContentChecklist'));
const Login = lazy(() => import('./pages/admin/Login'));
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'));

const RouteLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-industrial-950 text-industrial-100">
    <span className="text-sm uppercase tracking-[0.15em] text-primary-200">Loading</span>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="news" element={<News />} />
                <Route path="news/:id" element={<NewsDetail />} />
                <Route path="contact" element={<Contact />} />
              </Route>

              <Route path="/admin/login" element={<Login />} />

              <Route element={<ProtectedRoute allowedRoles={['admin', 'editor']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="news" element={<AdminNews />} />
                  <Route path="contacts" element={<AdminContacts />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="content-checklist" element={<AdminContentChecklist />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
