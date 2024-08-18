import UserModel from "../models/user.model.js";

class UserRepository {
    async findByEmail(email) { // encontrar usuario por email
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    async findById(id) { // encontrar usuario por id
        try {
            return await UserModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async create(user) { // crear usuario
        try {
            return await user.save();
        } catch (error) {
            throw error;
        }
    }

    async save(user) { // guardar usuario
        try {
            return await user.save();
        } catch (error) {
            throw error;
        }
    }
}

export default UserRepository;