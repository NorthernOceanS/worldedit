var serverSystem = server.registerSystem(0, 0);

var positionArray = new Array(0);
var block, blockState, ticking_area, time = 0

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
            display_chat("§b NZ is JULAO!")

            //display_chat(`/fill ${positionArray[0].x} ${positionArray[0].y} ${positionArray[0].z} ${positionArray[1].x} ${positionArray[1].y} ${positionArray[1].z} ${block.__identifier__.slice("minecraft:".length)}`);
            //serverSystem.executeCommand(`/fill ${positionArray[0].x} ${positionArray[0].y} ${positionArray[0].z} ${positionArray[1].x} ${positionArray[1].y} ${positionArray[1].z} ${block.__identifier__.slice("minecraft:".length)}`, (commandResultData) => { ; });
            var minPosition = {
                x: Math.min(positionArray[0].x, positionArray[1].x),
                y: Math.min(positionArray[0].y, positionArray[1].y),
                z: Math.min(positionArray[0].z, positionArray[1].z),
            }
            var maxPosition = {
                x: Math.max(positionArray[0].x, positionArray[1].x),
                y: Math.max(positionArray[0].y, positionArray[1].y),
                z: Math.max(positionArray[0].z, positionArray[1].z)
            }

            display_chat(minPosition.x)
            display_chat(minPosition.y)
            display_chat(minPosition.z)
            display_chat(maxPosition.x)
            display_chat(maxPosition.y)
            display_chat(maxPosition.z)

            for (var x = minPosition.x; x <= maxPosition.x; x++) {
                for (var y = minPosition.y; y <= maxPosition.y; y++) {
                    for (var z = minPosition.z; z <= maxPosition.z; z++) {
                        display_chat("Position:")
                        display_chat(x)
                        display_chat(y)
                        display_chat(z)
                        generate(x,y,z)
                    }
                }
            }


            serverSystem.destroyEntity(entity);
        }
    })
}

serverSystem.update = function () {
    time++
};

function display_chat(message) {
    let eventData = serverSystem.createEventData("minecraft:display_chat_event");
    if (eventData) {
        eventData.data.message = message;
        serverSystem.broadcastEvent("minecraft:display_chat_event", eventData);
    }
}

function generate(x, y, z) {
    serverSystem.executeCommand(`/setblock ${x} ${y} ${z} ${block.__identifier__.slice("minecraft:".length)}`, (commandResultData) => {

        display_chat(JSON.stringify(commandResultData, null, '\t'));
        display_chat("Position now:")
        display_chat(x)
        display_chat(y)
        display_chat(z)

        var targerBlock = serverSystem.getBlock(ticking_area, x, y, z)

        display_chat(JSON.stringify(targerBlock, null, '\t'))

        var targetBlockStateComponent = serverSystem.getComponent(targerBlock, "minecraft:blockstate")
        targetBlockStateComponent.data = blockState
        serverSystem.applyComponentChanges(targerBlock, targetBlockStateComponent)
    });
}