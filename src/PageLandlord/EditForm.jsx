import React, { useState } from "react";
import { X } from "lucide-react";

const EditForm = ({ listing, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    listing || {
      title: "",
      description: "",
      price: 0,
      location: {
        address: "",
        city: "",
        district: "",
        ward: "",
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
        security: 0,
      },
      images: [],
      videos: [],
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      location: {
        ...prevData.location,
        [name]: value,
      },
    }));
  };

  const handleAmenitiesChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      amenities: {
        ...prevData.amenities,
        [name]: checked,
      },
    }));
  };

  const handleAdditionalCostsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      additionalCosts: {
        ...prevData.additionalCosts,
        [name]: parseFloat(value),
      },
    }));
  };

  const handleMediaChange = (e, type) => {
    const files = Array.from(e.target.files);
    const mediaItems = files.map((file) => ({
      url: URL.createObjectURL(file),
      public_id: file.name, // This is a placeholder. In a real app, you'd get this from your backend after upload
    }));
    setFormData((prevData) => ({
      ...prevData,
      [type]: [...prevData[type], ...mediaItems],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Tiêu đề
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Mô tả
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        ></textarea>
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Giá thuê
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.keys(formData.location).map((key) => (
          <div key={key}>
            <label
              htmlFor={key}
              className="block text-sm font-medium text-gray-700"
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              type="text"
              id={key}
              name={key}
              value={formData.location[key]}
              onChange={handleLocationChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        ))}
      </div>

      <div>
        <label
          htmlFor="landlord"
          className="block text-sm font-medium text-gray-700"
        >
          ID của người cho thuê
        </label>
        <input
          type="text"
          id="landlord"
          name="landlord"
          value={formData.landlord}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="roomType"
          className="block text-sm font-medium text-gray-700"
        >
          Loại phòng
        </label>
        <select
          id="roomType"
          name="roomType"
          value={formData.roomType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="Single">Single</option>
          <option value="Double">Double</option>
          <option value="Studio">Studio</option>
          <option value="Apartment">Apartment</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="size"
          className="block text-sm font-medium text-gray-700"
        >
          Diện tích (m2)
        </label>
        <input
          type="number"
          id="size"
          name="size"
          value={formData.size}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="availability"
            checked={formData.availability}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Còn trống</span>
        </label>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">
          Tiện nghi
        </span>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(formData.amenities).map((amenity) => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                name={amenity}
                checked={formData.amenities[amenity]}
                onChange={handleAmenitiesChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">
          Chi phí bổ sung
        </span>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(formData.additionalCosts).map((cost) => (
            <div key={cost}>
              <label
                htmlFor={cost}
                className="block text-sm font-medium text-gray-700"
              >
                {cost.charAt(0).toUpperCase() + cost.slice(1)}
              </label>
              <input
                type="number"
                id={cost}
                name={cost}
                value={formData.additionalCosts[cost]}
                onChange={handleAdditionalCostsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="images"
          className="block text-sm font-medium text-gray-700"
        >
          Hình ảnh
        </label>
        <input
          type="file"
          id="images"
          name="images"
          onChange={(e) => handleMediaChange(e, "images")}
          multiple
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.url}
                alt={`Uploaded ${index + 1}`}
                className="w-20 h-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    images: prev.images.filter((_, i) => i !== index),
                  }))
                }
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="videos"
          className="block text-sm font-medium text-gray-700"
        >
          Video
        </label>
        <input
          type="file"
          id="videos"
          name="videos"
          onChange={(e) => handleMediaChange(e, "videos")}
          multiple
          accept="video/*"
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.videos.map((video, index) => (
            <div key={index} className="relative">
              <video
                src={video.url}
                className="w-20 h-20 object-cover rounded"
                controls
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    videos: prev.videos.filter((_, i) => i !== index),
                  }))
                }
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
};

export default EditForm;
