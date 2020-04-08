/**
 * The target address of the MITM.
 */
export const TARGET_ADDRESS = process.env.TARGET_ADDRESS!

/**
 * The port where the MITM will listen in.
 */
export const MITM_PORT = process.env.MITM_PORT

/**
 * The key to pause a session.
 */
export const PAUSE_KEY = process.env.PAUSE_KEY || 'x'

/**
 * The key for resume a paused session.
 */
export const PLAY_KEY = process.env.PLAY_KEY || 'c'