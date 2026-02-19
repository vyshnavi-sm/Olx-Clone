import React from "react";
import { Link } from "react-router-dom";
import Favorite from "../../assets/favorite.svg";

const Card = ({ items = [] }) => {
  if (!items.length) {
    return (
      <div className="p-10 text-center text-gray-500">
        No products available
      </div>
    );
  }

  return (
    <div className="p-10 px-5 sm:px-15 md:px-30 lg:px-40 min-h-screen">
      <h1 style={{ color: "#002f34" }} className="text-2xl">
        Fresh recommendations
      </h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-5">
        {items.map((item) => (
          <Link
            to={`/details/${item.id}`}   // ✅ FIXED
            key={item.id}
            style={{ borderWidth: "1px", borderColor: "lightgrey" }}
          >
            <div className="relative w-full h-72 rounded-md bg-gray-50 overflow-hidden cursor-pointer border">

              {/* Image */}
              <div className="w-full flex justify-center p-2 overflow-hidden">
                <img
                  className="h-36 object-contain"
                  src={item.imageUrl || "https://via.placeholder.com/150"}
                  alt={item.title}
                />
              </div>

              {/* Details */}
              <div className="p-1 pl-4 pr-4">
                <h1 className="font-bold text-xl">
                  ₹ {item.price}
                </h1>
                <p className="text-sm pt-2">{item.category}</p>
                <p className="pt-2">{item.title}</p>

                {/* Favorite */}
                <div className="absolute flex justify-center items-center p-2 bg-white rounded-full top-3 right-3">
                  <img className="w-5" src={Favorite} alt="favorite" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Card;
