var serverSystem = server.registerSystem(0, 0);

serverSystem.initialize = function () {
    serverSystem.listenForEvent("minecraft:entity_created", (eventData) => generateWithTwoPoints(eventData.entity))
    // serverSystem.listenForEvent("worldedit:player_entered",(eventData) => onClientEnter(eventData))
};

serverSystem.update = function () {

};
// function onClientEnter(eventData){
//     serverSystem.broadcastEvent("minecraft:display_chat_event","Hi.")
//     var player = eventData.player
//     var name = serverSystem.getComponent(player,"minecraft:nameable").name
//     serverSystem.broadcastEvent("minecraft:display_chat_event",name)
//     serverSystem.broadcastEvent("minecraft:display_chat_event",player.id)
// }
function generateWithTwoPoints(entity) {

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