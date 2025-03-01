import { MacroStatus } from '@spencer516/drama-led-messages/src/OutputMessage';
import Animator from '../Animator';
import Broadcaster from '../Broadcaster';
import AnimationMacroBase from './AnimationMacroBase';

export default class MacroCoordinator {
  #animator: Animator;
  #broadcaster: Broadcaster;
  #broadcastCallback: (() => void) | null = null;
  #activeMacros: Map<string, AnimationMacroBase> = new Map();

  constructor(animator: Animator, broadcaster: Broadcaster) {
    this.#animator = animator;
    this.#broadcaster = broadcaster;
  }

  startMacro(macro: AnimationMacroBase) {
    const existingMacro = this.#activeMacros.get(macro.cueID);

    if (existingMacro != null) {
      existingMacro.stop();
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

    macro.start(() => this.macroStopped(macro));
  }

  macroStopped(macro: AnimationMacroBase) {
    this.#activeMacros.delete(macro.cueID);

    if (this.#activeMacros.size === 0 && this.#broadcastCallback != null) {
      this.#animator.off('tick', this.#broadcastCallback);
      this.#broadcastCallback = null;
    }
  }

  stopMacro(macro: AnimationMacroBase) {
    macro.stop();
  }

  stopMacroByID(id: string) {
    const macro = this.#activeMacros.get(id);

    if (macro != null) {
      this.stopMacro(macro);
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
      status.push({
        cueID: macro.cueID,
        macroName: macro.constructor.name,
      });
    }

    return status;
  }
}
