var serverSystem = server.registerSystem(0, 0);

var positionArray = new Array(0);
var block, blockState, ticking_area

serverSystem.initialize = function () {

    serverSystem.registerEventData(
        "worldedit:setPosition",
        { blockPosition: { x: undefined, y: undefined, z: undefined }, playerID: undefined }
    )

    serverSystem.listenForEvent("minecraft:player_placed_block", (eventData) => {
        displayChat(JSON.stringify(eventData, null, '    '))

        ticking_area = serverSystem.getComponent(eventData.data.player, "minecraft:tick_world").data.ticking_area
        block = serverSystem.getBlock(ticking_area, eventData.data.block_position)

        displayChat(JSON.stringify(block, null, '    '))

        blockState = serverSystem.getComponent(block, "minecraft:blockstate").data

        displayChat(JSON.stringify(blockState, null, '    '))
    })
    serverSystem.listenForEvent("minecraft:entity_created", (eventData) => {
        //displayChat(JSON.stringify(eventData,null,'    '))
        var entity = eventData.data.entity;
        if (entity.__identifier__ === "worldedit:select") {
            var position = serverSystem.getComponent(entity, "minecraft:position").data;

            displayChat(`\nSelecting position:\nx:${position.x}\ny:${position.y}\nz:${position.z}`);

            positionArray.push(position);
            if (positionArray.length >= 3) {
                displayChat("\nWarning:Positions exceeded.The first position is ignored.");
                positionArray.shift();
            }
            //serverSystem.destroyEntity(entity);
        }
        else if (entity.__identifier__ === "worldedit:execute") {
            displayChat("§b NZ is JULAO!")

            //displayChat(`/fill ${positionArray[0].x} ${positionArray[0].y} ${positionArray[0].z} ${positionArray[1].x} ${positionArray[1].y} ${positionArray[1].z} ${block.__identifier__.slice("minecraft:".length)}`);
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

            displayChat(minPosition.x)
            displayChat(minPosition.y)
            displayChat(minPosition.z)
            displayChat(maxPosition.x)
            displayChat(maxPosition.y)
            displayChat(maxPosition.z)

            for (var x = minPosition.x; x <= maxPosition.x; x++) {
                for (var y = minPosition.y; y <= maxPosition.y; y++) {
                    for (var z = minPosition.z; z <= maxPosition.z; z++) {
                        displayChat("Position:")
                        displayChat(x)
                        displayChat(y)
                        displayChat(z)
                        generate(x, y, z)
                    }
                }
            }


            //serverSystem.destroyEntity(entity);
        }
    })

    serverSystem.listenForEvent("minecraft:block_interacted_with", (eventData) => {
        displayChat("Event \"minecraft:block_interacted_with\" fired:\n" + JSON.stringify(eventData, null, '    '))
        //TODO:Verify whether the player is permitted to use this addon.
        let setPositionEventData = serverSystem.createEventData("worldedit:setPosition")
        setPositionEventData.data.playerID = eventData.data.player.id
        setPositionEventData.data.blockPosition = eventData.data.block_position
        serverSystem.broadcastEvent("worldedit:setPosition", setPositionEventData)
        displayChat(
            JSON.stringify(
                serverSystem.getComponent(eventData.data.player, "minecraft:hand_container"),
                null,
                '    '
            )
        )
        displayChat(
            JSON.stringify(
                serverSystem.getComponent(eventData.data.player, "minecraft:inventory_container"),
                null,
                '    '
            )
        )
    })
}

serverSystem.update = function () {
};

function displayChat(message) {
    let eventData = serverSystem.createEventData("minecraft:display_chat_event");
    if (eventData) {
        eventData.data.message = message;
        serverSystem.broadcastEvent("minecraft:display_chat_event", eventData);
    }
}

function generate(x, y, z) {
    serverSystem.executeCommand(`/setblock ${x} ${y} ${z} ${block.__identifier__.slice("minecraft:".length)}`, (commandResultData) => {

        displayChat(JSON.stringify(commandResultData, null, '    '));
        displayChat("Position now:")
        displayChat(x)
        displayChat(y)
        displayChat(z)

        var targerBlock = serverSystem.getBlock(ticking_area, x, y, z)

        displayChat(JSON.stringify(targerBlock, null, '    '))

        var targetBlockStateComponent = serverSystem.getComponent(targerBlock, "minecraft:blockstate")
        targetBlockStateComponent.data = blockState
        serverSystem.applyComponentChanges(targerBlock, targetBlockStateComponent)
    });
}