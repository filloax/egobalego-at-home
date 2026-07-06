Questa è la sezione per il controllo della mod tramite WebSocket, un sistema tramite il quale (se l'impostazione del servizio "Live Update" è attiva nella mod) Egobalego at Home e la mod possono comunicare in tempo reale, a differenza delle altre sezioni che richiedono aspettare che la mod chieda i dati aggiornati.

È possibile inviare diversi eventi distinti:
*   Trigger istantaneo di un **dialogo** per tutti i ricercatori con un giocatore vicino (solo modalità legacy);
*   Popup di una **notifica**, da impostare come spiegato nella sezione "Comunicazioni";
*   Popup di una **notifica client**, che arriva direttamente al client della mod invece che a un server/mondo caricato - funziona anche dal menu principale (solo modalità nuova, richiede `clientDataSync` attivo nella config della mod);
*   Esecuzione di un **comando** qualsiasi nel gioco (come i comandi manuali della sezione "Comandi" richiedono di attivare l'opzione _"remoteCommandExecution"_);
*   **Ricarica dei dati** impostati tramite le altre sezioni (quest'ultimo disponibile anche nelle altre pagine se il WebSocket è connesso);
*   **Ricarica dei dati client**, come sopra ma diretta al client della mod invece che a un server/mondo caricato (solo modalità nuova).

Se il WebSocket non è collegato non sarà possibile inviare nessun evento e i pulsanti saranno disattivati. Se sono attivi cliccarci sopra manderà l'evento corrispondente alla mod, e si coloreranno di verde in caso di successo, di rosso in caso di fallimento.

In alto (se c'è connessione) si può visualizzare l'ultima risposta della mod con il timestamp corrispondente, ed eventuali dettagli vengono mostrati a destra.
