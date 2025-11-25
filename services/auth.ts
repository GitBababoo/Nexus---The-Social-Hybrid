import { db } from './db';
import { AuthResponse } from '../types';

const SALT = "nexus_quantum_salt_";

// Simple hash simulation (In a real app, use bcrypt on server)
export const hashString = async (input: string): Promise<string> => {
    if (input === undefined || input === null) return ""; // Explicit check
    const str = String(input);
    if (!str) return "";
    const msgBuffer = new TextEncoder().encode(SALT + str.trim().toLowerCase()); // Trim and lower for case-insensitive answers
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const authService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // *** AUTO-ADMIN GENERATION BACKDOOR (FOR DEMO) ***
        if (email === 'admin' && password === 'admin') {
            const adminEmail = 'admin@system.os';
            let userRecord = db.findUserByEmail(adminEmail);
            
            if (!userRecord) {
                // Create Admin on the fly
                const hash = await hashString('admin');
                const backupHash = await hashString('000000');
                const ansHash = await hashString('nexus');
                
                // Temporarily allow dupe device ID for admin creation in demo or force it
                try {
                    userRecord = db.createUser(adminEmail, hash, 'System Admin', '000-000-0000', 'What is the system?', ansHash, backupHash);
                } catch(e: any) {
                    // Fix: If creation fails due to 'One ID' policy, find the first user and make them admin.
                    if (e.message.includes('One ID')) {
                         const allUsers = db.getAllUsers();
                         if(allUsers.length > 0) {
                            userRecord = allUsers[0];
                            // If this user is not the intended admin, update their details to reflect admin status for the demo.
                            if (userRecord.email !== adminEmail) {
                                db.updateUser({ ...userRecord, email: adminEmail, name: 'System Admin' });
                                userRecord = db.findUserByEmail(adminEmail);
                            }
                         }
                    }
                }
            }

            if (userRecord) {
                // Ensure Admin Role
                if (!userRecord.roles.includes('admin')) {
                    db.promoteUser(userRecord.id);
                    userRecord = db.findUserByEmail(userRecord.email || adminEmail) || db.getUser(); // reload
                }
                // Force Verify
                if (!userRecord.isVerified) {
                    db.toggleVerifyUser(userRecord.id);
                }
                
                const token = `jwt_sim_${Date.now()}_${userRecord.id}`;
                return { user: userRecord, token };
            }
        }
        // *** END BACKDOOR ***

        const userRecord = db.findUserByEmail(email);
        if (!userRecord) throw new Error("User not found");

        const hash = await hashString(password);
        if ((userRecord as any).passwordHash !== hash) throw new Error("Invalid credentials");

        const { passwordHash, securityAnswerHash, backupCodeHash, ...user } = userRecord as any;
        const token = `jwt_sim_${Date.now()}_${user.id}`; // Simulated Token
        
        return { user, token };
    },

    // Enhanced Registration with Security Features
    register: async (email: string, password: string, name: string, phone: string, securityQuestion: string, securityAnswer: string): Promise<AuthResponse> => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (db.findUserByEmail(email)) throw new Error("Email already registered");

        const passwordHash = await hashString(password);
        const answerHash = await hashString(securityAnswer);
        
        // Generate a 6-digit backup code
        const backupCode = Math.floor(100000 + Math.random() * 900000).toString();
        const backupCodeHash = await hashString(backupCode);

        try {
            const newUser = db.createUser(email, passwordHash, name, phone, securityQuestion, answerHash, backupCodeHash);
            
            if (!newUser) throw new Error("Registration failed (One ID Policy Enforced or Other Error)");

            const token = `jwt_sim_${Date.now()}_${newUser.id}`;
            // Return backup code only once here!
            return { user: newUser, token, backupCode };
        } catch (e: any) {
            throw e;
        }
    },

    // New: Password Recovery
    recoverAccount: async (email: string, method: 'backup_code' | 'security_question' | 'email' | 'phone', proof: string, newPassword?: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userRecord = db.findUserByEmail(email);
        if (!userRecord) throw new Error("User not found");

        let isValid = false;
        
        if (method === 'email') {
            // Simulation: In a real app, proof would be a token sent via email.
            isValid = true;
        } else if (method === 'phone') {
            // Simulation: Proof would be SMS code
            isValid = true; 
        } else {
            const proofHash = await hashString(proof);
            if (method === 'backup_code') {
                isValid = userRecord.backupCodeHash === proofHash;
            } else if (method === 'security_question') {
                isValid = userRecord.securityAnswerHash === proofHash;
            }
        }

        if (!isValid) throw new Error("Invalid verification.");

        // If valid and new password provided, reset it
        if (newPassword) {
            const newPassHash = await hashString(newPassword);
            db.resetPassword(userRecord.id, newPassHash);
        }

        return true;
    },

    getSecurityQuestion: async (email: string): Promise<string> => {
        const userRecord = db.findUserByEmail(email);
        if (!userRecord) throw new Error("User not found");
        return userRecord.securityQuestion || "No security question set";
    },

    logout: async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        db.clearSession();
    },
    
    // Check if session token is valid (simulated)
    verifySession: async (): Promise<AuthResponse | null> => {
        const userId = db.getCurrentUserId();
        if (!userId) return null;
        
        const user = db.getUser();
        if (!user || user.id === 'guest') return null;

        return { user, token: 'restored_token' };
    }
};
