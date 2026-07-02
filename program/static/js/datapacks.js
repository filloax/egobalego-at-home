"use strict";

import { api, state, addCardButton, CardUtils } from "./shared/utils.js";

document.addEventListener("DOMContentLoaded", async function () {
    addCardButton.initialize();
    state.loadLastId();
    let serverData = await state.loadServerData();
    serverData.forEach(item => {
        if (item.type === "apibalego:datapack")
            addDatapackCard(false, item);
    });
    addCardButton.activate(() => addDatapackCard(true));
});

async function updateServer(card, action) {
    let id = card.querySelector("#card-id").value;
    let downloadUrl = card.querySelector("#datapack-download-url").value;
    let version = card.querySelector("#datapack-version").value;
    let active = card.querySelector("#card-enabler-switch").checked;

    let datapackData = {
        "id": id,
        "type": "apibalego:datapack",
        "active": active,
        "details": {
            "downloadUrl": downloadUrl,
            "version": version
        }
    };
    datapackData = { [action]: [datapackData] };

    api.sendToServer(datapackData);
}

const cardTemplate = document.querySelector("#datapack-template");
const cardContainer = document.getElementById("card-container");
const confirmDeletionModal = document.getElementById("modal-confirm-deletion");
const deleteButtonModal = document.getElementById("delete-button-modal");

function addDatapackCard(isNew, item) {
    let newCard = cardTemplate.content.cloneNode(true);

    // Get template elements
    let thisCard = newCard.querySelector("#datapack-card");

    let id = thisCard.querySelector("#card-id");

    let warningDiv = thisCard.querySelector("#no-type-warning");

    let cardEnablerDiv = thisCard.querySelector("#card-enabler");
    let cardEnablerSwitch = cardEnablerDiv.querySelector("#card-enabler-switch");
    let cardEnablerLabel = cardEnablerDiv.querySelector("#card-enabler-label");

    let downloadUrlInput = thisCard.querySelector("#datapack-download-url");
    let versionInput = thisCard.querySelector("#datapack-version");

    // Setting card
    if (isNew) {
        id.value = "datapack-" + state.newLastId();
    }
    else {
        id.value = item.id;
        downloadUrlInput.value = item.details.downloadUrl;
        versionInput.value = item.details.version ?? "";
        cardEnablerSwitch.checked = item.active

        enableDatapackCard();
        CardUtils.changeColorAndLabel(thisCard, cardEnablerLabel, item.active);
    }

    downloadUrlInput.addEventListener("change", function () {
        if (downloadUrlInput.value.trim() !== "") {
            enableDatapackCard();
            cardEnablerSwitch.checked = false;
            CardUtils.changeColorAndLabel(thisCard, cardEnablerLabel, false)
        }
        else {
            CardUtils.disableCard(thisCard, warningDiv, cardEnablerDiv);
        }
    });

    CardUtils.setupDeleteButton(thisCard, downloadUrlInput, confirmDeletionModal, deleteButtonModal, updateServer);

    CardUtils.setupEnablerSwitch(thisCard, cardEnablerSwitch, cardEnablerLabel);

    CardUtils.setupAutoUpdate(thisCard, downloadUrlInput, updateServer);

    function enableDatapackCard() {
        warningDiv.hidden = true;
        CardUtils.showElements(cardEnablerDiv);
    }

    // Add card to top of container
    cardContainer.insertBefore(newCard, cardContainer.firstChild);
}
