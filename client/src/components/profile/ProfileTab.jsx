import React, { useState, useEffect } from "react";
import EditProfileModal from "./EditProfileModal";
import studentApi from "./../../api/studentApi";

export default function ProfileTab({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    setProfile(user);
  }, [user]);

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      const res = await studentApi.updateProfileStudent(
        profile.phone,
        updatedProfile
      );
      setProfile(res.data);

      setIsModalOpen(false);
      alert("Profile updated!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  console.log(profile);

  return (
    <div>
      <div className="bg-white p-6 rounded shadow max-w-md space-y-4">
        <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
          My Profile
        </h2>
        <p>
          <strong>Name:</strong> {profile.name}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Phone:</strong> {profile.phone}
        </p>
        <p>
          <strong>Role:</strong> {profile.role}
        </p>
        <div className="w-full flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm w-full"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={profile}
        onSubmit={handleProfileUpdate}
      />
    </div>
  );
}
