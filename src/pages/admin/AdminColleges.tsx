import { Navigate, Outlet } from 'react-router-dom';

export default function AdminColleges() {
  // Optionally, redirect to Registered Colleges by default
  return <Navigate to="/admin/colleges/registered" replace />;
}