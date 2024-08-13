import { connectToDB } from "@/utils/database";
import { UserModel } from "@/models/users";
import bcrypt from 'bcrypt';

export const POST = async (request) => {
    const { name, email, password ,role} = await request.json();

    try {
        await connectToDB();

        const existingName = await UserModel.findOne({ name });
        if (existingName) {
            return new Response("Name already exists", { status: 400 });
        }

        const existingEmail = await UserModel.findOne({ email });
        if (existingEmail) {
            return new Response("Email already exists", { status: 400 });
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({ email, name, password: hashedPassword,role: role || 'user'  });
            const user = await newUser.save();

            return new Response(JSON.stringify(user), { status: 201 });
        } else {
            return new Response("Password is required", { status: 400 });
        }

    } catch (error) {
        console.error("Failed to create user:", error);
        return new Response("Failed to create user", { status: 500 });
    }
};
