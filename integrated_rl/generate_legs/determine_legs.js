function determine_legs(calendar_entries) {
    let legs = [];
    for (i = 0; i < calendar_entries.length; i++) {
        if (i === 0) {
            legs.push({
                'legId': i,
                'origin': generateLocationDetails("Holzkirchen", "2018-12-17T08:00:00+01:00", ""),
                'destination': generateLocationDetails(calendar_entries[i]["location"], calendar_entries[i]["startDateTime"], "")
            });
        } else {
            legs.push({
                'legId': i,
                'origin': generateLocationDetails(calendar_entries[i - 1]["location"], calendar_entries[i - 1]["endDateTime"], ""),
                'destination': generateLocationDetails(calendar_entries[i]["location"], calendar_entries[i]["startDateTime"], "")
            });
        }
    }
    legs.push({
        'legId': calendar_entries.length + 1,
        'origin': generateLocationDetails(calendar_entries[calendar_entries.length - 1]["location"], calendar_entries[calendar_entries.length - 1]["endDateTime"], ""),
        'destination': generateLocationDetails("Holzkirchen", "2018-12-22T20:00:00+01:00", "")
    });
    return legs;
}

function generateLocationDetails(place, dateTime, dynamisierung) {
    return {
        'place': place,
        'dateTime': dateTime,
        'dynamisierung': dynamisierung
    }
}