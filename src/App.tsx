import { useState } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home";
import RFQ from "./components/rfq";

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rfq/:id" element={<RFQ />} />
      </Routes>
    </div>
  );
}

export default App;
