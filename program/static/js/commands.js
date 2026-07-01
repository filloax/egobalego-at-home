"use strict";

import { api, state, addCardButton, CardUtils, mode } from "./shared/utils.js";

document.addEventListener("DOMContentLoaded", async function () {
    addCardButton.initialize();
    state.loadLastId();
    let serverData = await state.loadServerData();
    if (mode === "legacy") {
        let command_types = ["command", "operation"]
        serverData.forEach(item => {
            if (command_types.includes(item.type))
                addCommandCard(false, item);
        });
    } else {
        serverData.forEach(item => {
            if (item.type === "apibalego:command")
                addCommandCard(false, item);
        });
    }
    addCardButton.activate(() => addCommandCard(true));
});

async function updateServer(card, action) {
    let id = card.querySelector("#card-id").value;
    let type = card.querySelector("#command-type").value;
    let content = card.querySelector("#command-content").value;
    let x = card.querySelector("#x-coord").value;
    let y = card.querySelector("#y-coord").value;
    let z = card.querySelector("#z-coord").value;
    let active = card.querySelector("#card-enabler-switch").checked;

    let commandData;
    if (mode === "legacy") {
        commandData = {
            "id": id,
            "type": type === "manual" ? "command" : "operation",
            "active": active
        };
        if (type === "manual")
            commandData["content"] = content;
        else {
            commandData["name"] = type;
            if (type !== "rmResearcher" && type !== "rmTentWithGift") {
                commandData["x"] = parseInt(x) || 0;
                commandData["y"] = parseInt(y) || 0;
                commandData["z"] = parseInt(z) || 0;
            }
        }
    } else {
        commandData = {
            "id": id,
            "type": "apibalego:command",
            "active": active,
            "details": {
                "command": content,
                "x": parseInt(x) || 0,
                "y": parseInt(y) || 0,
                "z": parseInt(z) || 0
            }
        };
    }
    commandData = { [action]: [commandData] };

    api.sendToServer(commandData);
}

const cardTemplate = document.querySelector("#command-template");
const cardContainer = document.getElementById("card-container");
const confirmDeletionModal = document.getElementById("modal-confirm-deletion");
const deleteButtonModal = document.getElementById("delete-button-modal");

function addCommandCard(isNew, item) {
    let newCard = cardTemplate.content.cloneNode(true);

    // Get template elements
    let thisCard = newCard.querySelector("#command-card");

    let id = thisCard.querySelector("#card-id");

    let warningDiv = thisCard.querySelector("#no-type-warning");

    let cardEnablerDiv = thisCard.querySelector("#card-enabler");
    let cardEnablerSwitch = cardEnablerDiv.querySelector("#card-enabler-switch");
    let cardEnablerLabel = cardEnablerDiv.querySelector("#card-enabler-label");

    let commandTypeSelect = thisCard.querySelector("#command-type");

    let manualCommandDiv = thisCard.querySelector("#manual-command");
    let commandContent = manualCommandDiv.querySelector("#command-content");

    let coordinatesDiv = thisCard.querySelector("#coordinates");
    let x = coordinatesDiv.querySelector("#x-coord");
    let y = coordinatesDiv.querySelector("#y-coord");
    let z = coordinatesDiv.querySelector("#z-coord");

    if (isNew) {
        id.value = "command-" + state.newLastId();
    }
    else {
        id.value = item.id;
        if (mode === "legacy") {
            switch (item.type) {
                case "command":
                    commandTypeSelect.value = "manual";
                    manualCommandDiv.hidden = false;
                    commandContent.value = item.content;
                    break;
                case "operation":
                    commandTypeSelect.value = item.name;
                    if (item.name !== "rmResearcher" && item.name !== "rmTentWithGift") {
                        coordinatesDiv.hidden = false;
                        x.value = item.x;
                        y.value = item.y;
                        z.value = item.z;
                    }
                    break;
            }
        } else {
            commandTypeSelect.value = "manual";
            manualCommandDiv.hidden = false;
            commandContent.value = item.details.command;
            coordinatesDiv.hidden = false;
            x.value = item.details.x ?? 0;
            y.value = item.details.y ?? 0;
            z.value = item.details.z ?? 0;
        }
        warningDiv.hidden = true;
        cardEnablerDiv.hidden = false;
        cardEnablerSwitch.checked = item.active
        CardUtils.changeColorAndLabel(thisCard, cardEnablerLabel, item.active);
    }

    CardUtils.setupDeleteButton(thisCard, commandTypeSelect, confirmDeletionModal, deleteButtonModal, updateServer);

    CardUtils.setupEnablerSwitch(thisCard, cardEnablerSwitch, cardEnablerLabel);

    commandTypeSelect.addEventListener("change", function () {
        let selectedCommand = commandTypeSelect.value;
        if (selectedCommand !== "none") {
            warningDiv.hidden = true;
            cardEnablerDiv.hidden = false;
            cardEnablerSwitch.checked = false;
            CardUtils.changeColorAndLabel(thisCard, cardEnablerLabel, false);
            switch (selectedCommand) {
                case "manual":
                    CardUtils.showElements(manualCommandDiv);
                    CardUtils.hideElements(coordinatesDiv);
                    break;
                case "rmResearcher":
                case "rmTentWithGift":
                    CardUtils.hideElements(manualCommandDiv, coordinatesDiv);
                    break;
                case "tpResearcher":
                case "spawnResearcher":
                case "rmTent":
                    CardUtils.showElements(coordinatesDiv);
                    CardUtils.hideElements(manualCommandDiv);
                    break;
            }
        } else {
            CardUtils.disableCard(thisCard, warningDiv, cardEnablerDiv)
            CardUtils.hideElements(manualCommandDiv, coordinatesDiv);
        }
    });

    CardUtils.setupAutoUpdate(thisCard, commandTypeSelect, updateServer);

    // Add card to top of container
    cardContainer.insertBefore(newCard, cardContainer.firstChild);
}