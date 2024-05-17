import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Images from "./components/Images";
import ImageUpload from "./components/ImageUpload";

function App() {
  return (
    <div className="">
      <BrowserRouter>
      <ul className="">
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/uploadImage'>Upload Image</Link></li>
      </ul>
        <Routes>
          <Route path={"/"} element={<Images />} />
          <Route path={"/uploadImage"} element={<ImageUpload />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
