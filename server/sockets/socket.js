const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketControl = new TicketControl();

io.on('connection', client => {

    console.log('Usuario conectado');

    client.emit('estadoActual', {
      actual: ticketControl.getUltimoTicket(),
      ultimos4: ticketControl.getUltimos4()
    })
     
    client.on('atenderTicket', (data, callback) => {
      if(!data.escritorio) {
        return callback({
          err: true,
          mensaje: 'El escritorio es necesario'
        })
      }
      const atenderTicket = ticketControl.atenderTicket(data.escritorio)

      callback(atenderTicket)

      // actualizar o notificar cambios en los ultimos 4
      client.broadcast.emit('ultimos4', {
        ultimos4: ticketControl.getUltimos4()
      })
    })
  
    client.on('siguienteTicket', (data, callback) => {
       console.log('Cual es el siguiente ticket')
       const siguiente = ticketControl.siguiente()
       console.log(siguiente)
       callback(siguiente)
    })

});