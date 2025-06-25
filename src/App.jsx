import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ResetPassword from './pages/ResetPassword';
import NavBar from './pages/NavBar';
import EditCompany from './pages/EditCompany';
import Companies from './pages/Copanies';
import CreateCompany from './pages/CreateCompany';
import AdminPage from './pages/AdminPage';
import ResetPasswordForm from './pages/ResetPasswordForm';
import './App.module.css';

function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/companies/:id/edit" element={<EditCompany />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/create" element={<CreateCompany />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
