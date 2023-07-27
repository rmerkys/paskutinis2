const moment = require("moment");
const { MongoClient } = require("mongodb");

const validateAdminKey = async (key) => {
  const client = await new MongoClient("mongodb://localhost:27017").connect();
  const adminKeys = await client
    .db("events")
    .collection("keys")
    .find({})
    .toArray();
  await client.close();
  const adminApiKeyIndex = adminKeys.findIndex(
    (adminApiKey) => adminApiKey.key === key
  );

  if (adminApiKeyIndex !== -1) {
    adminKeys[adminApiKeyIndex].lastUsed = moment().toISOString();
    return true;
  }

  return false;
};

module.exports = { validateAdminKey };
