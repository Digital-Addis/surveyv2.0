import { UserModel } from "@/models/users";
import { connectToDB } from "@/utils/database";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const POST = async (request) => {
    try {
        const { email, password } = await request.json();
        
        await connectToDB();

        const doesUserExists = await UserModel.findOne({ email });
        if (!doesUserExists) {
            return new Response("User not found", { status: 404 });
        }

        const passwordMatch = await bcrypt.compare(password, doesUserExists.password);
        if (!passwordMatch) {
            return new Response("Password does not match", { status: 400 });
        }

        const token = jwt.sign(
            {
                id: doesUserExists._id,
                name: doesUserExists.name,
                role: doesUserExists.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return new Response(JSON.stringify({ token }), { status: 200 });

    } catch (error) {
        console.log('Error occurred in login:', error);
        return new Response("Failed to log in user", { status: 500 });
    }
};
