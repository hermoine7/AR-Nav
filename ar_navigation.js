let coordinates = {}

$(document).ready(function () {
    get_coordinates();
    render_elements();
})

function get_coordinates() {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('source') && searchParams.has('destination')) {
        let source = searchParams.get('source')
        let destination = searchParams.get('destination')
        coordinates.source_lat = source.split(";")[0]
        coordinates.source_lon = source.split(";")[1]
        coordinates.destination_lat = destination.split(";")[0]
        coordinates.destination_lon = destination.split(";")[1]
    } else {
        alert("Coordinates not selected!")
        window.history.back();
    }
}

function render_elements() {
   $.ajax({
    url: `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.source_lon}%2C${coordinates.source_lat}%3B${coordinates.destination_lon}%2C${coordinates.destination_lat}?alternatives=true&geometries=polyline&steps=true&access_token=pk.eyJ1IjoiYXBvb3J2ZWxvdXMiLCJhIjoiY2ttZnlyMDgzMzlwNTJ4a240cmEzcG0xNyJ9.-nSyL0Gy2nifDibXJg4fTA`,
    type: "get",
    success: function(responce){
        var steps = responce.routes[0].legs[0].steps;
        console.log(steps);

        let images = { 
        "turn_right": "ar_right.png",
        "turn_left": "ar_left.png",
        "slight_right": "ar_slight_right.png", 
        "slight_left": "ar_slight_left.png", 
        "straight": "ar_straight.png" 
        }

        for (let index = 0; index < steps.length; index++) {
            var dist = steps[index].distance;
            var instruction = steps[index].maneuver.instruction;
            var image;

            if (instruction.includes("Turn right")) {
                image = "turn_right"
            }
            else if (instruction.includes("Turn left")){
                image = "turn_left"
            }
            // else if (instruction.includes("Slight right")){
            //     image = "slight_right"
            // }
            // else if (instruction.includes("Slight left")){
            //     image = "slight_left"
            // }

            if(index > 0){
                $("#scene_container").append(
                    `<a-entity gps-entity-place="latitude: ${steps[index].maneuver.location[1]}; longitude: ${steps[index].maneuver.location[0]}">
                        <a-image 
                        name="${instruction}"
                        src="./assets/${images[image]}"
                        look-at="#step_${index-1}"
                        scale="5 5 5"
                        id="step_${index}"
                        position="0 0 0"
                        />
                        <a-entity> 
                            <a-text height="50" value="${instruction} (${dist}m)">
                            </a-text> 
                        </a-entity>
                    </a-entity>
                    `
                )
            }
            else{
                $("#scene_container").append(
                    `<a-entity gps-entity-place="latitude: ${steps[index].maneuver.location[1]}; longitude: ${steps[index].maneuver.location[0]}">
                        <a-image 
                        name="${instruction}"
                        src="./assets/ar_start.png"
                        look-at="#step_${index+1}"
                        scale="5 5 5"
                        id="step_${index}"
                        position="0 0 0"
                        />
                        <a-entity> 
                            <a-text height="50" value="${instruction} (${dist}m)">
                            </a-text> 
                        </a-entity>
                    </a-entity>
                    `
                )
            }
        }
    }
    })
}
