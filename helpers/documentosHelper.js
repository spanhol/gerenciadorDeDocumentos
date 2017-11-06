var documentosHelper = {}

documentosHelper.renderDocumentos = function (documentos, options) {
    var html = "";
    if (documentos) {
        for (var i = 0; i < documentos.length; i++) {
            var nome = documentos[i].nome;
            var tipo = documentos[i].tipo;
            var data = documentos[i].data;
            html += "<div class=\"card card-1\">\n"
                + "<a href=\"\\documentos\\" + documentos[i].id + "\\download\">"
                + nome
                + "</a>"
                + "<br>\n"
                // + tipo + "<br>\n"
                // + data + "<br>\n"
                + "<div class=\"card_keywords\">"
                + "<ul class=\"nav nav-pills pull-left\">"
            for (var j = 0; j < documentos[i].keywords.length; j++) {
                html += "<li role=\"presentation\">"
                    + "<a href=\"\\keyword\\" + documentos[i].keywords[j] + "\" >"
                    + documentos[i].keywords[j]
                    + "</a>";
                + "</li>";
            }

            html += "</ul>"
                + "</div>\n"
                + "</div>\n";
        }
    }
    return html;
};

module.exports = documentosHelper;
