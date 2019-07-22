const flix = require('flix')
const fs = require('fs')

const getStationsFromApi = () => {
    const stationStream = flix.stations.all()
    let stations = []
    stationStream.on('data', station => {
        stations.push(station)
    })

    stationStream.on('end', () => {
        fs.writeFile('./allStations.json', JSON.stringify(stations, null, 2), err => {
            if (err) {
                console.log("error writing to file")
            } else {
                console.log("successfully wrote file")
            }
        })
    })
}

const getStationsCloseToBerlin = () => {
    const allStations = require('./allStations.json')

    const stationsCloseToBerlin = allStations.filter(station => {
        const countryCode = station.location.country.code
        return !["US", "ES"].includes(countryCode)
    })

    fs.writeFile('./stationsCloseToBerlin.json', JSON.stringify(stationsCloseToBerlin, null, 2), err => {
        if (err) {
            console.log("error writing to file")
        } else {
            console.log("successfully wrote file")
        }
    })
}

const getStationsInBerlin = () => {
    const allStations = require('./allStations.json')

    const stationsInBerlin = allStations.filter(station => {
        return station.regions.includes("88")
    })

    writeJsonToFile(stationsInBerlin, "stationsInBerlin")
}

const stationsInBerlinWithConnectionTo = destination => {
    const stationsInBerlin = require('./stationsInBerlin.json')

    const stationsWithConnection = stationsInBerlin.filter(station => {
        return station.connections.includes(destination)
    })

    return stationsWithConnection
}

const stationsInBerlinWithConnectionToGorlitz = () => {
    const withConnection = stationsInBerlinWithConnectionTo(4468)
        .map(station => ({"id": station.id, "name": station.name}))
    writeJsonToFile(withConnection, "connectedWithGorlitz")
}