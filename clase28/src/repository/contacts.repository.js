import { CreateContactDto, GetContactDto } from "../dto/contact.dto.js";

export class ContactRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getContacts() {
    const contacts = await this.dao.get();
    const contactsDto = contacts.map((contact) => new GetContactDto(contact));
    return contactsDto;
  }
  async getContactById(id) {
    const contact = await this.dao.getById(id);
    const contactDto = new GetContactDto(contact);
    return contactDto;
  }
  async createContact(contact) {
    const contactDto = new CreateContactDto(contact);
    const newContact = await this.dao.post(contactDto);
    return newContact;
  }
}