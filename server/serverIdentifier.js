const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const identifierFilePath = path.join(__dirname, 'server-identifier.json');

async function serverIdentifier() {
    const identifier = uuidv4();
    const timestamp = new Date().toISOString();
  
    const newEntry = {
      identifier,
      timestamp
    };
  
    try {
      const exists = await fs.pathExists(identifierFilePath);
      let data = [];
  
      if (exists) {
        data = await fs.readJson(identifierFilePath);
      }
  
      data.push(newEntry);
  
      await fs.writeJson(identifierFilePath, data, { spaces: 2 });
      return identifier;
    } catch (err) {
      console.error('Error writing server identifier to file', err);
      throw err;
    }
  }

module.exports = serverIdentifier;