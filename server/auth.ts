import { User } from '../types';
import * as db from './db';

// --- SIMULATED JWT ---
// In a real app, use a library like 'jsonwebtoken' and a real secret key.
const JWT_SECRET = 'your-super-secret-key-that-is-not-in-the-frontend';

const createToken = (user: User): string => {
  const payload = {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    exp: Date.now() + 60 * 60 * 1000, // Expires in 1 hour
  };
  return btoa(JSON.stringify(payload));
};

// --- AUTH LOGIC ---

export const requestOtp = (name: string, email: string, password: string): { success: boolean, message: string } => {
  if (db.findUserByEmail(email)) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  const newUser: User = {
    id: `student_${Date.now()}`, name, email, password, role: 'student',
    enrolledCourses: [], externalAccounts: [], isVerified: false,
  };
  
  db.addUser(newUser);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  db.setOtp(email, otp);
  
  // Simulate sending OTP via email
  console.log(`DEV ONLY: Your OTP for ${email} is: ${otp}`);

  return { success: true, message: 'An OTP has been sent to your email.' };
};

export const verifyOtpAndRegister = (email: string, otp: string): { success: boolean, message: string, token?: string, user?: User } => {
    const storedOtpData = db.getOtp(email);

    if (!storedOtpData) return { success: false, message: 'No OTP request found. Please register again.' };
    if (Date.now() > storedOtpData.expires) {
        db.deleteOtp(email);
        return { success: false, message: 'Your OTP has expired. Please register again.' };
    }
    if (storedOtpData.otp !== otp) return { success: false, message: 'Invalid OTP.' };

    const user = db.findUserByEmail(email);
    if (!user) return { success: false, message: 'Could not find user account to verify.' };
    
    user.isVerified = true;
    db.deleteOtp(email);

    const token = createToken(user);
    const { password, ...userWithoutPassword } = user;
    return { success: true, message: 'Account verified successfully!', token, user: userWithoutPassword };
};

export const login = (email: string, password: string): { success: boolean, message: string, token?: string, user?: User } => {
    const user = db.findUserByEmail(email);

    if (!user || user.password !== password) {
        return { success: false, message: 'Invalid email or password.' };
    }
    if (!user.isVerified) {
        return { success: false, message: 'Your account is not verified.' };
    }

    const token = createToken(user);
    const { password: _, ...userWithoutPassword } = user;
    return { success: true, message: 'Login successful!', token, user: userWithoutPassword };
};