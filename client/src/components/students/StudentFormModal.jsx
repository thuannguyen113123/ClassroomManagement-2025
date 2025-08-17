import React, { useEffect, useState } from "react";

export default function CreateStudentModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "create",
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
    address: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        role: initialData.role || "",
        address: initialData.address || "",
      });
    } else {
      setForm({
        name: "",
        phone: "",
        email: "",
        role: "",
        address: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

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
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {mode === "create" ? "Create Student" : "Edit Student"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Student Name
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
              disabled={mode === "edit"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              name="role"
              type="text"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              {mode === "create" ? "Create" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
