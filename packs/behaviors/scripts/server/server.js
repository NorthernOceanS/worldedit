var serverSystem = server.registerSystem(0, 0);

var positionArray = new Array(0);
var block, blockState, ticking_area

serverSystem.initialize = function () {
    serverSystem.listenForEvent("minecraft:player_placed_block", (eventData) => {
        display_chat(JSON.stringify(eventData, null, '\t'))
        ticking_area = serverSystem.getComponent(eventData.data.player, "minecraft:tick_world").data.ticking_area
        block = serverSystem.getBlock(ticking_area, eventData.data.block_position)
        display_chat(JSON.stringify(block, null, '\t'))
        blockState = serverSystem.getComponent(block, "minecraft:blockstate").data
        display_chat(JSON.stringify(blockState, null, '\t'))
    })
    serverSystem.listenForEvent("minecraft:entity_created", (eventData) => {
        //display_chat(JSON.stringify(eventData,null,'\t'))
        var entity = eventData.data.entity;
        if (entity.__identifier__ === "worldedit:select") {
            var position = serverSystem.getComponent(entity, "minecraft:position").data;

            display_chat(`\nSelecting position:\nx:${position.x}\ny:${position.y}\nz:${position.z}`);

            positionArray.push(position);
            if (positionArray.length >= 3) {
                display_chat("\nWarning:Positions exceeded.The first position is ignored.");
                positionArray.shift();
            }
            serverSystem.destroyEntity(entity);
        }
        else if (entity.__identifier__ === "worldedit:execute") {
            display_chat("§c NZ is JULAO!")

            display_chat(`/fill ${positionArray[0].x} ${positionArray[0].y} ${positionArray[0].z} ${positionArray[1].x} ${positionArray[1].y} ${positionArray[1].z} ${block.__identifier__.slice("minecraft:".length)}`);
            serverSystem.executeCommand(`/fill ${positionArray[0].x} ${positionArray[0].y} ${positionArray[0].z} ${positionArray[1].x} ${positionArray[1].y} ${positionArray[1].z} ${block.__identifier__.slice("minecraft:".length)}`, (commandResultData) => { ; });
            serverSystem.destroyEntity(entity);
        }
    })
}

serverSystem.update = function () {

};

function display_chat(message) {
    let eventData = serverSystem.createEventData("minecraft:display_chat_event");
    if (eventData) {
        eventData.data.message = message;
        serverSystem.broadcastEvent("minecraft:display_chat_event", eventData);
    }
}