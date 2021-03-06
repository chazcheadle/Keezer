function docReady(callback) {

    function completed() {
        document.removeEventListener("DOMContentLoaded", completed, false);
        window.removeEventListener("load", completed, false);
        callback();
    }

    //Events.on(document, 'DOMContentLoaded', completed)

    if (document.readyState === "complete") {
        // Handle it asynchronously to allow scripts the opportunity to delay ready
        setTimeout(callback);
    } else {

        // Use the handy event callback
        document.addEventListener("DOMContentLoaded", completed, false);

        // A fallback to window.onload, that will always work
        window.addEventListener("load", completed, false);
    }
}

docReady( function()
{
	get_state();
    $('targetdown').addEventListener("click", function() {
        $('target_temp').value = Number.parseInt($('target_temp').value) - 1;
        set_target();
    });
    $('targetup').addEventListener("click", function() {
        $('target_temp').value = Number.parseInt($('target_temp').value) + 1;
        set_target();
    });
    window.setInterval(get_state, 10000);
});

function set_target()
{
    var formFields = [
        "target_temp"
    ];
    var formData = new FormData();
    for ( var i = 0 ; i < formFields.length ; i ++ )
    {
        var elem = formFields[i];
        formData.append(elem, document.getElementById(elem).value);
    }
    fetch('/target', {
        method: 'post',
        body: formData
    }).then(function (response) {
        var data = response.json();
        console.log("target response:", data);
        return data;
    }).then(function (data)
        {
            for ( var key in data )
            {
                if ( data.hasOwnProperty(key) )
                {
                    var value = data[key];
                    console.log(key, value);
                    if ( $(key) )
                    {
                        if ( $(key).tagName == 'INPUT' )
                        {
                            $(key).value = value;
                        }
                        else
                        {
                            $(key).innerHTML = value;
                        }
                    }
                }
            }
        });
}

function $(inId)
{
	return document.getElementById(inId);
}

// from https://stackoverflow.com/a/11486026
function fancyTimeFormat(time)
{
    time = ~~(time);
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

function get_state()
{
	fetch('/state')
        .then(function (response) { return response.json(); })
        .then(function (data)
        {
            console.log("got state");
            for ( var key in data )
            {
                if ( data.hasOwnProperty(key) )
                {
                    var value = data[key];
                    console.log(key, value);
                    if ( $(key) )
                    {
                        if ( $(key).tagName == 'INPUT' )
                        {
                            $(key).value = value;
                        }
                        else if ( key == 'status' )
                        {
                            $(key).innerHTML = ( value ? 'On' : 'Off' );
                        }
                        else if ( key == 'uptime' )
                        {
                            $(key).innerHTML = fancyTimeFormat(value/1000);
                        }
                        else if ( key == 'since' )
                        {
                            $(key).innerHTML = fancyTimeFormat(value/1000);
                        }
                        else
                        {
                            $(key).innerHTML = value;
                        }
                    }
                }
            }
        });
}
