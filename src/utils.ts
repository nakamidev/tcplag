import { Ise, Transports } from 'ise'
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
 * Checks for the system requirements.
 */
function environmentCheck(): boolean {
    return !!(process.env.MITM_PORT && process.env.TARGET_ADDRESS)
}

export default {
    getTargetAddress,
    createLogger,
    environmentCheck,
}
