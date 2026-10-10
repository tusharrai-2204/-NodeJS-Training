import type { LoginInput, RegisterInput } from "../schema/auth.schema.js";
import * as userRepo from "../repositories/user.repo.js";
import bcrypt from 'bcrypt';
import { BadRequestError, ConflictError, UnauthorizedError } from "../utils/AppError.js";

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
        throw new ConflictError('User with this email already exists'); 
    }


    const hashedPassword = await bcrypt.hash(registerInput.password, 10);

    const userId = await userRepo.createUser({
        first_name: registerInput.first_name,
        middle_name: registerInput.middle_name ?? null,
        last_name: registerInput.last_name,
        email: registerInput.email,
        auth_provider: 'local',
        provider_user_id: null,
        password: hashedPassword,
        role: 'user'
    });

    return { id: userId, email: registerInput.email }; 
};

export const loginUser = async (loginInput: LoginInput) => {

    const user = await userRepo.findUserByEmail(loginInput.email);

    if (!user) {
        throw new UnauthorizedError("Invalid credentials");
    }

    if (user.auth_provider === 'google') {
        throw new BadRequestError('This account uses Google Login. Please login in with Google.')
    }

    if (!user.password) {
        throw new UnauthorizedError('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(loginInput.password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid credentials");
    }

    const { password, ...croppedUser } = user;
    return croppedUser;
}

export const googleAuthUser = async (input: GoogleAuthInput) => {
    const existingUser = await userRepo.findUserByEmail(input.email);

    if (existingUser) {
        if (existingUser.auth_provider === 'local') {
            throw new ConflictError('This email is already registed. Please log in with your password');
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
        password: null,
        role: 'user'
    });

    const newUser = await userRepo.findUserById(userId);
    return newUser!;
}