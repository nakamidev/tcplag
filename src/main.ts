import net, { Socket } from 'net'

import { MITM_PORT, TARGET_ADDRESS } from './environment'

import utils from './utils'

const server = net.createServer()
const logger = utils.createLogger()
const canRun = utils.environmentCheck()

if (!canRun) {
    logger.log('error', 'Insufficient environment variables provided.')
    logger.log('error', 'Please, checkout your `.env` file.')
    process.exit(1)
}

server.on('connection', (socket: Socket) => {
    logger.log('server', 'A new socket has connected to the TCP server.')

    const [targetAddress, targetPort] = utils.getTargetAddress(TARGET_ADDRESS)
    const targetServer = net.connect(targetPort, targetAddress, () => {
        logger.log('server', `Succesfully connected to ${targetAddress}:${targetPort}!`)
    })

    socket.on('data', (data: Buffer) => targetServer.write(data))
    targetServer.on('data', (data: Buffer) => socket.write(data))

    socket.on('error', (error: Error) => {
        utils.logErrorFromConnection('client', error, logger)
        utils.closeConnections(socket, targetServer)
    })

    targetServer.on('error', (error: Error) => {
        utils.logErrorFromConnection('client', error, logger)
        utils.closeConnections(socket, targetServer)
    })

    socket.on('end', () => utils.closeConnections(socket, targetServer))
    targetServer.on('end', () => utils.closeConnections(socket, targetServer))
})

server.listen(MITM_PORT, () => {
    logger.log('server', `The server is ready and listening at port ${MITM_PORT}.`)
})
