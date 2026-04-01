import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import GeneratePage from './pages/GeneratePage';
import ProfilePage from './pages/ProfilePage';
import PostDetailPage from './pages/PostDetailPage';

import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
// import { useSelector } from 'react-redux';


function App() {

  // const {user} = useSelector(state => state.auth)

  //  const [isLoggedIn, setIsLoggedIn] = useState(user ? true : false); // Mock auth
  //  const location = useLocation();
  //  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';


  return (
    <Router>
      <div className="min-h-screen bg-background text-white font-body selection:bg-primary/30 selection:text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          
          {/* Catch-all route redirects to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <ToastContainer/>
    </Router>
  );
}

export default App;





// function App() {

//   const { user } = useSelector(state => state.auth)

//   const [isLoggedIn, setIsLoggedIn] = useState(user ? true : false); // Mock auth
//   const location = useLocation();

//   const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

//   // Layout wrapper component
//   const AppLayout = ({ children }) => (
//     <div className="flex h-screen overflow-hidden">
//       <Sidebar />
//       <div className="flex-1 flex flex-col relative overflow-hidden">
//         <Navbar />
//         <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
//           {children}
//         </main>
//       </div>
//     </div>
//   );

//   // Protected Route wrapper
//   const ProtectedRoute = ({ children }) => {
//     if (!isLoggedIn) return <Navigate to="/login" />;
//     return <AppLayout>{children}</AppLayout>;
//   };

//     return (
//     <>
//       <Routes>
//         <Route path="/" element={isLoggedIn ? <Navigate to="/feed" /> : <Landing />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Protected routes */}
//         <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
//         <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
//         <Route path="/generate" element={<ProtectedRoute><Generate /></ProtectedRoute>} />
//         <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
//         <Route path="/post/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
//       </Routes>
//       <ToastContainer />
//     </>
//   );

// }



// second




// import React, { useEffect, useState } from 'react';
// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';

// // Pages

// import FeedPage from './pages/FeedPage';
// import ExplorePage from './pages/ExplorePage';
// import ProfilePage from './pages/ProfilePage';
// import { useSelector } from 'react-redux';
// import { ToastContainer } from 'react-toastify';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import GeneratePage from './pages/GeneratePage'
// import PostDetailPage from './pages/PostDetailPage'
// import LandingPage from './pages/LandingPage'

// function App() {

//   const { user } = useSelector(state => state.auth)

//   const [isLoggedIn, setIsLoggedIn] = useState(user ? true : false); // Mock auth
//   const location = useLocation();

//   const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

//   // Layout wrapper component
//   // const AppLayout = ({ children }) => (
//   //   <div className="flex h-screen overflow-hidden">
//   //     <Sidebar />
//   //     <div className="flex-1 flex flex-col relative overflow-hidden">
//   //       <Navbar />
//   //       <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
//   //         {children}
//   //       </main>
//   //     </div>
//   //   </div>
//   // );

//   // Protected Route wrapper
//   const ProtectedRoute = ({ children }) => {
//     if (!isLoggedIn) return <Navigate to="/login" />;
//     return <AppLayout>{children}</AppLayout>;
//   };




//   return (
//     <>
//       <Routes>
//         <Route path="/" element={isLoggedIn ? <Navigate to="/feed" /> : <LandingPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />

//         {/* Protected routes */}
//         <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
//         <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
//         <Route path="/generate" element={<ProtectedRoute><GeneratePage /></ProtectedRoute>} />
//         <Route path="/profile/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
//         <Route path="/post/:id" element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />

//          {/* Catch-all route redirects to home */}
//           <Route path="*" element={<Navigate to="/" replace />} />

//       </Routes>
//       <ToastContainer />
//     </>
//   );
// }

// export default App;