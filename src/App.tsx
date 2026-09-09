import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/auth/AuthContext';
import ProtectedRoute from '@/auth/ProtectedRoute';
import PublicLayout from '@/components/layout/PublicLayout';
import AppLayout from '@/components/layout/AppLayout';
import HomePage from '@/pages/HomePage';
import ProductPage from '@/pages/ProductPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import DocsPage from '@/pages/DocsPage';
import LoginPage from '@/pages/LoginPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import WorkspacePage from '@/pages/app/WorkspacePage';
import NewReviewPage from '@/pages/app/NewReviewPage';
import AssessmentResultPage from '@/pages/app/AssessmentResultPage';
import ReviewHistoryPage from '@/pages/app/ReviewHistoryPage';
import AppDocsPage from '@/pages/app/AppDocsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<WorkspacePage />} />
            <Route path="reviews" element={<ReviewHistoryPage />} />
            <Route path="reviews/new" element={<NewReviewPage />} />
            <Route path="reviews/:id" element={<AssessmentResultPage />} />
            <Route path="docs" element={<AppDocsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
