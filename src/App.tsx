import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home";
import RFQ from "./components/rfq";
import SendQuote from "./components/sendQuote";
import LoginPage from "./components/auth/login";
import SignupPage from "./components/auth/signup";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/rfq/:id" element={<RFQ />} />
        <Route path="/sendQuote/:id" element={<SendQuote />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
