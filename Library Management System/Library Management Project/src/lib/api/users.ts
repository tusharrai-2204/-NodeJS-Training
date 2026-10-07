import axios from "axios"

const instance = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com"
});

export const getUsers = async () => (await instance.get("/users")).data;

export const getUserPosts = async (userId: number) => (await instance.get(`posts?userId=${userId}`)).data

export const getUserById = async (userId: number) => (await instance.get(`/users/${userId}`)).data;