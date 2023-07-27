class Participant {
  name;
  surname;
  emailAdress;
  birthdate;

  constructor(name, surname, emailAdress, birthdate) {
    this.name = name;
    this.surname = surname;
    this.emailAdress = emailAdress;
    this.birthdate = birthdate;
  }
}

module.exports = Participant;
