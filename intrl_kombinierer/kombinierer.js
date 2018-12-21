var legs;
function startProcess(legs_input) {
    legs = legs_input
    for(i=0; i<legs.length; i++){
        $("#travelPossibilities").append(
            "<li id = " + i + ">Zeige eine Reiselösung für die Reise von "
            + legs[i].origin.place + " nach "
            + legs[i].destination.place + " an</li>");
    };
    $("li").click(function(){
        let id = $(this).attr("id");
        console.log(id);
        console.log(generateSolutions(id));
    })

    /*legs.forEach(function (leg) {
        initPlaceService().then(function () {
            travelSolutions.push(pushToTravelsolutions(leg));
        })
    });*/
}
var tSolutions;
function generateSolutions(id){
    console.log(legs[id]);
    initPlaceService().then(async function () {
        generateTravelSolutions(legs[id])
            .then(function(travelSolutions) {
                console.log(travelSolutions);
                tSolutions = travelSolutions;
                setTimeout(function(){printTravelSolutions(travelSolutions, id)}, 200);
            })
    })

}
var solutions;
function printTravelSolutions(travelSolutions, id){
    solutions2 = $("#muster").clone();
    solutions2.insertAfter($("li#" + id));
    solutions2.show();
    solutions = $("#muster").eq(0).attr("id", "travelSolutionParent" + id);
    $(solutions).find("input").attr("name", "parentPossibility" + id);
    for(i=0; i<3; i++){
        console.log(i);
        $(solutions).find("input").eq(i).attr("id", id + "" + travelSolutions._selection[i].travelMode);
        solutions.find("label").eq(i).html(travelSolutions._selection[i].travelMode);
        solutions.find("label").eq(i).attr("for", id + "" + travelSolutions._selection[i].travelMode);
    }
    $("input").click(function(){
        if($(this).attr("id").includes("COMBINED")){
            let combined_solution = $("#combined_muster").clone();
            combined_solution.insertAfter($("form#travelSolutionParent" + id));
            combined_solution.show();
            let combinedOverview = $(this).parent().parent().find("div#combined_muster").attr("id", "combined" + id);

            $("<tr class = 'secondLine'><td></td><td></td><td></td></tr>").insertAfter(combinedOverview.find("tr"));
            combinedOverview.find(".secondLine td").first().html(generateMessage(tripSelection._selection[2].trip._trip[0]._selection[0].trip._leg, "WALKING"));
            combinedOverview.find(".secondLine td").eq(2).html(generateMessage(tripSelection._selection[2].trip._trip[2]._selection[0].trip._leg, "WALKING"));

            let bahnTrip = tripSelection._selection[2].trip._trip[1]._leg;
            combinedOverview.find(".fixed_mid_travel").text("From "
                + bahnTrip.start_address + " to "
                + bahnTrip.end_address + " at departure "
                + bahnTrip.departure_time.text + " you will arrive at "
                + bahnTrip.arrival_time.text + " after a distance of "
                + bahnTrip.distance.text);

            $("select").change(function(){
                console.log($(this).val());
                if($(this).val() === "car"){
                    column = $(this).parent().index();
                    $(this).parents("table").find("tr").eq(1).find("td").eq(column).html(generateMessage(tripSelection._selection[2].trip._trip[column]._selection[1].trip._leg, "CAR"));
                } else {
                    column = $(this).parent().index();
                    $(this).parents("table").find("tr").eq(1).find("td").eq(column).html(generateMessage(tripSelection._selection[2].trip._trip[column]._selection[0].trip._leg, "WALKING"));
                }
            })
        }
    })
}

function generateMessage(leg, travelMode){
    return "<div>By "
        + travelMode + " it will take "
        + leg.duration.text + " to come "
        + leg.distance.text + " to "
        + leg.end_address + "</div>";
}

function pushToTravelsolutions(leg){
    return new Promise(resolve => {
        generateTravelSolutions(leg)
            .then(function(result){
                setTimeout(function(){resolve(result)}, 5000);
            });
    });
}

$(document).ready(function(){
    $("#firstTrip").click(function(){
        console.log("bin da");
        generateSolutions(0);
    });
    $("#secondTrip").click(function(){
        generateSolutions(1);
    });
});