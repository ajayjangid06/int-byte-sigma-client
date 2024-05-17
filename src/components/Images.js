import React, { useEffect, useState } from "react";
import axios from "axios";

const Images = () => {
  const [images, setImages] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:4000/getImages");
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="d-flex justify-content-center flex-wrap">
      {images && images.length > 0
        ? images.map((image, index) => (
            <div className="mx-4 my-3 shadow-sm" key={index}>
              <img
                className="shadow"
                key={index}
                src={image.dataUrl}
                alt={image._doc.size}
                width={300}
                height={400}
                style={{
                  objectFit: "cover",
                }}
              />
              <div className="my-3">
                <p className="mb-0">
                    Name: {image._doc.fileName}
                </p>
                <p className="mb-0">
                    Size: {`${Number(image._doc.size/1024).toFixed(2)} KB`}
                </p>
                <p className="mb-0">
                    Uploaded at: {new Date(image._doc.createdAt).toLocaleString()}
                </p>
                {
                    image._doc?.filter && image._doc?.filter !== 'null' && (
                        <p className="mb-0">
                            Filter: {image._doc?.filter}
                        </p>
                    )
                }
              </div>
            </div>
          ))
        : null}
    </div>
  );
};

export default Images;
