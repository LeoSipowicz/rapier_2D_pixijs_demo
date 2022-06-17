import { RawBroadPhase } from "../raw";
/**
 * The broad-phase used for coarse collision-detection.
 *
 * To avoid leaking WASM resources, this MUST be freed manually with `broadPhase.free()`
 * once you are done using it.
 */
export class BroadPhase {
    constructor(raw) {
        this.raw = raw || new RawBroadPhase();
    }
    /**
     * Release the WASM memory occupied by this broad-phase.
     */
    free() {
        this.raw.free();
        this.raw = undefined;
    }
}
//# sourceMappingURL=broad_phase.js.map