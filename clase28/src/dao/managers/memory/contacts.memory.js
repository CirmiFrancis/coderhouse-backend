import { v4 as uuidv4 } from "uuid";

export class ContactsMemory {
  constructor() {
    this.contacts = [
      {
        id: "e2e75614-6b89-4a18-97f3-862cdf560b00",
        name: "David",
        phone: "123456789",
        email: "david@hola",
      },
    ];
  }

  get() {
    return this.contacts;
  }

  getById(id) {
    const contact = this.contacts.find((contact) => contact.id === id);
    if (!contact) {
      throw new Error(`Contact ${id} not found`);
    }

    return contact;
  }

  post(contact) {
    contact.id = uuidv4();
    this.contacts.push(contact);
    return contact;
  }
}