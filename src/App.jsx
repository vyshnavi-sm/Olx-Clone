import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Details from "./components/Details/Details";
import MyAds from "./pages/MyAds";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/details/:id" element={<Details />} />
      <Route path="/my-ads" element={<MyAds />} />
    </Routes>
  );
};

export default App;
