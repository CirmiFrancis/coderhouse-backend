import { businessesModel } from "../models/businesses.model.js";

export class BusinessMongo {
  constructor() {
    this.model = businessesModel;
  }
  async getAllBusinesses() {
    try {
      const business = await this.model.find();
      return business;
    } catch (error) {
      console.log(error.message);
      throw new Error("There was an error trying to get the business.");
    }
  }
  async getBusinessById(id) {
    try {
      const business = await this.model.findById(id);
      if (!business) {
        throw new Error("The business does not exist.");
      }
      return business;
    } catch (error) {
      console.log(error.message);
      throw new Error("There was an error trying to get the business.");
    }
  }
  async createBusiness(business) {
    try {
      const businessCreated = await this.model.create(business);
      return businessCreated;
    } catch (error) {
      console.log(error.message);
      throw new Error("There was an error trying to create the business.");
    }
  }
  async updateBusiness(id, business) {
    try {
      const businessUpdate = await this.model.findByIdAndUpdate(id, business, { new: true });
      return businessUpdate;
    } catch (error) {
      console.log(error.message);
      throw new Error("There was an error trying to update the business.");
    }
  }
}