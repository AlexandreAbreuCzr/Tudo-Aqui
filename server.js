const jsonServer = require('json-server')

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Middleware para liberar CORS (liberar acesso para qualquer origem)
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // permite qualquer origem acessar
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS') // métodos permitidos
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization') // headers permitidos
  next()
})

server.use(middlewares)
server.use('/api', router)

server.listen(process.env.PORT || 5000, () => {
  console.log('JSON Server is running')
})
