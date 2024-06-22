//const UserModel = require("../models/user.model.js");
import UserModel from "../models/user.model.js";

class UserRepository {
    async findByEmail(email) {
        return UserModel.findOne({ email });
    }
}

export default UserRepository;