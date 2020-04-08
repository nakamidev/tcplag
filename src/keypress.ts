import readline, { Key } from 'readline'
import iohook from 'iohook'

/**
 * The handle keypress function.
 */
export type HandleKeypressFunction = (key: string, meta: Key) => any

/**
 * A stub keypress event.
 */
let keypress: HandleKeypressFunction = () => {}

/**
 * Destroys all keypress listeners.
 */
export function destroyKeypressListeners() {
    keypress = () => {}
    iohook.stop()
}

/**
 * Setups the keypress.
 */
export function setupKeypress(stdin: NodeJS.ReadStream) {
    stdin.setRawMode(true)
    readline.emitKeypressEvents(stdin)

    stdin.on('keypress', (key: string, meta: Key) => {
        if (meta.ctrl && key.toLowerCase()) {
            destroyKeypressListeners()
            return process.exit(0)
        }

        keypress(key, meta)
    })

    iohook.on('keydown', (event: any) => {
        const key = String.fromCharCode(event.rawcode)

        // compatibility layer
        keypress(key, {
            name: key,
            sequence: key,
            ctrl: event.ctrlKey,
            shift: event.shiftKey,
            meta: event.metaKey,
        })
    })

    iohook.start(false)
}

/**
 * Creates a keypress event.
 */
export function handleKeypress(handleKeypress: HandleKeypressFunction) {
    keypress = handleKeypress
}
