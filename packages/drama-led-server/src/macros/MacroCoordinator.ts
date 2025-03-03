import { NamedLEDSection } from '@spencer516/drama-led-messages/src/NamedLEDSection';
import { MacroStatus } from '@spencer516/drama-led-messages/src/OutputMessage';
import Animator from '../Animator';
import Broadcaster from '../Broadcaster';
import MacroBase from './MacroBase';
import LEDSystem from '../LEDSystem';
import { LightBlendInterpolator } from '../Light';

export default class MacroCoordinator {
  #animator: Animator;
  #broadcaster: Broadcaster;
  #broadcastCallback: (() => void) | null = null;
  #activeMacros: Map<string, MacroBase> = new Map();
  #ledSystem: LEDSystem;

  constructor(
    animator: Animator,
    broadcaster: Broadcaster,
    ledSystem: LEDSystem,
  ) {
    this.#animator = animator;
    this.#broadcaster = broadcaster;
    this.#ledSystem = ledSystem;
  }

  macroStarted(macro: MacroBase) {
    // If there is a macro with this cue number, cancel it.
    const existingMacro = this.#activeMacros.get(macro.cueID);

    if (existingMacro != null) {
      existingMacro.stop();
    }

    // If there is a macro with the same segment, cancel it
    const existingSegmentMacro = this.#findMacroOverlappingSegment(
      macro.segment,
    );

    if (existingSegmentMacro) {
      existingSegmentMacro.stop();
    }

    this.#activeMacros.set(macro.cueID, macro);

    const interpolator: LightBlendInterpolator = (queuedColors) => {
      return queuedColors.at(-1);
    };

    if (this.#broadcastCallback == null) {
      this.#broadcastCallback = () => {
        setImmediate(() => {
          this.#ledSystem.flushLightColors(interpolator);
          this.#broadcaster.broadcast();
        });
      };

      this.#animator.on('tick', this.#broadcastCallback);
    }

    // Let's at least broadcast one tick to start
    setImmediate(() => {
      this.#ledSystem.flushLightColors(interpolator);
      this.#broadcaster.broadcast();
    });
  }

  macroStopped(macro: MacroBase) {
    this.#activeMacros.delete(macro.cueID);

    if (this.#activeMacros.size === 0 && this.#broadcastCallback != null) {
      this.#animator.off('tick', this.#broadcastCallback);
      this.#broadcastCallback = null;
    }
  }

  stopMacroByID(id: string) {
    const macro = this.#activeMacros.get(id);

    if (macro != null) {
      macro.stop();
    }

    this.#broadcaster.flushLightsWithDefaultAndBroadcast();
  }

  stopAllMacros() {
    for (const [, macro] of this.#activeMacros) {
      macro.stop();
    }

    this.#broadcaster.flushLightsWithDefaultAndBroadcast();
  }

  toMacroStatus(): MacroStatus[] {
    const status = [];

    for (const macro of this.#activeMacros.values()) {
      status.push(macro.getMacroStatus());
    }

    return status;
  }

  #findMacroOverlappingSegment(segment: NamedLEDSection): MacroBase | null {
    // Find the controllers for the segment.
    for (const macro of this.#activeMacros.values()) {
      if (this.#ledSystem.doSegmentsOverlap(macro.segment, segment)) {
        return macro;
      }
    }

    return null;
  }
}
