import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';

const image_hosting_key = import.meta.env.VITE_IMGBB_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddProduct = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleAddProduct = async e => {
    e.preventDefault();
    const form = e.target;

    const image = form.image.files[0];
    const name = form.name.value;
    const price = parseFloat(form.price.value);
    const description = form.description.value;
    const category = form.category.value;
    const rating = parseFloat(form.rating.value);
    const totalSold = 0;

    if (isNaN(rating) || rating > 5 || rating < 0) {
      toast.error('Rating should be between 0 and 5');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const { data } = await axios.post(image_hosting_api, formData);
      const imageUrl = data.data.display_url;

      const productDoc = {
        image: imageUrl,
        name,
        price,
        description,
        category,
        rating,
        sellerEmail: user?.email,
        sellerImage: user?.photoURL,
        sellerName: user?.displayName,
        totalSold,
        date_Time: new Date().toLocaleDateString(),
      };

     return console.log(productDoc);
      const { data: productConf } = await axiosSecure.post(
        `/add-product?email=${user?.email}`,
        productDoc
      );
      if (productConf.insertedId) {
        toast.success('Product added successfully');
        // navigate('/manage-products');
      }
    } catch (err) {
      toast.error(err.message);
      return;
    }
  };
  return (
    <div className="my-10">
      <Helmet>
        <title>Zenova | Add Products</title>
      </Helmet>
      <div className="text-center">
        {/* <h3 className="text-2xl font-bold">Add your product</h3> */}
        <span
          style={{ color: '#DD028B', fontWeight: 'bold', fontSize: '25px' }}
        >
          <Typewriter
            words={['Add product']}
            loop={50}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </span>
        <div className="mt-8 mx-auto w-full md:w-2/3">
          <form onSubmit={handleAddProduct}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left side */}
              <div className="flex-1">
                <label className="block mt-4 mb-1">Product Name</label>
                <input
                  className="w-full p-2 border rounded-lg focus:outline-green-500"
                  type="text"
                  required
                  name="name"
                  placeholder="Product name"
                />

                <label className="block mt-4 mb-1">Product Image</label>
                <input
                  required
                  type="file"
                  name="image"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                />

                <label className="block mt-4 mb-1">Product Description</label>
                <textarea
                  className="w-full p-2 border rounded-lg focus:outline-green-500"
                  name="description"
                  required
                  placeholder="Product description"
                  cols="1"
                  rows="2"
                />
              </div>
              {/* Right side */}
              <div className="flex-1">
                <label className="block mt-4">Product Price in $</label>
                <input
                  className="w-full p-2 border rounded-lg focus:outline-green-500"
                  type="number"
                  required
                  name="price"
                  placeholder="Product price"
                />

                <label className="block mt-4 mb-1">Category</label>
                <select
                  defaultValue="undefined"
                  className="w-full p-2 border rounded-lg focus:outline-green-500"
                  name="category"
                  required
                >
                  <option hidden value="undefined">
                    Select a category
                  </option>
                  <option value="Electronics">Electronics</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Computers">Computers</option>
                </select>

                <label className="block mt-4 mb-1">Rating</label>
                <input
                  className="w-full p-2 border rounded-lg focus:outline-green-500"
                  type="number"
                  required
                  name="rating"
                  placeholder="Product Rating"
                />
              </div>
            </div>
            <input
              className="mt-10 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#DD028B] rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer"
              type="submit"
              value="Add Product"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
