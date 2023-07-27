class Key {
  key;
  lastUsed;
  type;

  static counter = 0;

  constructor(key, lastUsed, type) {
    this.key = key;
    this.lastUsed = lastUsed;
    this.type = type;
  }
}

module.exports = Key;
