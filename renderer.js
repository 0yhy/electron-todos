global.electron = require("electron");
global.low = require("lowdb");
global.FileSync = require("lowdb/adapters/FileSync");
const apdater = new FileSync("userinfo.json");
global.db = low(apdater);
