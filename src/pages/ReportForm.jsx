import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const ReportForm = ({ onClose, onSubmit, postId, userId }) => {
  const [reportReason, setReportReason] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id_user: userId,
      id_post: postId,
      report_reason: reportReason,
      description: description,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Báo cáo bài đăng</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reportReason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lý do báo cáo
            </label>
            <select
              id="reportReason"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Chọn lý do</option>
              <option value="Spam">Spam</option>
              <option value="Inappropriate Content">
                Nội dung không phù hợp
              </option>
              <option value="Fake Listing">Bài đăng giả mạo</option>
              <option value="Other">Khác</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mô tả chi tiết
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
            >
              Gửi báo cáo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
