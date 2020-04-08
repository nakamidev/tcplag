import net, { Socket } from 'net'
import { Key } from 'readline'

import { MITM_PORT, TARGET_ADDRESS, PAUSE_KEY, PLAY_KEY } from './environment'

import { setupKeypress, handleKeypress, destroyKeypressListeners } from './keypress'
import utils from './utils'

const server = net.createServer()
const logger = utils.createLogger()
const canRun = utils.environmentCheck()

if (!canRun) {
    logger.log('error', 'Insufficient environment variables provided.')
    logger.log('error', 'Please, checkout your `.env` file.')
    process.exit(1)
}

setupKeypress(process.stdin)

let sessionLocked = false

function createErrorListener(side: string, ...connections: Socket[]) {
    return (error: Error) => {
        utils.logErrorFromConnection(side, error, logger)
        utils.closeConnections(...connections)
        sessionLocked = false
    }
}

function createCloseListener(...connections: Socket[]) {
    return () => {
        utils.closeConnections(...connections)
        sessionLocked = false
    }
}

server.on('connection', (socket: Socket) => {
    let isLagged = false
    let packetQueue: Buffer[] = []

    if (sessionLocked) {
        logger.log('warn', 'The session is locked, close the current connection first.')
        utils.closeConnections(socket)
        return
    }

    logger.log('server', 'A new socket has connected to the TCP server.')

    const [targetAddress, targetPort] = utils.getTargetAddress(TARGET_ADDRESS)
    const targetServer = net.connect(targetPort, targetAddress, () => {
        logger.log('server', `Succesfully connected to ${targetAddress}:${targetPort}!`)

        logger.log('info', 'The session has locked.')
        sessionLocked = true

        socket.on('data', (data: Buffer) => {
            if (!isLagged) {
                targetServer.write(data)
            } else {
                packetQueue.push(data)
            }
        })

        targetServer.on('data', (data: Buffer) => {
            if (!isLagged) socket.write(data)
        })

        socket.on('error', createErrorListener('client', socket, targetServer))
        targetServer.on('error', createErrorListener('server', socket, targetServer))

        socket.on('end', createCloseListener(socket, targetServer))
        targetServer.on('end', createCloseListener(socket, targetServer))
    })

    /**
     * Toggles the state of the lag.
     */
    function toggleLag(state: boolean) {
        isLagged = state
        logger.log('warn', `The lag has been ${isLagged ? 'enabled' : 'disabled'}.`)

        if (!state) {
            packetQueue.map((packet: Buffer) => targetServer.write(packet))
            packetQueue = []
        }
    }

    handleKeypress((key: string) => {
        if (key.toLowerCase() === PAUSE_KEY.toLowerCase()) toggleLag(true) // stop
        if (key.toLowerCase() === PLAY_KEY.toLowerCase()) toggleLag(false) // continue
    })
})

server.listen(MITM_PORT, () => {
    logger.log('server', `The server is ready and listening at port ${MITM_PORT}.`)
})
