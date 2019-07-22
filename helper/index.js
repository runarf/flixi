const fs = require('fs')

const writeJsonToFile = (json, fileName) => {
    fs.writeFile(`${__dirname}/../jsons/${fileName}.json`, JSON.stringify(json, null, 2), err => {
        if (err) {
            console.log("error writing to file" + err)
        } else {
            console.log("successfully wrote file")
        }
    })    
}

module.exports = {
    writeJsonToFile
}