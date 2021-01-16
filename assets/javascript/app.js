$(document).ready(function () {

    // //Acces the Unsplash API to add a random background if one hasn't already been chosen
    // function GetRandomBackground() {
    //     var app_id = 'c1acf11890702fbd5b32c55d04125b2c4f40e585e5fdb6a170daa377030b5e96'
    //     var url = 'https://api.unsplash.com/photos/random?client_id=' + app_id;
    //     $.ajax({
    //         url: url,
    //         dataType: 'json',
    //         success: function (json) {
    //             var src = json.urls.regular;
    //             $('#container').css('background-image', 'url(' + src + ')');
    //         }
    //     });
    // }
    // GetRandomBackground();



    var bgURL = "https://source.unsplash.com/collection/1047054";
    $('body').css({
        'background-image': 'url(' + bgURL + ')',
        'background-repeat': 'no-repeat',
        'background-size': 'cover'
    });


    $(".ppProgress").hide();
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCABpnha764rP7TzASFn4eFclnq_KzIR2c",
        authDomain: "startpage-299f3.firebaseapp.com",
        databaseURL: "https://startpage-299f3.firebaseio.com",
        projectId: "startpage-299f3",
        storageBucket: "startpage-299f3.appspot.com",
        messagingSenderId: "358219302181"
    };
    firebase.initializeApp(config);

    var uploader = document.getElementById('uploader');
    var fileButton = document.getElementById('fileButton');

    fileButton.addEventListener('change', function (event) {
        //create a storage ref
        var file = event.target.files[0];

        var storageRef = firebase.storage().ref('placeholder/' + file.name);

        //upload file
        var task = storageRef.put(file);

        task.on('state_changed',

            //progress bar
            function progress(snapshot) {
                var percentage = (snapshot.bytesTransferred /
                    snapshot.totalBytes) * 100;
                uploader.value = percentage;
                console.log(percentage);
                $(".ppProgress").show();

            },

            function error(err) {

            },

            function complete() {
                alert("Your file has been uploaded!");

                $(".ppProgress").hide();

                var storageRef = firebase.storage().ref("placeholder/" + file.name);
                storageRef.getDownloadURL().then(function (url) {
                    console.log(url);
                    $("#container").css("background-image", `url(${url})`);

                
                    localStorage.setItem("bgURL", url);
                    

                });
            }




        );


    });

 

    console.log("look at me" + localStorage.getItem("bgURL"));
    
    $("#container").css("background-image", `url(${localStorage.getItem("bgURL")})`);
    
    $("#removeTheme").on("click", function(){
        localStorage.removeItem("bgURL");
        location.reload(true);
    })
    

    // DISPLAYING AND HIDING SETTINGS BAR
    $("#settings").on("click", function () {

        if ($('#snackbar').hasClass('hiding')) {
            $("#snackbar").addClass('showing');
            $("#snackbar").removeClass('hiding');

        } else if ($('#snackbar').hasClass('showing')) {
            $("#snackbar").addClass('hiding')
            $('#snackbar').removeClass('showing');
        }

    })

    $("#close").on("click", function () {
        if ($('#snackbar').hasClass('showing')) {
            $("#snackbar").addClass('hiding')
            $('#snackbar').removeClass('showing');
        }
    });



    //DARK/LIGHT THEME SETTINGS
    $("#darkTheme").on("click", function () {
        console.log("dark");
        if ($('#clockColor').hasClass('lightClock')) {
            $("#clockColor").addClass('darkClock')
            $('#clockColor').removeClass('lightClock');
        }
        if ($('#weather-block').hasClass('lightClock')) {
            $("#weather-block").addClass('darkClock')
            $('#weather-block').removeClass('lightClock');
        }
        if ($('#myBtn').hasClass('lightClock')) {
            $("#myBtn").addClass('darkClock')
            $("#myBtn").attr("value", 'darkClock');
            $('#myBtn').removeClass('lightClock');
        }
        updateStorage()
    })

    

   function updateStorage() {
    var clockColor = $("#myBtn").attr("value");
    localStorage.setItem("clockColor", clockColor);
   }


    $("#lightTheme").on("click", function () {

        if ($('#clockColor').hasClass('darkClock')) {
            $("#clockColor").addClass('lightClock')
            $('#clockColor').removeClass('darkClock');
        }
        if ($('#weather-block').hasClass('darkClock')) {
            $("#weather-block").addClass('lightClock')
            $('#weather-block').removeClass('darkClock');
        }
        if ($('#myBtn').hasClass('darkClock')) {
            $("#myBtn").addClass('lightClock')
            $('#myBtn').removeClass('darkClock');
        }
        updateStorage();
    })

    
    var data = localStorage.getItem("clockColor");
    $("#myBtn").attr("value", data);
});


(function () {
    var linkOptions = {
        fetchLinks: function () {
            var links = new Array;
            var links_str = localStorage.getItem('link');
            if (links_str != null) {
                links = JSON.parse(links_str);
            }
            return links;
        },
        removeLink: function () {
            var id = this.getAttribute('id');
            var links = linkOptions.fetchLinks();
            links.splice(id, 1);
            localStorage.setItem('link', JSON.stringify(links));
            linkOptions.showLinks();
            return false;
        },
        showLinks: function () {
            var links = linkOptions.fetchLinks();
            var html = '<ul>';
            for (var i = 0; i < links.length; i++) {
                html += '<li><span class="link"><a href="' + links[i].url + '">' + links[i].label + '</a><button title="Remove" class="remove bookmarkRemove" id="' + i + '">✖</button></span></li>';
            };
            html += '</ul>';
            document.getElementById('links').innerHTML = html;
            var buttons = document.getElementsByClassName('remove');
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', linkOptions.removeLink);
            };
        },
        addLink: function () {
            var linkNew = document.getElementById('urlInput').value;
            var labelNew = document.getElementById('urlLabel').value;
            var newLink = {
                "url": linkNew,
                "label": labelNew
            };
            var links = linkOptions.fetchLinks();
            if (linkNew == "" || labelNew == "") {
                return false;
            } else {
                links.push(newLink);
                localStorage.setItem('link', JSON.stringify(links));
                linkOptions.showLinks();
                document.getElementById('urlInput').value = ""
                document.getElementById('urlLabel').value = ""
            }
        }
    };
    document.getElementById('addUrl').addEventListener('click', linkOptions.addLink);
    linkOptions.showLinks();
    var toggleMenu = {
        btnToggle: document.getElementById('btnToggle'),
        menu: document.getElementById('panel'),
        btnIcon: document.getElementById('icon'),
        btnClose: document.getElementsByClassName('remove'),
        btnClick: function () {
            toggleMenu.btnToggle.addEventListener('click', function () {
                toggleMenu.menu.classList.toggle('hide');
                toggleMenu.btnToggle.classList.toggle('active');
                for (i = 0; i < toggleMenu.btnClose.length; i++) {
                    if (toggleMenu.btnClose[i].style.display == "none") {
                        toggleMenu.btnClose[i].style.display = "block";
                        toggleMenu.btnIcon.style.opacity = "1";
                    } else {
                        toggleMenu.btnClose[i].style.display = "none";
                        toggleMenu.btnIcon.style.opacity = "0.7";
                    }
                };
            });
        },
        btnCloseVis: function () {
            for (i = 0; i < toggleMenu.btnClose.length; i++) {
                if (toggleMenu.btnClose[i].style.display = "block") {
                    toggleMenu.btnClose[i].style.display = "none";
                } else {
                    toggleMenu.btnClose[i].style.display = "block";
                }
            };
        }
    };
    toggleMenu.btnClick();
    document.onload = toggleMenu.btnCloseVis();
    var data = localStorage.getItem("clockColor");
    $("#clockColor").attr("value", data);
})();


var modal = document.getElementById('myModal');


var btn = document.getElementById("myBtn");


var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}