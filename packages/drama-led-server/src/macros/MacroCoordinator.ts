import { NamedLEDSection } from '@spencer516/drama-led-messages';
import { MacroStatus } from '@spencer516/drama-led-messages';
import Animator from '../Animator';
import Broadcaster from '../Broadcaster';
import MacroBase from './MacroBase';
import LEDSystem from '../LEDSystem';
import FadeIn from '../transitions/FadeIn';
import FadeOut from '../transitions/FadeOut';

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
    const existingSegmentMacros = this.#findMacroOverlappingSegmens(
      macro.segment,
    );

    const fadeInTransition =
      macro.fadeInDuration > 0
        ? new FadeIn(this.#animator, {
            duration: macro.fadeInDuration,
          })
        : null;

    if (fadeInTransition != null) {
      macro.setTransition(fadeInTransition);

      fadeInTransition.start(() => {
        for (const macro of existingSegmentMacros) {
          macro.stop();
        }
      });
    } else {
      for (const macro of existingSegmentMacros) {
        macro.stop();
      }
    }

    this.#activeMacros.set(macro.cueID, macro);

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
      this.#ledSystem.flushLightColors();
      this.#broadcaster.broadcast();
    }
  }

  fadeOutMacroByID(id: string) {
    const macro = this.#activeMacros.get(id);

    if (macro == null) {
      return;
    }

    const fadeOut = new FadeOut(this.#animator, {
      duration: macro.fadeOutDuration,
    });

    macro.setTransition(fadeOut);

    fadeOut.start(() => {
      macro.stop();
      this.#broadcaster.flushLightsWithDefaultAndBroadcast();
    });
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

  #findMacroOverlappingSegmens(segment: NamedLEDSection): MacroBase[] {
    // Find the controllers for the segment.
    const overlapping = [];

    for (const macro of this.#activeMacros.values()) {
      if (this.#ledSystem.doSegmentsOverlap(macro.segment, segment)) {
        overlapping.push(macro);
      }
    }

    return overlapping;
  }
}
