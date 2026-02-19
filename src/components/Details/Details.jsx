import Navbar from "../Navbar/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { fireStore } from "../Firebase/Firebase";

const Details = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(fireStore, "products", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setItem(docSnap.data());
      }
    };

    fetchProduct();
  }, [id]);

  if (!item) {
    return <h2 className="mt-32 text-center text-xl">Loading...</h2>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-28 px-4 pb-10">

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT SIDE - IMAGE */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
            <div className="flex justify-center items-center h-[450px] bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="object-contain h-full"
              />
            </div>
          </div>

          {/* RIGHT SIDE - PRICE & SELLER */}
          <div className="space-y-4">

            {/* PRICE CARD */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-3xl font-bold text-gray-800">
                ₹ {item.price}
              </h2>

              <p className="mt-2 text-lg font-semibold text-gray-700">
                {item.title}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Category: {item.category}
              </p>
            </div>

            {/* SELLER CARD */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-3 text-gray-800">
                Seller Information
              </h3>

              <p className="text-gray-700">
                {item.userName}
              </p>

              <button
                className="mt-4 w-full bg-[#002f34] text-white py-2 rounded-lg hover:opacity-90 transition"
              >
                Chat with Seller
              </button>
            </div>

          </div>
        </div>

        {/* DESCRIPTION SECTION */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Description
          </h3>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {item.description}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Details;
