var env = 'development';
var path = require('path');

var config = {
    production: {
        uploadDir: '/files/gerenciadorDeArquivos/uploads',
        port: 80
    },
    development: {
        uploadDir: null,
        port: 80
    }
};
config.env = env;

config.getUploadDir = function (dirname) {
    if (env == 'development') {
        if (this.development.uploadDir) {
            uploadDir = this.development.uploadDir;
        }
        uploadDir = path.join(dirname, '/../uploads');
        console.log("development uploadDir " + uploadDir);
    }
    if (env == 'production') {
        if (this.production.uploadDir) {
            uploadDir = this.production.uploadDir;
        } else {
            uploadDir = path.join(dirname, '/../uploads');
        }
        console.log("production uploadDir " + uploadDir);
    }
    return uploadDir;
}

module.exports = config;

