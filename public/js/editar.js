$('.upload-btn').on('click', function () {
    var keywords = $('#keywords-input').val();
    if (keywords) {
        keywords = keywords.trim();
    }
    if (keywords) {
        $('#upload-input').click();
    }
});

$('#upload-input').on('change', function () {
    var keywords = $('#keywords-input').val();

    if (keywords.length > 0) {
        // create a FormData object which will be sent as the data payload in the
        // AJAX request
        var formData = new FormData();
        formData.append('keywords', keywords);

        $.ajax({
            url: '/update',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log('atualizado\n' + data);
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