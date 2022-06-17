import { RawCCDSolver } from "../raw";
/**
 * The CCD solver responsible for resolving Continuous Collision Detection.
 *
 * To avoid leaking WASM resources, this MUST be freed manually with `ccdSolver.free()`
 * once you are done using it.
 */
export class CCDSolver {
    constructor(raw) {
        this.raw = raw || new RawCCDSolver();
    }
    /**
     * Release the WASM memory occupied by this narrow-phase.
     */
    free() {
        this.raw.free();
        this.raw = undefined;
    }
}
//# sourceMappingURL=ccd_solver.js.map