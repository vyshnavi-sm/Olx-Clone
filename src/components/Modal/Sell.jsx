import { Modal, ModalBody } from "flowbite-react";
import { useState, useEffect } from "react";
import Input from "../Input/Input";
import { UserAuth } from "../Context/Auth";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { fetchFromFirestore, fireStore } from "../Firebase/Firebase";

import fileUpload from '../../assets/fileUpload.svg'
import loading from '../../assets/loading.gif'
import close from '../../assets/close.svg'

const Sell = ({ toggleModalSell, status, setItems, editItem }) => {

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const auth = UserAuth();

  // ✅ PREFILL IF EDITING
  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title);
      setCategory(editItem.category);
      setPrice(editItem.price);
      setDescription(editItem.description);
    }
  }, [editItem]);

  const handleImageUpload = (event) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  const readImageAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!auth?.user) {
      alert('Please login to continue');
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedCategory = category.trim();
    const trimmedDescription = description.trim();
    const numericPrice = Number(price);

    // ✅ VALIDATION
    if (!trimmedTitle) return alert("Title is required");
    if (!trimmedCategory) return alert("Category is required");
    if (!numericPrice || numericPrice <= 0) return alert("Enter valid price");
    if (!trimmedDescription) return alert("Description is required");

    setSubmitting(true);

    try {

      let imageUrl = editItem?.imageUrl || null;

      // If new image uploaded
      if (image) {
        imageUrl = await readImageAsDataUrl(image);
      }

      if (editItem) {
        // 🔥 UPDATE MODE
        await updateDoc(doc(fireStore, 'products', editItem.id), {
          title: trimmedTitle,
          category: trimmedCategory,
          price: numericPrice,
          description: trimmedDescription,
          imageUrl,
        });

      } else {

        // 🔥 ADD MODE
        await addDoc(collection(fireStore, 'products'), {
          title: trimmedTitle,
          category: trimmedCategory,
          price: numericPrice,
          description: trimmedDescription,
          imageUrl,
          userId: auth.user.uid,
          userName: auth.user.displayName || 'Anonymous',
          userEmail: auth.user.email,
          createdAt: new Date(),
        });
      }

      const datas = await fetchFromFirestore();
      setItems(datas);

      toggleModalSell();

    } catch (error) {
      console.log(error);
      alert('Failed to save item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      onClick={toggleModalSell}
      show={status}
      position="center"
      size="md"
      popup
    >
      <ModalBody
        className="bg-white p-0 rounded-md"
        onClick={(event) => event.stopPropagation()}
      >

        <img
          onClick={() => {
            toggleModalSell();
            setImage(null);
          }}
          className="w-6 absolute top-6 right-8 cursor-pointer"
          src={close}
          alt=""
        />

        <div className="p-6">
          <p className="font-bold text-lg mb-3">
            {editItem ? "Edit Item" : "Sell Item"}
          </p>

          <form onSubmit={handleSubmit}>

            <Input setInput={setTitle} value={title} placeholder='Title' />
            <Input setInput={setCategory} value={category} placeholder='Category' />
            <Input setInput={setPrice} value={price} placeholder='Price' />
            <Input setInput={setDescription} value={description} placeholder='Description' />

            {/* IMAGE */}
            <div className="pt-2 w-full relative">
              <div className="relative h-40 w-full border-2 border-black rounded-md">
                <input
                  onChange={handleImageUpload}
                  type="file"
                  className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                  accept="image/*"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <img className="w-12" src={fileUpload} alt="" />
                  <p className="text-sm pt-2">Click to upload image</p>
                </div>
              </div>
            </div>

            {submitting ? (
              <div className="w-full flex h-14 justify-center pt-4">
                <img className="w-32" src={loading} alt="" />
              </div>
            ) : (
              <div className="w-full pt-3">
                <button
                  className="w-full p-3 rounded-lg text-white"
                  style={{ backgroundColor: '#002f34' }}
                >
                  {editItem ? "Update Item" : "Sell Item"}
                </button>
              </div>
            )}

          </form>
        </div>

      </ModalBody>
    </Modal>
  );
};

export default Sell;
