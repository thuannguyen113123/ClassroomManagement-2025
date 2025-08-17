import nodemailer from "nodemailer";
import { UserModel } from "../models/userModel.js";
import { client } from "../configs/twilio.js";
import { StudentModel } from "../models/studentModel.js";
import { generateToken } from "../configs/jwt.js";
import bcrypt from "bcrypt";

// Tạo mã 6 chữ số
function generate6DigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Chuẩn hóa số điện thoại
function formatPhoneNumber(phoneNumber) {
  if (phoneNumber.startsWith("0")) {
    return "+84" + phoneNumber.slice(1);
  }
  if (phoneNumber.startsWith("+")) {
    return phoneNumber;
  }
  throw new Error("Invalid phone number format");
}

export const authController = {
  // Gửi mã truy cập qua SMS
  async createAccessCode(req, res) {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res
        .status(400)
        .json({ success: false, error: "Missing phoneNumber" });
    }

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      let user = await UserModel.getUserByPhone(formattedPhone);

      if (!user) {
        await UserModel.createUser({
          phone: formattedPhone,
          role: "student",
          name: "",
          email: "",
        });
        user = await UserModel.getUserByPhone(formattedPhone);
      }

      const code = generate6DigitCode();
      await UserModel.setAccessCode(formattedPhone, code);

      await client.messages.create({
        body: `Your access code is: ${code}`,
        messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
        to: formattedPhone,
      });

      return res.json({ success: true, message: "Access code sent" });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error:
          error.code === 21608
            ? "Trial account chỉ gửi SMS tới số đã xác thực."
            : "Failed to send access code",
      });
    }
  },

  // Xác minh mã truy cập (SMS)
  async validateAccessCode(req, res) {
    const { phoneNumber, accessCode } = req.body;

    if (!phoneNumber || !accessCode) {
      return res
        .status(400)
        .json({ success: false, error: "Missing parameters" });
    }

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const storedCode = await UserModel.getAccessCode(formattedPhone);

      if (storedCode === accessCode) {
        await UserModel.clearAccessCode(formattedPhone);
        const user = await UserModel.getUserByPhone(formattedPhone);

        if (!user) {
          return res
            .status(404)
            .json({ success: false, error: "User not found" });
        }

        const token = generateToken({ phone: formattedPhone, role: user.role });

        return res.json({
          success: true,
          token,
          role: user.role,
          phone: user.phone,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, error: "Invalid access code" });
      }
    } catch (error) {
      console.error("Validation error:", error);
      return res
        .status(500)
        .json({ success: false, error: "Validation error" });
    }
  },
};

//Login Email
export const loginEmailController = async (req, res) => {
  const { email } = req.body;

  try {
    const student = await StudentModel.findByEmail(email);
    if (!student) {
      return res.status(404).json({ error: "No students found." });
    }

    const existingUser = await UserModel.getUserByPhone(student.phone);
    if (!existingUser) {
      await UserModel.createUser({
        phone: student.phone,
        name: student.name,
        email: student.email,
        role: student.role || "student",
      });
    }

    const accessCode = generate6DigitCode();
    await StudentModel.update(student.uid, { accessCode });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "20004209@st.vlute.edu.vn",
      to: email,
      subject: "Login Code - Classroom App",
      html: `<p>Mã đăng nhập của bạn là: <b>${accessCode}</b>. Mã này có hiệu lực trong vài phút.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Verification code sent via email." });
  } catch (err) {
    res.status(500).json({ error: "error server" });
  }
};
//Xác thực email
export const validateAccessCodeEmail = async (req, res) => {
  const { email, accessCode } = req.body;

  try {
    const student = await StudentModel.findByEmail(email);
    if (!student) {
      return res.status(404).json({ error: "No students found." });
    }

    if (student.accessCode !== accessCode) {
      return res
        .status(400)
        .json({ error: "The verification code is incorrect." });
    }

    // Xóa mã sau khi xác thực
    await StudentModel.update(student.uid, { accessCode: "" });

    // Lấy thông tin người dùng trong bảng UserModel
    const user = await UserModel.getUserByPhone(student.phone);

    const token = generateToken({
      phone: student.phone,
      role: student.role || "student",
      email: student.email,
      username: user?.username || "",
    });

    res.json({
      success: true,
      token,
      role: student.role || "student",
      phone: student.phone,
      email: student.email || "",
      username: user?.username || "",
    });
  } catch (err) {
    console.error("Erorr validateAccessCode:", err);
    res.status(500).json({ error: "Error server" });
  }
};

export const loginWithUsernamePassword = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password." });
  }

  try {
    const user = await UserModel.getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: "Wrong account or password." });
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ error: "Wrong account or password." });
    }

    const token = generateToken({
      phone: user.phone,
      role: user.role,
      username: user.username,
    });

    return res.json({
      success: true,
      token,
      role: user.role,
      phone: user.phone,
    });
  } catch (err) {
    res.status(500).json({ error: "Error server" });
  }
};
