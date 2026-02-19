import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Contact from './pages/Contact'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminNews from './pages/admin/News'
import AdminContacts from './pages/admin/Contacts'
import AdminSettings from './pages/admin/Settings'
import AdminContentChecklist from './pages/admin/ContentChecklist'
import Login from './pages/admin/Login'
import ProtectedRoute from './components/admin/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
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
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App
