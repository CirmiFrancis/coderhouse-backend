import { Router } from "express";
import { contactsService } from "../repository/index.js";
//import { contactsDao } from "../dao/factory.js";
// import { ContactsMongo } from "../dao/managers/mongo/contacts.mongo.js";
// import { ContactsMemory } from "../dao/managers/memory/contacts.memory.js";

const router = Router();
// const contactsService = new ContactsMongo();
// const contactsService = new ContactsMemory();

router.get("/", async (req, res) => {
  try {
    const contacts = await contactsService.getContacts();
    res.send({ status: "succes", payload: contacts });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);
    res.send({ status: "succes", payload: contact });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const contact = req.body;
    const newContact = await contactsService.createContact(contact);
    res.send({ status: "succes", payload: newContact });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

export default router;