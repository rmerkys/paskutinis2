const express = require("express");
const { validateOwnerKey } = require("../utils/owner.util");
const { validateAdminKey } = require("../utils/admin.util");
const ownerGuard = express.Router();

ownerGuard.use((req, res, next) => {
  const reqKey = req.headers["api-key"];

  const isOwnerKeyValid = validateOwnerKey(reqKey);

  if (isOwnerKeyValid) {
    next();
    return;
  }

  if (!isOwnerKeyValid && validateAdminKey(reqKey)) {
    res.status(403).send("Forbidden");
  }

  res.status(401).send("Unauthorized");
});

module.exports = ownerGuard;
