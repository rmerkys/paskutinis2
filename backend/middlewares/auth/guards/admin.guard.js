const express = require("express");
const moment = require("moment");
const { validateAdminKey } = require("../utils/admin.util");
const { validateOwnerKey } = require("../utils/owner.util");
const adminGuard = express.Router();
const { MongoClient, ObjectId } = require("mongodb");

adminGuard.use(async (req, res, next) => {
  const reqKey = req.headers["api-key"];
  const lastUsedvalue = moment().toISOString();

  if (validateAdminKey(reqKey) || validateOwnerKey(reqKey)) {
    const client = await new MongoClient("mongodb://localhost:27017").connect();
    const mongoKey = await client
      .db("events")
      .collection("keys")
      .find({ key: `${reqKey}` })
      .toArray();
    const mongoKeyId = mongoKey[0]._id;
    await client
      .db("events")
      .collection("keys")
      .updateOne({ _id: mongoKeyId }, { $set: { lastUsed: lastUsedvalue } });
    await client.close();
    next();
    return;
  }

  res.status(401).send("Unauthorized");
});

module.exports = adminGuard;
