var clientSystem = client.registerSystem(0, 0);
var playerID
clientSystem.initialize = function () {
    clientSystem.listenForEvent("minecraft:client_entered_world", (eventData) => {playerID = eventData.data.player.id})
    clientSystem.listenForEvent("worldedit:setPosition", (eventData) => {
        displayChat(JSON.stringify(eventData, null, '    '))
    })
};

clientSystem.update = function () {

};

function displayChat(message) {
    let eventData = clientSystem.createEventData("minecraft:display_chat_event");
    if (eventData) {
        eventData.data.message = message;
        clientSystem.broadcastEvent("minecraft:display_chat_event", eventData);
    }
}