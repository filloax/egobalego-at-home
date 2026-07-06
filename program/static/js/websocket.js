"use strict";

import { time } from "./shared/utils.js";

var socket = io();

document.addEventListener("DOMContentLoaded", function () {
    let footer = document.querySelector('footer');
    let main = document.querySelector('main');
    main.style.paddingBottom = footer.offsetHeight + 'px';

    let noWebsocketWarning = document.getElementById("no-websocket");

    let modResponse = document.getElementById("mod-response");
    let modResponseStatus = document.getElementById("mod-response-status");
    let modResponseTimestamp = document.getElementById("mod-response-timestamp");
    let modResponseDetails = document.getElementById("mod-response-details");

    let reloadButtonDiv = document.getElementById("reload-button-div");
    let reloadButton = reloadButtonDiv.querySelector("#reload-button");

    let cardContainer = document.getElementById("card-container");
    let allCardButtons = cardContainer.querySelectorAll("button");

    let dialogueCard = document.getElementById("websocket-dialogue-card");
    let toastCard = document.getElementById("websocket-toast-card");
    let clientToastCard = document.getElementById("websocket-client-toast-card");
    let commandCard = document.getElementById("websocket-command-card");

    let sendDialogueButton = dialogueCard?.querySelector("#send-dialogue-button");
    let dialogueContent = dialogueCard?.querySelector("#dialogue-content");

    let sendToastButton = toastCard.querySelector("#send-toast-button");
    let toastType = toastCard.querySelector("#toast-type");
    let toastIconDiv = toastCard.querySelector("#toast-icon");
    let toastTitle = toastCard.querySelector("#toast-title");
    let toastIconNamespace = toastCard.querySelector("#namespace");
    let toastIconItemId = toastCard.querySelector("#item-id");
    let toastContent = toastCard.querySelector("#toast-content");

    let sendClientToastButton = clientToastCard?.querySelector("#send-client-toast-button");
    let clientToastType = clientToastCard?.querySelector("#client-toast-type");
    let clientToastIconDiv = clientToastCard?.querySelector("#client-toast-icon");
    let clientToastTitle = clientToastCard?.querySelector("#client-toast-title");
    let clientToastIconNamespace = clientToastCard?.querySelector("#client-namespace");
    let clientToastIconItemId = clientToastCard?.querySelector("#client-item-id");
    let clientToastContent = clientToastCard?.querySelector("#client-toast-content");

    let sendCommandButton = commandCard.querySelector("#send-command-button");
    let commandContent = commandCard.querySelector("#command-content");

    let sendClientReloadButton = document.getElementById("send-client-reload-button");

    let lastClickedButton;

    toastType.onchange = function () {
        toastIconDiv.hidden = (toastType.value == "toast-simple");
    };

    if (clientToastType) {
        clientToastType.onchange = function () {
            clientToastIconDiv.hidden = (clientToastType.value == "toast-simple");
        };
    }


    // Buttons event listeners
    reloadButton.addEventListener("click", function () {
        socket.emit("reload");
        lastClickedButton = reloadButton;
    });

    if (sendDialogueButton) {
        sendDialogueButton.addEventListener("click", function () {
            let dialogue = { "content": dialogueContent.value }
            socket.emit("rdialogue", dialogue);
            lastClickedButton = sendDialogueButton;
        });
    }

    sendToastButton.addEventListener("click", function () {
        let toast = { "title": toastTitle.value }
        if (toastType.value == "toast-with-icon")
            toast["item"] = toastIconNamespace.value + ":" + toastIconItemId.value
        if (toastContent.value !== "")
            toast["message"] = toastContent.value
        socket.emit("toast", toast);
        lastClickedButton = sendToastButton;
    });

    if (sendClientToastButton) {
        sendClientToastButton.addEventListener("click", function () {
            let toast = { "title": clientToastTitle.value }
            if (clientToastType.value == "toast-with-icon")
                toast["item"] = clientToastIconNamespace.value + ":" + clientToastIconItemId.value
            if (clientToastContent.value !== "")
                toast["message"] = clientToastContent.value
            socket.emit("client_toast", toast);
            lastClickedButton = sendClientToastButton;
        });
    }

    sendCommandButton.addEventListener("click", function () {
        let command = { "command": commandContent.value }
        socket.emit("cmd", command);
        lastClickedButton = sendCommandButton;
    });

    if (sendClientReloadButton) {
        sendClientReloadButton.addEventListener("click", function () {
            socket.emit("client_reload");
            lastClickedButton = sendClientReloadButton;
        });
    }


    // Socket event listeners
    socket.on('mod_connect', function() {
        enableConsole()
    });

    socket.on('mod_disconnect', function() {
        disableConsole()
    });

    socket.on('mod_response', (responseString) => {
        let response = JSON.parse(responseString);
        modResponseStatus.value = response.status;
        if (response.status === "success")
            reportResponse(true)
        else
            reportResponse(false)
        modResponseTimestamp.value = time.getCurrentTimestamp();
        delete response.status
        modResponseDetails.value = JSON.stringify(response)
    });


    // Page behavior
    function enableConsole() {
        allCardButtons.forEach(button => button.disabled = false);
        reloadButton.disabled = false;
        noWebsocketWarning.hidden = true;
        modResponse.hidden = false;
    }

    function disableConsole() {
        allCardButtons.forEach(button => button.disabled = true);
        reloadButton.disabled = true;
        noWebsocketWarning.hidden = false;
        modResponse.hidden = true;
    }

    async function reportResponse(isSuccess) {
        modResponseStatus.style.color = isSuccess ? "green" : "red";
        lastClickedButton.classList.remove("btn-primary");
        lastClickedButton.classList.add(isSuccess ? "btn-success" : "btn-danger");
        setTimeout(function () {
            lastClickedButton.classList.remove(isSuccess ? "btn-success" : "btn-danger");
            lastClickedButton.classList.add("btn-primary");
        }, 1000);
    }


    // When page is initialized, check if the mod is connected
    socket.emit("is_mod_connected", (response) => {
        if (response === true)
            enableConsole()
        else
            disableConsole()
    });
});