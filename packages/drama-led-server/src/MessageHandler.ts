import Broadcaster from './Broadcaster';
import {
  parseMessage,
  UpdateLightByID,
} from '@spencer516/drama-led-messages/src/InputMessage';
import Light from './Light';
import LEDSystem from './LEDSystem';
import Animator from './Animator';
import MacroCoordinator from './macros/MacroCoordinator';
import RandomSparkle from './macros/RandomSparkle';
import BasicChase from './macros/BasicChase';
import ShimmerAnimation from './macros/ShimmerAnimation';

export default class MessageHandler {
  #broadcaster: Broadcaster;
  #ledSystem: LEDSystem;
  #animator: Animator;
  #macroCoordinator: MacroCoordinator;

  constructor(broadcaster: Broadcaster, ledSystem: LEDSystem) {
    this.#broadcaster = broadcaster;
    this.#ledSystem = ledSystem;
    this.#animator = new Animator();

    this.#macroCoordinator = new MacroCoordinator(this.#animator, broadcaster);

    broadcaster.macroCoordinator = this.#macroCoordinator;
  }

  async onMessage(data: string) {
    const message = parseMessage(data);

    switch (message.type) {
      case 'UPDATE_LIGHT_BY_ID':
        this.updateLightByID(message.data);
        break;
      case 'START_BASIC_CHASE':
        const { id, segment, ...data } = message.data;
        const chase = new BasicChase(
          id,
          this.#animator,
          this.#ledSystem.getSegmentIterator(segment),
          data,
        );
        this.#macroCoordinator.startMacro(chase);
        break;
      case 'START_SHIMMER':
        const shimmer = ShimmerAnimation.create(
          this.#ledSystem,
          this.#animator,
          message,
        );
        this.#macroCoordinator.startMacro(shimmer);
        break;
      case 'START_RADIAL_CHASE':
        break;
      case 'START_RANDOM_SPARKLE':
        const sparkle = new RandomSparkle(
          'some-id',
          this.#animator,
          this.#ledSystem.getSegmentIterator(message.data.segment),
        );

        this.#macroCoordinator.startMacro(sparkle);
        break;
      case 'STOP_MACRO':
        this.#macroCoordinator.stopMacroByID(message.cueID);
        break;
      case 'STOP_ALL_MACROS':
        this.#macroCoordinator.stopAllMacros();
        break;
      case 'TURN_ALL_OFF':
        this.#macroCoordinator.stopAllMacros();
        this.#ledSystem.turnAllOff();
        this.#broadcaster.broadcast();
        break;
      case 'TURN_ALL_ON':
        this.#ledSystem.turnAllOn();
        this.#broadcaster.broadcast();
        break;
      case 'UPDATE_CONTROLLER':
        if (message.data.isSACNEnabled) {
          await this.#ledSystem.enableSacnOutput(
            message.data.id,
            this.#broadcaster,
          );
        } else {
          this.#ledSystem.disableSacnOutput(message.data.id);
        }
        this.#broadcaster.broadcast();
        break;
      case 'UPDATE_QLAB_RECEIVER':
        if (message.data.isEnabled) {
          await this.#ledSystem.startQLabReceiver(this, this.#broadcaster);
        } else {
          this.#ledSystem.stopQLabReceiver();
        }
        this.#broadcaster.broadcast();
        break;
      case 'UPDATE_ALL_LIGHTS':
        // TODO
        break;
    }
  }

  updateLightByID({ id, rgb }: UpdateLightByID['data']): void {
    const light = Light.getLightByID(id);

    light.setRGB(rgb);

    this.#broadcaster.broadcast();
  }
}
