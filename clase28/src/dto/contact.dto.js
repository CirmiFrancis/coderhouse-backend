export class CreateContactDto {
    constructor(contact) {
      this.fullName = `${contact.name} ${contact.lastName}`;
      this.active = true;
      this.phone = contact.phone ? contact.phone.split("-").join("") : "";
      this.email = contact.email;
    }
  }
  
  export class GetContactDto {
    constructor(contact) {
      this.name = contact.fullName.split(" ")[0];
      this.lastName = contact.fullName.split(" ")[1];
      this.phone = contact.phone;
      this.email = contact.email;
    }
  }