import React, { useState, useEffect } from "react";

export default function EditProfileModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Phone</label>
            <input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
