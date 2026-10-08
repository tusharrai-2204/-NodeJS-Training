import type { LoginInput, RegisterInput } from "../schema/auth.schema.js";
import * as userRepo from "../repositories/user.repo.js";
import bcrypt from 'bcrypt';

interface GoogleAuthInput {
    googleId: string, 
    email: string,
    first_name: string,
    last_name: string
};

export const registerUser = async (registerInput: RegisterInput) => {

    // checking if user with email already exists
    const existingUser = await userRepo.findUserByEmail(registerInput.email);
    if(existingUser) {
        throw new Error('User with this email already exists'); 
    }


    const hashedPassword = await bcrypt.hash(registerInput.password, 10);

    const userId = await userRepo.createUser({
        first_name: registerInput.first_name,
        middle_name: registerInput.middle_name ?? null,
        last_name: registerInput.last_name,
        email: registerInput.email,
        auth_provider: 'local',
        provider_user_id: null,
        password: hashedPassword
    });

    return { id: userId, email: registerInput.email }; 
};

export const loginUser = async (loginInput: LoginInput) => {

    const user = await userRepo.findUserByEmail(loginInput.email);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    if (user.auth_provider === 'google') {
        throw new Error('This account uses Google Login. Please login in with Google.')
    }

    if (!user.password) {
        throw new Error('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(loginInput.password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    const { password, ...croppedUser } = user;
    return croppedUser;
}

export const googleAuthUser = async (input: GoogleAuthInput) => {
    const existingUser = await userRepo.findUserByEmail(input.email);

    if (existingUser) {
        if (existingUser.auth_provider === 'local') {
            throw new Error('This email is already registed. Please log in with your password');
        }

        return existingUser;
    }

    const userId = await userRepo.createUser({
        first_name: input.first_name,
        middle_name: null,
        last_name: input.last_name,
        email: input.email,
        auth_provider: 'google',
        provider_user_id: input.googleId,
        password: null
    });

    const newUser = await userRepo.findUserById(userId);
    return newUser!;
}