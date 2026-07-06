Questa è la sezione dati client, per la **client gamemaster API** di Apibalego (`apibalego:toast`, `apibalego:resourcepack`, `apibalego:menu_message`). A differenza del resto di questa app, questi elementi vengono interrogati (polled) direttamente dal client della mod via HTTP, indipendentemente dal mondo/server — funzionano anche dal menu principale, senza bisogno di un mondo caricato.

- **Notifica**: mostra una notifica toast lato client, stessi campi di quella in Comunicazioni (titolo, messaggio opzionale, oggetto icona opzionale).
- **Resource pack**: invia un resource pack al giocatore tramite URL di download. Incrementa la **versione** ogni volta che cambi il contenuto dello zip, così la mod lo riscarica, altrimenti terrà la copia già scaricata in precedenza. Richiede `clientResourcePackSync` attivo nella config della mod.
- **Messaggio menu principale**: sostituisce il pool di frasi splash vanilla con una tua lista di messaggi, uno per riga.

**Nota:** questa funzione non è disponibile in modalità legacy, dato che si basa sulla nuova API di Apibalego, e richiede `clientDataSync` attivo nella config della mod (disattivato di default).
