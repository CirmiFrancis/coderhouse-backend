import { userModel } from "../models/users.model.js";

export class UserMongo {
  constructor() {
    this.model = userModel;
  }

  async getUsers() {
    try {
      const users = await this.model.find();
      return users;
    } catch (error) {
      console.log(error);
      throw new Error("Error: There was an error getting users");
    }
  }

  async getUserById(id) {
    try {
      const user = await this.model.findById(id);

      if (!user) {
        throw new Error("The user does not exist.");
      }
      return user;
    } catch (error) {
      console.log(error.message);
      throw new Error("Error: There was an error trying to get the user.");
    }
  }
  async saveUser(user) {
    try {
      const userCreated = await this.model.create(user);
      return userCreated;
    } catch (error) {
      console.log(error.message);
      throw new Error("Error: There was an error trying to create the user.");
    }
  }
  async updateUser(id, user) {
    try {
      const userUpdate = await this.model.findByIdAndUpdate(id, user, { new: true });
      return userUpdate;
    } catch (error) {
      console.log(error.message);
      throw new Error("Error: There was an error trying to update the user.");
    }
  }
}