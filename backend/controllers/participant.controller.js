const express = require("express");
const Participant = require("../models/participant.model.js");
const adminGuard = require("../middlewares/auth/guards/admin.guard.js");
const { MongoClient, ObjectId } = require("mongodb");

const router = express.Router();

router.get("/", adminGuard, async (req, res) => {
  const client = await new MongoClient("mongodb://localhost:27017").connect();
  const participants = await client
    .db("events")
    .collection("participants")
    .find({})
    .toArray();
  await client.close();

  res.send(participants);
});

router.post("/", async (req, res) => {
  const { name, surname, emailAdress, birthdate } = req.body;
  if (!name || !surname || !emailAdress || !birthdate) {
    res
      .status(400)
      .send(
        "Mandatory fields are missing (name, surname, emailAdress, birthdate)"
      );
    return;
  }
  const participant = new Participant(name, surname, emailAdress, birthdate);
  const client = await new MongoClient("mongodb://localhost:27017").connect();
  await client.db("events").collection("participants").insertOne(participant);
  await client.close();
  res.status(201).send(`Participant ${name} ${surname} added successfully`);
});

router.patch("/:id", adminGuard, async (req, res) => {
  const participantId = req.params.id;
  const client = await new MongoClient("mongodb://localhost:27017").connect();
  await client
    .db("events")
    .collection("participants")
    .updateOne({ _id: new ObjectId(participantId) }, { $set: req.body });
  await client.close();
  res.status(200).send(`Participant with id: ${participantId} updated`);
});

router.delete("/:id", adminGuard, async (req, res) => {
  const participantId = req.params.id;
  const client = await new MongoClient("mongodb://localhost:27017").connect();
  await client
    .db("events")
    .collection("participants")
    .deleteOne({ _id: new ObjectId(participantId) });
  await client.close();
  res.status(201).send(`Participant with id: ${participantId} deleted`);
});

module.exports = router;
