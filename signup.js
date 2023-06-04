
var lat, lon, defined = false;
var map, mapnik, markers, mar;
/*checks if password can be accepted when completing the form*/
function checkPassword(form) {
    val = true;
    firstpass = form.firstpass.value;
    secondpass = form.secondpass.value;
    email = form.email.value;
    getchoice = document.getElementById("university");
    ending = getchoice.options[getchoice.selectedIndex].text;
    ending = ending.toLowerCase() + ".gr";

    /*checks email and password validity*/
    if (firstpass != secondpass || isWeak(firstpass) || firstpass.includes("uoc") || firstpass.includes("helmepa") || firstpass.includes("tuc")) {
        window.scrollTo(0, 0);
        val = false;
    }
    if (!document.getElementById("rules").checked) {
        document.getElementById('termsmessage').innerHTML = "You have to agree before signing up";
        val = false;
    } else {
        document.getElementById('termsmessage').innerHTML = "";
    }
    usertype = document.getElementById("usertype")
    usertype = usertype.options[usertype.selectedIndex].text;
    student_type = document.getElementById("student_type");
    student_type = student_type.options[student_type.selectedIndex].text;
    /*checks date validity *IF* we the user is a student*/
    if (usertype == "Student") {
        id_valid_from = new Date(form.student_id_from_date.value);
        id_valid_until = new Date(form.student_id_to_date.value);
        daydifference = id_valid_until.getTime() - id_valid_from.getTime();
        daydifference = daydifference / (1000 * 3600 * 24);
        if (!email.endsWith(ending)) {
            window.scrollTo(0, 0);
            document.getElementById('emailmessage').innerHTML = "Email does not belong to the institution you chose";
            val = false;
        }else {
            document.getElementById('emailmessage').innerHTML = "";
        }
        if (id_valid_from > id_valid_until) {
            document.getElementById('Datemessage1').innerHTML = "ID start date cannot be later than the end date";
            val = false;
        }
        else if (student_type == "Undergraduate" && daydifference > 2191) {
            document.getElementById('Datemessage1').innerHTML = "The undergrad ID can't last more than 6 years";
            val = false;
        }
        else if (student_type == "Postgraduate" && daydifference > 731) {
            document.getElementById('Datemessage1').innerHTML = "The postgrad ID can't last more than 2 years";
            val = false;
        }
        else if (student_type == "Doctoral" && daydifference > 1826) {
            document.getElementById('Datemessage1').innerHTML = "The doc ID can't last more than 5 years";
            val = false;
        }
        else {
            document.getElementById('Datemessage1').innerHTML = "";
        }
    }
    return val;
}

/*makes password visible or invisible*/
function PassVisibility(pass) {
    var x = document.getElementById(pass);
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

/*Checks password strength and prints messages concerning the password*/
function Check() {
    var pass = document.getElementById('password');
    pass = pass.value;
    var status = "Medium"
    if (isWeak(pass)) {
        status = "Weak"
    }
    else if (isStrong(pass)) {
        status = "Strong"
    }
    else {
        status = "Medium"
    }
    if (pass.includes("uoc") || pass.includes("helmepa") || pass.includes("tuc")) {
        document.getElementById('message1').innerHTML = "Passwords can't include the words helmepa, uoc or tuc";
    }
    else if (pass.length != 0) document.getElementById('message1').innerHTML = status + " password";
    else document.getElementById('message1').innerHTML = ""
}

/*checks if the two passwords match*/
function PasswordMatch() {
    var pass = document.getElementById('password');
    pass = pass.value;
    var conpass = document.getElementById('confirmpassword');
    conpass = conpass.value;
    if (pass != conpass) {
        document.getElementById("message2").innerHTML = "Passwords don't match";
    }
    else {
        document.getElementById('message2').innerHTML = "";
    }
}

/*checks if the password is weak*/
function isWeak(pass) {
    var tmp = pass.replace(/[0-9]/g, ''); /*replace numbers from password*/
    if (pass.length != 0 && pass.length / 2 >= tmp.length) { /*more or equal numbers than letters -> weak password*/
        return true;
    }
    return false;
}

/*checks if the password is strong*/
function isStrong(pass) {
    var special_chars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    var count = 0;
    var lastoccurence = 0;
    if (pass.toLowerCase() != pass && pass.toUpperCase() != pass) {
        if (special_chars.test(pass)) {
            for (var i = 0; i < pass.length; i++) {
                if (special_chars.test(pass.charAt(i))) {
                    if (pass.charAt(i) != pass.charAt(lastoccurence)) {
                        count++;
                        lastoccurence = i;
                    }
                }
            }
            if (count >= 2) return true;
        }
    }
    return false;
}

/*checks if email is correct*/
function isValidEmail(email, ending) {
    return email.endsWith(ending);
}

/*removes/adds fields accordingly*/
function supervisor() {
    var student_type = document.getElementById("student_type");
    usertype = document.getElementById("usertype")
    usertype = usertype.options[usertype.selectedIndex].text;
    collection = document.getElementsByClassName("studentinfo"); 
    librarycollection = document.getElementsByClassName("libraryinfo");
    if (usertype == "Library supervisor") {
        for (var i = 0; i < collection.length; i++)
            collection[i].style.display = "none";
        for (var i = 0; i < librarycollection.length; i++)
            librarycollection[i].style.display = "inline-block";
        document.getElementById('address_change').innerHTML = "Library address";
        document.getElementById("libraryname").required = true;
        document.getElementById("libraryinformation").required = true;
        document.getElementById("student_id").required = false;
        document.getElementById("student_id_from_date").required = false;
        document.getElementById("student_id_to_date").required = false;
        document.getElementById("university").required = false;
        document.getElementById("department").required = false;
    }
    else {
        for (var i = 0; i < collection.length; i++)
            collection[i].style.display = "inline-block";
        for (var i = 0; i < librarycollection.length; i++)
            librarycollection[i].style.display = "none";
        document.getElementById('address_change').innerHTML = "Address";
        document.getElementById("libraryname").required = false;
        document.getElementById("libraryinformation").required = false;
        document.getElementById("student_id").required = true;
        document.getElementById("student_id_from_date").required = true;
        document.getElementById("student_id_to_date").required = true;
        document.getElementById("university").required = true;
        document.getElementById("department").required = true;
    }
}

function checkAddress() {

    const data = null;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        text = "";
        if (this.readyState === this.DONE) {
            if (this.responseText != "{}") {
                const obj = JSON.parse(xhr.responseText);
                text = obj[0].display_name;
                lat = obj[0].lat;
                lon = obj[0].lon;
                document.getElementById('addressmessage').innerHTML = "";
                if (text.includes("Crete")) {
                    document.getElementById('mapbutton').style.visibility = "visible";
                    if (!defined) {
                        map = new OpenLayers.Map("Map");
                        mapnik = new OpenLayers.Layer.OSM();
                        map.addLayer(mapnik);
                        markers = new OpenLayers.Layer.Markers("Markers");
                        map.addLayer(markers);
                        defined = true;
                    }
                }
                else {
                    document.getElementById('Map').style.display = "none";
                    document.getElementById('addressmessage').innerHTML = "This service is only available in Crete";
                    document.getElementById('mapbutton').style.visibility = "hidden";
                }

            }
            else {
                document.getElementById('addressmessage').innerHTML = "The address doesn't exist";
                document.getElementById('mapbutton').style.visibility = "hidden";
                document.getElementById('Map').style.display = "none";
            }
        }
        else document.getElementById('mapbutton').style.visibility = "hidden";
    });
    var addressName = document.getElementById("address").value;
    var city = document.getElementById("city").value;
    formcountry = document.getElementById("country");
    var country = formcountry.options[formcountry.selectedIndex].text;
    var address = addressName + " " + city + " " + "Greece";

    xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q="+address+"&accept-language=en&polygon_threshold=0.0");
    xhr.setRequestHeader("X-RapidAPI-Key", "0707ed6692msh2fad8b50d331625p1cc481jsnc9f5e90206ef");
    xhr.setRequestHeader("X-RapidAPI-Host", "forward-reverse-geocoding.p.rapidapi.com");
    xhr.send(data);
}

function openMap() {
    document.getElementById('Map').style.display = "inline-block";
    markers.removeMarker(mar);
    var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);
    mar = new OpenLayers.Marker(position);
    markers.addMarker(mar);

    //Orismos zoom	
    const zoom = 2;
    map.setCenter(position, zoom);
}

