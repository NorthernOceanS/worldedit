var clientSystem = client.registerSystem(0, 0);
var playerID
let positionArray = []
let blockTypeArray = []
function Coordinate(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
}
function Position(coordinate, tickingArea) {
    this.coordinate = coordinate
    this.tickingArea = tickingArea
}
function BlockType(blockIdentifier, blockState) {
    this.blockIdentifier = blockIdentifier
    this.blockState = blockState
}
function Block(position, blockType) {
    this.position = position
    this.blockType = blockType
}
function Generator(name, positionArrayLength, blockTypeArrayLength, generator) {
    this.name = name;
    this.positionArrayLength = positionArrayLength
    this.blockTypeArrayLength = blockTypeArrayLength
    this.generator = generator
}
generatorArray = []
generatorArray.push(new Generator("Create a solid rectangle with two points.", 2, 1, function () {
    displayChat("§b NZ is JULAO!")

    let blockArray = []

    let minPosition = {
        x: Math.min(positionArray[0].x, positionArray[1].x),
        y: Math.min(positionArray[0].y, positionArray[1].y),
        z: Math.min(positionArray[0].z, positionArray[1].z),
    }
    let maxPosition = {
        x: Math.max(positionArray[0].x, positionArray[1].x),
        y: Math.max(positionArray[0].y, positionArray[1].y),
        z: Math.max(positionArray[0].z, positionArray[1].z)
    }

    displayChat(minPosition.x)
    displayChat(minPosition.y)
    displayChat(minPosition.z)
    displayChat(maxPosition.x)
    displayChat(maxPosition.y)
    displayChat(maxPosition.z)

    for (let x = minPosition.x; x <= maxPosition.x; x++) {
        for (let y = minPosition.y; y <= maxPosition.y; y++) {
            for (let z = minPosition.z; z <= maxPosition.z; z++) {
                displayChat("Position:")
                displayChat(x)
                displayChat(y)
                displayChat(z)
                blockArray.push(
                    new Block(
                        new Position(
                            new Coordinate(x, y, z),
                            positionArray[0].tickingArea
                        ),
                        blockTypeArray[0]
                    )
                )
            }
        }
    }
}))

clientSystem.initialize = function () {

    const scriptLoggerConfig = clientSystem.createEventData("minecraft:script_logger_config");
	scriptLoggerConfig.data.log_errors = true;
	scriptLoggerConfig.data.log_information = true;
	scriptLoggerConfig.data.log_warnings = true;
	clientSystem.broadcastEvent("minecraft:script_logger_config", scriptLoggerConfig);

    clientSystem.listenForEvent("minecraft:client_entered_world", (eventData) => {
        playerID = eventData.data.player.id
        //displayObject(generatorArray)
    })
    clientSystem.listenForEvent("worldedit:setPosition", (eventData) => {
        if (playerID == eventData.data.playerID) {
            displayObject(eventData)
            positionArray.push(eventData.data)
        }

    })
    clientSystem.listenForEvent("worldedit:setBlockType", (eventData) => {
        if (playerID == eventData.data.playerID) {
            displayObject(eventData)
            blockTypeArray.push(eventData.data)
        }
    })
};

clientSystem.update = function () {

};

function displayObject(object) {
    displayChat(JSON.stringify(object, null, '    '))
}
function displayChat(message) {
    let eventData = clientSystem.createEventData("minecraft:display_chat_event");
    if (eventData) {
        eventData.data.message = message;
        clientSystem.broadcastEvent("minecraft:display_chat_event", eventData);
    }
}