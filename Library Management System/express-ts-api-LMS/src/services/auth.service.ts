import type { LoginInput, RegisterInput } from "../validators/auth.validator.js";
import * as userRepo from "../repositories/user.repo.js";
import bcrypt from 'bcrypt';

export const registerUser = async (registerInput: RegisterInput) => {

    // checking if email already exists
    const existingEmail = await userRepo.findUserByEmail(registerInput.email);
    if(existingEmail) {
        throw new Error('Email already exists'); // will update later to send 409 conflict error code
    }

    // checkung if username already exists
    const existingUsername = await userRepo.findUserByUsername(registerInput.username);
    if (existingUsername) {
        throw new Error('Username already exists'); // same here 409
    }

    const hashedPassword = await bcrypt.hash(registerInput.password, 10);

    const userId = await userRepo.createUser({
        ...registerInput,
        password: hashedPassword,
        middle_name: registerInput.middle_name ?? null,
    });

    return { id: userId, message: 'User registered successfully' }; 
};

export const loginUser = async (loginInput: LoginInput) => {

    // Find by username or email 
    let user = null;
    if (loginInput.email) {
        user = await userRepo.findUserByEmail(loginInput.email);
    } else if(loginInput.username) {
        user = await userRepo.findUserByUsername(loginInput.username);
    }

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(loginInput.password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    const { password, ...userResponse } = user;
    return { user: userResponse, message: "Login successful" };
}