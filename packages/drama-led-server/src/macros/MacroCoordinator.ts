import { NamedLEDSection } from '@spencer516/drama-led-messages/src/NamedLEDSection';
import { MacroStatus } from '@spencer516/drama-led-messages/src/OutputMessage';
import Animator from '../Animator';
import Broadcaster from '../Broadcaster';
import MacroBase from './MacroBase';

export default class MacroCoordinator {
  #animator: Animator;
  #broadcaster: Broadcaster;
  #broadcastCallback: (() => void) | null = null;
  #activeMacros: Map<string, MacroBase> = new Map();

  constructor(animator: Animator, broadcaster: Broadcaster) {
    this.#animator = animator;
    this.#broadcaster = broadcaster;
  }

  macroStarted(macro: MacroBase) {
    // If there is a macro with this cue number, cancel it.
    const existingMacro = this.#activeMacros.get(macro.cueID);

    if (existingMacro != null) {
      existingMacro.stop();
    }

    // If there is a macro with the same segment, cancel it
    const existingSegmentMacro = this.#findMacroInSegment(macro.segment);

    if (existingSegmentMacro) {
      existingSegmentMacro.stop();
    }

    this.#activeMacros.set(macro.cueID, macro);

    if (this.#broadcastCallback == null) {
      this.#broadcastCallback = () => {
        setImmediate(() => {
          this.#broadcaster.broadcast();
        });
      };

      this.#animator.on('tick', this.#broadcastCallback);
    }
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

    this.#broadcaster.broadcast();
  }

  stopAllMacros() {
    for (const [, macro] of this.#activeMacros) {
      macro.stop();
    }

    this.#broadcaster.broadcast();
  }

  toMacroStatus(): MacroStatus[] {
    const status = [];

    for (const macro of this.#activeMacros.values()) {
      status.push(macro.getMacroStatus());
    }

    return status;
  }

  #findMacroInSegment(segment: NamedLEDSection): MacroBase | null {
    for (const macro of this.#activeMacros.values()) {
      if (macro.segment === segment) {
        return macro;
      }
    }

    return null;
  }
}
