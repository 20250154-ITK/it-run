import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-app relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
