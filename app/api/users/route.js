import { connectToDB } from "@/utils/database";
import { UserModel } from "@/models/users";

export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        const users = await UserModel.find();

        return new Response(JSON.stringify(users), { status: 200 })
    } catch (error) {
        return new Response("Failed to user", { status: 500 })
    }
} 