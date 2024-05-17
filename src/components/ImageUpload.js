import React, { useState } from "react";
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filteredImage, setFilteredImage] = useState(null);
  const [filter, setFilter] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setFilteredImage(reader.result);
        setFilter(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilter = (selectedFilter) => {
    setFilter(selectedFilter);
    let filterValue = selectedImage;
    if (selectedFilter === "grayscale") {
      // filterValue = 'grayscale(100%)';
      filterValue = applyGrayscaleFilter(selectedImage);
    } else if (selectedFilter === "sepia") {
      // filterValue = 'sepia(100%)';
      filterValue = applySepiaFilter(selectedImage);
    }
    // setSelectedImage(filterValue);
    setFilteredImage(filterValue);
  };

  const applyGrayscaleFilter = (imageDataURL) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageDataURL;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // Red
      data[i + 1] = avg; // Green
      data[i + 2] = avg; // Blue
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/jpeg");
  };

  const applySepiaFilter = (imageDataURL) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageDataURL;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg + 50; // Red
      data[i + 1] = avg + 25; // Green
      data[i + 2] = avg; // Blue
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/jpeg");
  };

  const uploadImage = async () => {
    try {
      // create Blob
      const blob = await fetch(filteredImage).then((res) => res.blob());

      // add data
      const blobWithata = new File([blob], selectedFile.name, { type: blob.type });

      // formdata
      const formData = new FormData();
      formData.append('file', blobWithata);
      formData.append('filter', filter);

      // Send FormData 
      await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // uploaded successfully message
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error, display an error message, etc.
    }
  };
  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {selectedImage && (
        <div>
          <h2>Selected Image Preview:</h2>
          <img src={filteredImage} alt="Preview" />
        </div>
      )}
      {selectedImage && (
        <>
          <div className="d-flex justify-content-center mt-2">
            <h4>Filter Options:</h4>
            <button className="mx-2" onClick={() => applyFilter("null")}>Clear</button>
            <button className="mx-2" onClick={() => applyFilter("grayscale")}>Grayscale</button>
            <button className="mx-2" onClick={() => applyFilter("sepia")}>Sepia</button>
            <button className="mx-2" onClick={() => uploadImage()}>Upload</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageUpload;
