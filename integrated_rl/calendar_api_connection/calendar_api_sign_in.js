var legs;

/**
 *  On load, called to load the auth2 library and API client library.
 */
async function handleClientLoad() {
    return new Promise(resolve => {
        gapi.load('client:auth2', initClient);
        resolve(1);
    })
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        handleAuthClick;
    }, function (error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        listUpcomingEvents();
    } else {
        appendPre("Login not successfull");
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    /*var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);*/
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;
        appendPre('Upcoming events:');

        var calendar_entries = [];
        $.each(events, function () {
            if (this.start.dateTime && this.end.dateTime && this.location) {
                var event = {
                    'id': this.id,
                    'name': this.summary,
                    'startDateTime': this.start.dateTime,
                    'endDateTime': this.end.dateTime,
                    'location': this.location,
                    'status': this.status,
                    'created': this.created,
                    'updated': this.updated
                };
                calendar_entries.push(event);
            }
        });

        legs = determine_legs(calendar_entries);

        /*if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                var where = events[i].location;
                if (where) {
                    appendPre(event.summary + ' (Zeitpunkt: ' + when + ', Ort: ' + where + ')');
                } else {
                    appendPre("No Location given for: " + event.summary);
                }
            }
        } else {
            appendPre('No upcoming events found.');
        }*/
        startProcess(legs);
    });
}