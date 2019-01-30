var serverSystem = server.registerSystem(0, 0);

var positionArray = new Array(0);
var block

serverSystem.initialize = function () {
    serverSystem.listenForEvent("minecraft:entity_created", (eventData) => {
        var entity = eventData.entity;
        serverSystem.broadcastEvent("minecraft:display_chat_event", entity.__identifier__);
        if (entity.__identifier__ === "worldedit:select") {
            var position = serverSystem.getComponent(entity, "minecraft:position");
            serverSystem.broadcastEvent("minecraft:display_chat_event",`\nSelecting position:\nx:${position.x}\ny:${position.y}\nz:${position.z}`);
            
            positionArray.push(position);
            if(positionArray.length>=3){
                serverSystem.broadcastEvent("minecraft:display_chat_event", "\nWarning:Positions exceeded.The first position is ignored.");
                positionArray.shift();
            }
            serverSystem.destroyEntity(entity);
        }
        else if (entity.__type__ === "item_entity") {
            serverSystem.broadcastEvent("minecraft:display_chat_event",`Selecting block: ${entity.__identifier__}`)
            block = entity;
            serverSystem.destroyEntity(entity);
        }
        else if(entity.__identifier__ === "worldedit:execute"){
            serverSystem.broadcastEvent("minecraft:execute_command", `/fill ${positionArray[0].x} ${positionArray[0].y} ${positionArray[0].z} ${positionArray[1].x} ${positionArray[1].y} ${positionArray[1].z} ${block.__identifier__.slice("minecraft:".length)}`)
        }
    })
    serverSystem.broadcastEvent("minecraft:display_chat_event",positionArray.length)
}

serverSystem.update = function () {

};
function generate(entity) {

    if (entity.__type__ == "item_entity") {
        serverSystem.broadcastEvent("minecraft:execute_command", "/fill 0 70 0 10 70 10" + " " + entity.__identifier__.slice("minecraft:".length))
    }
    else {
        serverSystem.broadcastEvent("minecraft:display_chat_event", entity.__identifier__)
        var nameComponent = serverSystem.getComponent(entity, "minecraft:nameable")
        // nameComponent.name = entity.__identifier__
        nameComponent.name = "Ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"
        serverSystem.applyComponentChanges(entity, nameComponent)
    }
}