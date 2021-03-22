var pagina = 0;
var documentosPorPagina = 15;
var pageCount = 0;
var query;

function getDocumentos() {
    var keywords = $('#search-input').val();
    if (keywords == ""){
        return;
    }
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
        url: "/documentos/filtro",
        data: { keyword: keywords, pagina: pagina, documentosPorPagina: documentosPorPagina },
        // beforeSend: function(){
        // 	$("#search-box").css("background","#FFF url(LoaderIcon.gif) no-repeat 165px");
        // },
        success: function (data) {
            // console.log("\n\n--------busca");
            // console.log(data.result);
            showSugestoes(data.sugestoes);
            query = data.result;
            showDocumentos();
        }
    });
}

$('#search-input').keyup('change', function () {
    pagina = 0;
    pageCount = 0;
    getDocumentos();
});

function showSugestoes(palavras) {
    var ul = $("#select_keywords");
    var keywords = $('#search-input').val();
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
    var keywords = $('#search-input').val();
    keywords = keywords.substring(0, keywords.lastIndexOf(";"));
    if (keywords.length > 0) {
        keywords += ";";
    }
    keywords += word + ";";
    $('#search-input').val(keywords);
    getDocumentos();
}

function showDocumentos() {
    var div = $("#documentos");
    div.empty();
    if (query && query.rows) {
        pageCount = Math.ceil(query.rows.length / documentosPorPagina);
        var ini = pagina * documentosPorPagina;
        var fim = ini + documentosPorPagina;
        if (fim > query.rows.length) {
            fim = query.rows.length;
        }
        for (var i = ini; i < fim; i++) {
            var nome = query.rows[i].nome;
            var tipo = query.rows[i].tipo;
            var data = query.rows[i].data;
            var id = query.rows[i].id;
            var kw = query.rows[i].keywords;
            var doc = "<div class=\"card card-1\">\n"
                + "<a style=\"color: #fff\" class=\"btn btn-primary botao-editar\" href=\"\\documento\\" + id + "\">"
                + "EDITAR"
                + "</a>"
                + "<a href=\"\\documento\\" + id + "\\download\">"
                + nome
                + "</a>"
                + "<br>\n"
                // + tipo + "<br>\n"
                // + data + "<br>\n"
                + "<div class=\"card_keywords\">"
                + "<ul class=\"nav nav-pills pull-left\">"
            for (var j = 0; j < kw.length; j++) {
                doc += "<li role=\"presentation\">"
                    + "<a href=\"\\keyword\\" + kw[j] + "\" >"
                    + kw[j]
                    + "</a>";
                + "</li>";
            }
            doc += "</ul>"
                + "</div>\n"
                + "</div>\n";

            div.append(doc);
        }
        showPaginacao();
    } else {
        pageCount = 0;
        pagina = 0;
    }
}

function showPaginacao() {
    var div = $("#paginacao");
    div.empty();
    if (pageCount > 0) {
        var pag = "<ul class=\"pagination\">";
        if (pagina > 0) {
            pag += "<li><a onClick=\"getPagina(" + (pagina - 1) + ")\" href=\"javascript:void(0)\">«</a></li>";
        } else {
            pag += "<li><a class=\"disabled\" href=\"javascript:void(0)\">«</a></li>";
        }
        for (var i = 0; i < pageCount; i++) {
            if (i != pagina) {
                pag += "<li><a \"class=\"\" onClick=\"getPagina(" + i + ")\" href=\"#\">" + (i + 1) + "</a></li>";
            } else {
                pag += "<li><a class=\"pg-red\" href=\"javascript:void(0)\">" + (i + 1) + "</a></li>";
            }
        }
        if (pagina + 1 < pageCount) {
            pag += " <li><a onClick=\"getPagina(" + (pagina + 1) + ")\" href=\"javascript:void(0)\">»</a></li>";
        } else {
            pag += " <li><a class=\"disabled\" href=\"javascript:void(0)\">»</a></li>";
        }
        pag += "</ul>";
        div.append(pag);
    }
}

function getPagina(p) {
    pagina = p;
    showDocumentos();
}

