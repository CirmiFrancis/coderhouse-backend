import { contactsDao } from "../dao/factory.js";
import { ContactRepository } from "./contacts.repository.js";

export const contactsService = new ContactRepository(contactsDao);