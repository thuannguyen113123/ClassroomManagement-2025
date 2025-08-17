import { ref, set, get, update } from "firebase/database";
import { db } from "../configs/firebase.js";

export const UserModel = {
  // Tạo hoặc cập nhật accessCode, accessCodeCreatedAt trong user
  async setAccessCode(phone, code) {
    const userRef = ref(db, `users/${phone}`);

    const snapshot = await get(userRef);
    let userData = snapshot.exists() ? snapshot.val() : {};

    userData.accessCode = code;
    userData.accessCodeCreatedAt = Date.now();

    await set(userRef, userData);
  },

  async getAccessCode(phone) {
    const snapshot = await get(ref(db, `users/${phone}/accessCode`));
    return snapshot.exists() ? snapshot.val() : null;
  },

  async clearAccessCode(phone) {
    // Xóa code và thời gian tạo code
    await update(ref(db, `users/${phone}`), {
      accessCode: "",
      accessCodeCreatedAt: null,
    });
  },

  // Hàm tạo user mới
  async createUser({ phone, name, email, role = "student" }) {
    const userRef = ref(db, `users/${phone}`);
    await set(userRef, {
      phone,
      name,
      email,
      role,
      accessCode: "",
      accessCodeCreatedAt: null,
    });
  },

  // Hàm cập nhật thông tin user
  async updateUser(phone, data) {
    await update(ref(db, `users/${phone}`), data);
  },
  async findByEmail(email) {
    const snapshot = await get(ref(db, `students`));
    if (!snapshot.exists()) return null;

    const students = snapshot.val();
    for (const uid in students) {
      if (students[uid].email === email) {
        return { uid, ...students[uid] };
      }
    }

    return null;
  },
  async getUserByPhone(phone) {
    const snapshot = await get(ref(db, `users`));
    if (!snapshot.exists()) return null;

    const users = snapshot.val();
    for (const userPhone in users) {
      if (userPhone === phone) {
        return { phone: userPhone, ...users[userPhone] };
      }
    }

    return null;
  },
  async getUserByUsername(username) {
    const snapshot = await get(ref(db, `users`));
    if (!snapshot.exists()) return null;

    const users = snapshot.val();
    for (const phone in users) {
      if (users[phone].username === username) {
        return { phone, ...users[phone] };
      }
    }

    return null;
  },
};
