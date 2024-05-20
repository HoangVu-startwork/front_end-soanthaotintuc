import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/login/Login.jsx';
import Dashboard from './components/blog/Dashboard.jsx';
import AppSignUp from './components/login/Register.jsx';
import DeleteAccount from './components/login/DeleteAccount';

function App() {
  return (
    <div>
      <Routes>
        {/* Registration opens again when you want to register */}
        <Route path="/sign-up" element={<AppSignUp />}/>
        <Route path="/delete" element={<DeleteAccount/>} />
        <Route path="/" element={<Login />} />
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
