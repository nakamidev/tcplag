import { Ise, Transports } from 'ise'
import { Socket } from 'net'

import kleur from 'kleur'

const { ConsoleTransport, DEFAULT_COLORS } = Transports.Console

/**
 * @returns the parsed target address.
 */
function getTargetAddress(targetAddress: string): [string, number] {
    const [address, port] = targetAddress.split(':')
    return [address, parseInt(port)]
}

/**
 * Creates a logger.
 */
function createLogger() {
    const colors = {
        ...DEFAULT_COLORS,
        server: kleur.gray().yellow,
    }

    const logger = new Ise({
        transports: [new ConsoleTransport({ colors })],
    })

    return logger
}

/**
 * Logs a error from a connection side.
 */
function logErrorFromConnection(side: string, error: Error, logger: Ise) {
    logger.log('error', `The ${side} errored.`)
    logger.log('error', `Reason: ${error.message}`)
}

/**
 * Checks for the system requirements.
 */
function environmentCheck(): boolean {
    return !!(process.env.MITM_PORT && process.env.TARGET_ADDRESS)
}

/**
 * A function to close TCP connections.
 */
function closeConnections(...sockets: Socket[]) {
    sockets.map((socket) => socket.destroy())
}

export default {
    getTargetAddress,
    createLogger,
    environmentCheck,
    logErrorFromConnection,
    closeConnections,
}
