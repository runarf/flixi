import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const writeJsonToFile = (json, fileName) => {
  fs.writeFile(
    `${__dirname}/../jsons/${fileName}.json`,
    JSON.stringify(json, null, 2),
    err => {
      if (err) {
        console.log("error writing to file" + err);
      } else {
        console.log("successfully wrote file");
      }
    }
  );
};

export default writeJsonToFile;
