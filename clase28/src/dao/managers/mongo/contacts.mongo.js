import { contactsModel } from "../../models/contacts.model.js";

export class ContactsMongo {
  constructor() {
    this.model = contactsModel;
  }

  async get() {
    try {
      return await this.model.find();
    } catch (error) {
      throw new Error("Error to get contacts");
    }
  }

  async getById(id) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error("Error to get contact");
    }
  }

  async post(contact) {
    try {
      const newContact = await this.model.create(contact);
      return newContact;
    } catch (error) {
      throw new Error("Error to post contact");
    }
  }
}