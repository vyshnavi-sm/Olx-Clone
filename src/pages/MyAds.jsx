import React, { useEffect, useState } from "react";
import { auth, fireStore } from "../components/Firebase/Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import EditModal from "../components/EditModal";

const MyAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  const navigate = useNavigate();

  // ✅ Listen to auth changes properly
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch user ads
  useEffect(() => {
    if (!user) return;

    const fetchMyAds = async () => {
      try {
        const q = query(
          collection(fireStore, "products"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        const myProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAds(myProducts);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAds();
  }, [user]);

  // ✅ Delete
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(fireStore, "products", id));
      setAds((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (!user) {
    return (
      <h2 className="mt-32 text-center text-xl">
        Please Login First
      </h2>
    );
  }

  if (loading) {
    return (
      <h2 className="mt-32 text-center text-xl">
        Loading...
      </h2>
    );
  }

  return (
    <div className="mt-32 p-10">
      <h2 className="text-2xl font-bold mb-6">My Ads</h2>

      {ads.length === 0 ? (
        <p>No Ads Posted Yet</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {ads.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/details/${item.id}`)}
              className="border p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
            >
              {/* Image */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover rounded mb-3"
              />

              {/* Info */}
              <h3 className="font-bold text-lg">
                {item.title}
              </h3>

              <p className="text-green-600 font-semibold">
                ₹ {item.price}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                {item.description}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 🔥 Prevent navigation
                    setSelectedAd(item);
                    setIsEditOpen(true);
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 🔥 Prevent navigation
                    handleDelete(item.id);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Edit Modal */}
      {isEditOpen && selectedAd && (
        <EditModal
          ad={selectedAd}
          onClose={() => setIsEditOpen(false)}
          onSave={async (updatedAd) => {
            try {
              await updateDoc(
                doc(fireStore, "products", updatedAd.id),
                {
                  title: updatedAd.title,
                  price: updatedAd.price,
                  description: updatedAd.description,
                }
              );

              // Update UI instantly
              setAds((prev) =>
                prev.map((ad) =>
                  ad.id === updatedAd.id ? updatedAd : ad
                )
              );

              setIsEditOpen(false);
            } catch (error) {
              console.error("Update failed:", error);
            }
          }}
        />
      )}
    </div>
  );
};

export default MyAds;
