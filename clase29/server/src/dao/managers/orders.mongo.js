import { ordersModel } from "../models/orders.model.js";

export class OrdersMongo {
  constructor() {
    this.model = ordersModel;
  }
  async getAllOrders() {
    try {
      const orders = await this.model.find();
      return orders;
    } catch (error) {
      console.log(error.message);
      throw new Error("There was an error trying to get the orders.");
    }
  }
  async getOrderById(id) {
    try {
      const order = await this.model.findById(id);
      if (!order) {
        throw new Error("The order does not exist.");
      }
      return order;
    } catch (error) {
      console.log(error.message);
      throw new Error("There was an error trying to get the order.");
    }
  }
  async createOrder(order) {
    try {
      const orderCreated = await this.model.create(order);
      return orderCreated;
    } catch (error) {
      console.log(error.message);
      throw new Error("There was an error trying to create the order.");
    }
  }
  async updateOrder(id, order) {
    try {
      const orderUpdate = await this.model.findByIdAndUpdate(id, order, { new: true });
      return orderUpdate;
    } catch (error) {
      console.log(error.message);
      throw new Error("There was an error trying to update the order.");
    }
  }
}