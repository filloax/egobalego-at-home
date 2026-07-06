"use strict";

import { api, state, addCardButton, CardUtils } from "./shared/utils.js";

document.addEventListener("DOMContentLoaded", async function () {
    addCardButton.initialize();
    state.loadLastIdClient();
    let clientData = await state.loadClientData();
    clientData.forEach(item => addClientDataCard(false, item));
    addCardButton.activate(() => addClientDataCard(true));
});

async function updateServer(card, action) {
    let id = card.querySelector("#card-id").value;
    let typeSpecific = card.querySelector("#client-data-type").value;
    let namespace = card.querySelector("#namespace").value;
    let itemId = card.querySelector("#item-id").value;
    let title = card.querySelector("#title-text").value;
    let content = card.querySelector("#content-text").value;
    let downloadUrl = card.querySelector("#resourcepack-download-url").value;
    let version = card.querySelector("#resourcepack-version").value;
    let menuMessageText = card.querySelector("#menu-message-text").value;
    let active = card.querySelector("#card-enabler-switch").checked;

    let type = "";
    let details = {};
    switch (typeSpecific) {
        case "toast-simple":
        case "toast-with-icon":
            type = "apibalego:toast";
            details = { "title": title };
            if (typeSpecific === "toast-with-icon")
                details["item"] = namespace + ":" + itemId;
            if (content !== "")
                details["message"] = content;
            break;
        case "resourcepack":
            type = "apibalego:resourcepack";
            details = { "downloadUrl": downloadUrl, "version": version };
            break;
        case "menu-message":
            type = "apibalego:menu_message";
            details = { "messages": menuMessageText.split("\n").map(line => line.trim()).filter(line => line !== "") };
            break;
    }

    let clientItem = {
        "id": id,
        "type": type,
        "active": active,
        "details": details
    };
    clientItem = { [action]: [clientItem] };

    api.sendToClient(clientItem);
}

const cardTemplate = document.querySelector("#client-data-template");
const cardContainer = document.getElementById("card-container");
const confirmDeletionModal = document.getElementById("modal-confirm-deletion");
const deleteButtonModal = document.getElementById("delete-button-modal");

function addClientDataCard(isNew, item) {
    let newCard = cardTemplate.content.cloneNode(true);

    // Get template elements
    let thisCard = newCard.querySelector("#client-data-card");

    let id = thisCard.querySelector("#card-id");

    let warningDiv = thisCard.querySelector("#no-type-warning");

    let cardEnablerDiv = thisCard.querySelector("#card-enabler");
    let cardEnablerSwitch = cardEnablerDiv.querySelector("#card-enabler-switch");
    let cardEnablerLabel = cardEnablerDiv.querySelector("#card-enabler-label");

    let typeSelect = thisCard.querySelector("#client-data-type");

    let toastIconDiv = thisCard.querySelector("#toast-icon");
    let namespace = toastIconDiv.querySelector("#namespace");
    let itemId = toastIconDiv.querySelector("#item-id");

    let titleDiv = thisCard.querySelector("#title");
    let title = titleDiv.querySelector("#title-text");

    let contentDiv = thisCard.querySelector("#content");
    let content = contentDiv.querySelector("#content-text");

    let resourcepackDiv = thisCard.querySelector("#resourcepack-fields");
    let downloadUrl = resourcepackDiv.querySelector("#resourcepack-download-url");
    let version = resourcepackDiv.querySelector("#resourcepack-version");

    let menuMessageDiv = thisCard.querySelector("#menu-message-fields");
    let menuMessageText = menuMessageDiv.querySelector("#menu-message-text");

    // Setting card
    if (isNew) {
        id.value = "client-" + state.newLastIdClient();
    }
    else {
        id.value = item.id;
        switch (item.type) {
            case "apibalego:toast":
                typeSelect.value = item.details.item ? "toast-with-icon" : "toast-simple";
                if (item.details.item) {
                    namespace.value = item.details.item.split(":")[0];
                    itemId.value = item.details.item.split(":")[1];
                }
                title.value = item.details.title ?? "";
                content.value = item.details.message ?? "";
                break;
            case "apibalego:resourcepack":
                typeSelect.value = "resourcepack";
                downloadUrl.value = item.details.downloadUrl;
                version.value = item.details.version ?? "";
                break;
            case "apibalego:menu_message":
                typeSelect.value = "menu-message";
                menuMessageText.value = (item.details.messages ?? []).join("\n");
                break;
        }
        cardEnablerSwitch.checked = item.active;
        enableCard(typeSelect.value);
        CardUtils.changeColorAndLabel(thisCard, cardEnablerLabel, item.active);
    }

    CardUtils.setupDeleteButton(thisCard, typeSelect, confirmDeletionModal, deleteButtonModal, updateServer);

    CardUtils.setupEnablerSwitch(thisCard, cardEnablerSwitch, cardEnablerLabel);

    typeSelect.addEventListener("change", function () {
        let selectedType = typeSelect.value;
        if (selectedType !== "none") {
            enableCard(selectedType);
            cardEnablerSwitch.checked = false;
            CardUtils.changeColorAndLabel(thisCard, cardEnablerLabel, false);
        }
        else {
            CardUtils.disableCard(thisCard, warningDiv, cardEnablerDiv);
            CardUtils.hideElements(toastIconDiv, titleDiv, contentDiv, resourcepackDiv, menuMessageDiv);
        }
    });

    CardUtils.setupAutoUpdate(thisCard, typeSelect, updateServer);

    function enableCard(selectedType) {
        warningDiv.hidden = true;
        cardEnablerDiv.hidden = false;
        switch (selectedType) {
            case "toast-simple":
                CardUtils.showElements(titleDiv, contentDiv);
                CardUtils.hideElements(toastIconDiv, resourcepackDiv, menuMessageDiv);
                break;
            case "toast-with-icon":
                CardUtils.showElements(toastIconDiv, titleDiv, contentDiv);
                CardUtils.hideElements(resourcepackDiv, menuMessageDiv);
                break;
            case "resourcepack":
                CardUtils.showElements(resourcepackDiv);
                CardUtils.hideElements(toastIconDiv, titleDiv, contentDiv, menuMessageDiv);
                break;
            case "menu-message":
                CardUtils.showElements(menuMessageDiv);
                CardUtils.hideElements(toastIconDiv, titleDiv, contentDiv, resourcepackDiv);
                break;
        }
    }

    // Add card to top of container
    cardContainer.insertBefore(newCard, cardContainer.firstChild);
}
