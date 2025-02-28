import Animator from '../Animator';
import Broadcaster from '../Broadcaster';
import AnimationMacroBase from './AnimationMacroBase';

export default class MacroCoordinator {
  #animator: Animator;
  #broadcaster: Broadcaster;
  #broadcastCallback: () => void;
  #activeMacros: Map<string, AnimationMacroBase> = new Map();

  constructor(animator: Animator, broadcaster: Broadcaster) {
    this.#animator = animator;
    this.#broadcaster = broadcaster;
    this.#broadcastCallback = () => {
      setImmediate(() => this.#broadcaster.broadcast());
    };
  }

  startMacro(macro: AnimationMacroBase) {
    const existingMacro = this.#activeMacros.get(macro.id);

    if (existingMacro != null) {
      existingMacro.stop();
    }

    this.#activeMacros.set(macro.id, macro);
    this.#animator.on('tick', this.#broadcastCallback);

    macro.start(() => this.macroStopped(macro));
  }

  macroStopped(macro: AnimationMacroBase) {
    this.#activeMacros.delete(macro.id);

    if (this.#activeMacros.size === 0) {
      this.#animator.off('tick', this.#broadcastCallback);
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
  }

  stopAllMacros() {
    for (const [, macro] of this.#activeMacros) {
      macro.stop();
    }
  }
}
