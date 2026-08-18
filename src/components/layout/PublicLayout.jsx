import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import LoadingSpinner from '../common/LoadingSpinner';

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;