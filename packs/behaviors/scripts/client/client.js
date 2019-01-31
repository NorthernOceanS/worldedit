var clientSystem = client.registerSystem(0, 0);

clientSystem.initialize = function () {
    // clientSystem.listenForEvent("minecraft:client_entered_world", (eventData) => onPlayerEnter(eventData))
    // clientSystem.broadcastEvent("minecraft:load_ui", "main.html")
};

clientSystem.update = function () {

};
function onPlayerEnter(eventData) {
    // clientSystem.broadcastEvent("minecraft:display_chat_event", "Hi.")
    clientSystem.broadcastEvent("worldedit:player_entered", eventData)
}