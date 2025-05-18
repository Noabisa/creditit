import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import LoanForm from '../components/LoanForm';
import AccountForm from '../components/AccountForm';
import AdminPanel from '../pages/AdminPanel';
import Profile from '../pages/Profile';

import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="borrower">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/loan-form"
        element={
          <ProtectedRoute role="borrower">
            <LoanForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/account-form"
        element={
          <ProtectedRoute role="borrower">
            <AccountForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/adminpanel"
        element={
          <ProtectedRoute role="admin">
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
