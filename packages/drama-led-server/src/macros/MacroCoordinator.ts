import { NamedLEDSection } from '@spencer516/drama-led-messages/src/NamedLEDSection';
import { MacroStatus } from '@spencer516/drama-led-messages/src/OutputMessage';
import Animator from '../Animator';
import Broadcaster from '../Broadcaster';
import MacroBase from './MacroBase';
import LEDSystem from '../LEDSystem';
import { DEFAULT_INTERPOLATOR, LightBlendInterpolator } from '../Light';
import FadeIn from '../transitions/FadeIn';

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

    const fadeInTransition = new FadeIn(this.#animator, {
      duration: macro.fadeInDuration,
    });

    macro.setTransition(fadeInTransition);

    this.#activeMacros.set(macro.cueID, macro);

    fadeInTransition.start(() => {
      if (existingSegmentMacro) {
        existingSegmentMacro.stop();
      }
    });

    if (this.#broadcastCallback == null) {
      this.#broadcastCallback = () => {
        this.#ledSystem.flushLightColors();
        this.#broadcaster.broadcast();
      };

      this.#animator.on('afterTick', this.#broadcastCallback);
    }

    // Let's at least broadcast one tick to start
    this.#ledSystem.flushLightColors();
    this.#broadcaster.broadcast();
  }

  macroStopped(macro: MacroBase) {
    this.#activeMacros.delete(macro.cueID);

    if (this.#activeMacros.size === 0 && this.#broadcastCallback != null) {
      this.#animator.off('afterTick', this.#broadcastCallback);
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
