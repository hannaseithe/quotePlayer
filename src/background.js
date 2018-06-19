var timeoutId;
var notificationId = 0;

var state = {
    count: 0,
    running: false,
    minutes: null
}

var lib = new window.localStorageDB('library', localStorage);

// Check if the database was just created. Useful for initial database setup
if (lib.isNew()) {

    var rows = [
        {
            "quote": "Schönheit ist nie etwas rein äußerliches",
            "author": "John O'Donohue",
            "source": "Schönheit"
        },
        {
            "quote": "Sich die Zeit nehmen, um wirklich dort zu sein, wo man gerade ist",
            "author": "John O'Donohue",
            "source": "Schönheit"
        },
        {
            "quote": "Eine ehrfürchtige Annäherung erzeugt Tiefe",
            "author": "John O'Donohue",
            "source": "Schönheit"
        }
    ];

    // create the "books" table
    lib.createTableWithData("quotes", rows);

    // commit the database to localStorage
    // all create/drop/insert/update/delete operations should be committed
    lib.commit();
}
var quotes = lib.queryAll('quotes');

var startInterval = function (duration) {
    this.state.running = true;
    this.state.minutes = duration || 1;
    _startTimer(state.minutes);

}

function _startTimer(minutes) {
    timeoutId = window.setTimeout(function () {
        var options = {
            type: "basic",
            title: "A quote by " + quotes[state.count % quotes.length].author,
            message: quotes[state.count % quotes.length].quote,
            contextMessage: "Source: " + quotes[state.count % quotes.length].source,
            buttons: [
                { title: "close" },
                { title: "stop" }
            ],
            requireInteraction: true,
            iconUrl: "icon.png"
        };
        chrome.notifications.create("quote" + notificationId, options);
        state.count++;

    }, minutes * 6000);
}

function sendMessage(message, data) {
    chrome.runtime.sendMessage({
        msg: message,
        data: data
    });
}

function updateState(newState) {
    Object.assign(state, newState);
    sendMessage("updateState", state);
}

var stopInterval = function () {
    chrome.notifications.clear("quote" + notificationId);
    notificationId++;
    window.clearTimeout(timeoutId);
    updateState({running: false});
}

var saveQuote = function (formElements) {
    var quoteText = formElements.text;
    var quoteAuthor = formElements.author;
    var quoteSource = formElements.source;

    if (quoteText) {
        lib.insert("quotes", { quote: quoteText, author: quoteAuthor, source: quoteSource });
        lib.commit();
        quotes = lib.queryAll('quotes');
    }

}

chrome.notifications.onButtonClicked.addListener(function (id, buttonIndex) {
    if (id === "quote" + notificationId) {
        if (buttonIndex === 0) {
            chrome.notifications.clear(id);
        } else if (buttonIndex === 1) {
            stopInterval();
            chrome.runtime.sendMessage({
                msg: "togglePlayStop"
            });
        }
    }
});
chrome.notifications.onClosed.addListener(function (id) {
    if (id === "quote" + notificationId) {
        _startTimer(this.state.minutes);
    }
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.msg) {
            case "getState":
                sendResponse(state);
                break;
            case "startTimer":
                startInterval(request.minutes);
                sendResponse(state);
                break;
            case "stopTimer":
                stopInterval();
                sendResponse(state);
                break;
            default:
                console.log("background.js: Unidentified Message received ");
        }
    });