import React, { useState } from "react";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    location: {
      address: "",
      city: "",
      district: "",
      ward: "",
      geoLocation: { latitude: 0, longitude: 0 },
    },
    landlord: "",
    roomType: "Single",
    size: 0,
    availability: true,
    amenities: {
      wifi: false,
      airConditioner: false,
      heater: false,
      kitchen: false,
      parking: false,
    },
    additionalCosts: {
      electricity: 0,
      water: 0,
      internet: 0,
      cleaning: 0,
    },
    images: [],
    videos: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    console.log(formData);
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Đăng tin</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tiêu đề
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giá
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Địa chỉ
              </label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thành phố
              </label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quận
              </label>
              <input
                type="text"
                name="location.district"
                value={formData.location.district}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phường
              </label>
              <input
                type="text"
                name="location.ward"
                value={formData.location.ward}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Đăng tin
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
