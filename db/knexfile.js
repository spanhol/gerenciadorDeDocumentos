module.exports = {
  development: {
    client: 'postgres',
    connection: {
      host : '127.0.0.1',
      port : '5433',
      user : 'docs',
      password : 'asdfzxcv',
      database : 'documentos'
    }
  },
  production: {
    client: 'postgres',
    connection: {
      host : '127.0.0.1',
      port : '5432',
      user : 'docs',
      password : 'asdfzxcv',
      database : 'documentos'
    }
  }
}
