import { User, Payment } from '../types';
import * as db from './db';

// In a real app, this would come from a JWT verification middleware
const decodeTokenPayload = (token: string): { user: { id: string }, exp: number } | null => {
    try {
      const payload = JSON.parse(atob(token));
      return payload;
    } catch (error) {
      console.error("Failed to decode token payload", error);
      return null;
    }
};

export const getUserFromToken = (token: string): { success: boolean, user?: Omit<User, 'password'> } => {
    const payload = decodeTokenPayload(token);
    if (!payload || !payload.user || Date.now() >= payload.exp) {
        return { success: false };
    }

    const user = db.findUserById(payload.user.id);
    if (!user) {
        return { success: false };
    }

    const { password, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
};

export const updateUser = (userId: string, updatedUserData: User): { success: boolean, user?: Omit<User, 'password'> } => {
    const user = db.findUserById(userId);
    if (!user) return { success: false };

    // In a real app, you'd be more careful about what can be updated
    Object.assign(user, updatedUserData);

    const { password, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
};

export const processPaymentAndEnroll = (userId: string, courseId: string, amount: number, transactionId: string): { success: boolean, user?: Omit<User, 'password'> } => {
    const user = db.findUserById(userId);
    const course = db.getCourseById(courseId);

    if (!user || !course) return { success: false };

    // 1. Create a transaction record
    const newPayment: Payment = {
        transactionId, userId, courseId, amount,
        timestamp: new Date().toISOString(),
    };
    db.addTransaction(newPayment);

    // 2. Enroll the user
    if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
    }
    
    const { password, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
};