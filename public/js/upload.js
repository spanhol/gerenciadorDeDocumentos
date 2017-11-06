$('.upload-btn').on('click', function () {
    var keywords = $('#keywords-input').val();
    if (keywords) {
        keywords = keywords.trim();
    }
    if (keywords) {
        $('#upload-input').click();
    }
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function () {
    var files = $(this).get(0).files;
    var keywords = $('#keywords-input').val();

    if (files.length > 0) {
        // create a FormData object which will be sent as the data payload in the
        // AJAX request
        var formData = new FormData();

        // loop through all the selected files and add them to the formData object
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            // add the files to formData object for the data payload
            formData.append('uploads[]', file, file.name);
        }
        formData.append('keywords', keywords);

        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log('upload successful!\n' + data);
            },
            xhr: function () {
                // create an XMLHttpRequest
                var xhr = new XMLHttpRequest();

                // listen to the 'progress' event
                xhr.upload.addEventListener('progress', function (evt) {

                    if (evt.lengthComputable) {
                        // calculate the percentage of upload completed
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);

                        // update the Bootstrap progress bar with the new percentage
                        $('.progress-bar').text(percentComplete + '%');
                        $('.progress-bar').width(percentComplete + '%');

                        // once the upload reaches 100%, set the progress bar text to done
                        if (percentComplete === 100) {
                            $('.progress-bar').html('Done');
                        }

                    }

                }, false);

                return xhr;
            }
        });

    }
});

function uptKeywordsDiv() {
    var keywords = $('#keywords-input').val();
    kw = keywords.split(";");
    var div = $('#keywords-div');
    div.empty();
    kw.forEach(function (e) {
        if (e && e != "") {
            var kbd = "\n<kbd class=\"keyword\">" + e + "</kbd>";
            div.append(kbd);
        }
    }, this);

}

$('#keywords-input').keyup('change', function () {
    uptKeywordsDiv();
    getSugestoes();
});

function showSugestoes(palavras) {
    var ul = $("#select_keywords");
    var keywords = $('#keywords-input').val();
    kw = keywords.split(";");
    ul.empty();
    palavras.forEach(function (e) {
        if (e && e != "") {
            if (kw[kw.length - 1] != e.word) {
                var u = "\n<li role=\"presentation\">"
                    + "<a onClick=\"autocompletar('" + e.word + "')\" href=\"#\" >"
                    + e.word
                    + "</a></li>";
                ul.append(u);
            }
        }
    }, this);
}

function autocompletar(word) {
    var keywords = $('#keywords-input').val();
    keywords = keywords.substring(0, keywords.lastIndexOf(";"));
    if (keywords.length > 0) {
        keywords += ";";
    }
    keywords += word + ";";
    $('#keywords-input').val(keywords);
    uptKeywordsDiv();
}


function getSugestoes() {
    var keywords = $('#keywords-input').val();
    kw = keywords.split(";");
    var div = $('#keywords-div');
    div.empty();
    kw.forEach(function (e) {
        if (e && e != "") {
            var kbd = "\n<kbd class=\"keyword\">" + e + "</kbd>";
            div.append(kbd);
        }
    }, this);

    // AJAX call for autocomplete 
    $.ajax({
        type: "POST",
        url: "/documentos/sugestoes",
        data: { keyword: keywords },
        success: function (data) {
            // console.log("\n\n--------busca");
            // console.log(data.result);
            showSugestoes(data.sugestoes);
        }
    });
}