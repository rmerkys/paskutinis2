const express = require("express");
const ownerGuard = require("../middlewares/auth/guards/owner.guard.js");
const Key = require("../models/key.model.js");
const { MongoClient, ObjectId } = require("mongodb");

const router = express.Router();

router.get("/", ownerGuard, async (req, res) => {
  const client = await new MongoClient("mongodb://localhost:27017").connect();
  const adminKeys = await client
    .db("events")
    .collection("keys")
    .find({})
    .toArray();
  await client.close();
  res.send(adminKeys);
});

router.post("/", ownerGuard, async (req, res) => {
  const { key, lastUsed, type } = req.body;
  if (!key || !lastUsed || !type) {
    res.status(400).send("Mandatory fields are missing (key, lastUsed, type)");
    return;
  }
  const adminkey = new Key(key, lastUsed, type);
  const client = await new MongoClient("mongodb://localhost:27017").connect();
  await client.db("events").collection("keys").insertOne(adminkey);
  await client.close();
  res.status(201).send(`Key added successfully`);
});

router.delete("/:key", ownerGuard, async (req, res) => {
  const keyId = req.params.key;
  const client = await new MongoClient("mongodb://localhost:27017").connect();
  await client
    .db("events")
    .collection("keys")
    .deleteOne({ _id: new ObjectId(keyId) });
  await client.close();
  res.status(201).send(`Key with id: ${keyId} deleted`);
});

module.exports = { router };
