import Broadcaster from './Broadcaster';
import {
  InputMessage,
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
import StaticPatternMacro from './macros/StaticPatternMacro';
import MovingShimmer from './macros/MovingShimmer';
import AnimatedPattern from './macros/AnimatedPattern';
import Pulse from './macros/Pulse';

export default class MessageHandler {
  #broadcaster: Broadcaster;
  #ledSystem: LEDSystem;
  #animator: Animator;
  #macroCoordinator: MacroCoordinator;

  constructor(broadcaster: Broadcaster, ledSystem: LEDSystem) {
    this.#broadcaster = broadcaster;
    this.#ledSystem = ledSystem;
    this.#animator = new Animator();

    this.#macroCoordinator = new MacroCoordinator(
      this.#animator,
      broadcaster,
      ledSystem,
    );

    broadcaster.macroCoordinator = this.#macroCoordinator;
  }

  async onMessage(data: string) {
    let message: InputMessage | null = null;

    try {
      const result = InputMessage.safeParse(JSON.parse(data));

      if (result.success) {
        message = result.data;
      } else {
        console.error('Error parsing the message');
        console.error(result.error);
      }
    } catch (e) {
      console.error(`Error parsing the message:`);
      console.error(e);
      console.error(data);
    }

    if (message == null) {
      return;
    }

    // const message = parseMessage(data);
    const macroParams = {
      ledSystem: this.#ledSystem,
      animator: this.#animator,
      macroCoordinator: this.#macroCoordinator,
    };

    switch (message.type) {
      /**
       * ===========================
       * MACROS START HERE
       * ===========================
       */
      case 'START_BASIC_CHASE':
        BasicChase.create(message, macroParams).start();
        break;
      case 'START_SHIMMER':
        ShimmerAnimation.create(message, macroParams).start();
        break;
      case 'START_RANDOM_SPARKLE':
        RandomSparkle.create(message, macroParams).start();
        break;
      case 'START_STATIC_PATTERN':
        StaticPatternMacro.create(message, macroParams).start();
        break;
      case 'START_MOVING_SHIMMER':
        MovingShimmer.create(message, macroParams).start();
        break;
      case 'START_ANIMATED_PATTERN':
        AnimatedPattern.create(message, macroParams).start();
        break;
      case 'START_PULSE_PATTERN':
        Pulse.create(message, macroParams).start();
        break;
      /**
       * ===========================
       */

      // Other Misc Commands
      case 'UPDATE_LIGHT_BY_ID':
        this.updateLightByID(message.data);
        break;
      case 'STOP_MACRO':
        this.#macroCoordinator.stopMacroByID(message.cueID);
        break;
      case 'FADE_OUT_MACRO':
        this.#macroCoordinator.fadeOutMacroByID(message.cueID);
        break;
      case 'STOP_ALL_MACROS':
        this.#macroCoordinator.stopAllMacros();
        break;
      case 'TURN_ALL_OFF':
        this.#macroCoordinator.stopAllMacros();
        this.#ledSystem.turnAllOff();
        this.#broadcaster.flushLightsWithDefaultAndBroadcast();
        break;
      case 'TURN_ALL_ON':
        this.#ledSystem.turnAllOn();
        this.#broadcaster.flushLightsWithDefaultAndBroadcast();
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
        this.#broadcaster.broadcastToWebClients();
        break;
      case 'UPDATE_QLAB_RECEIVER':
        if (message.data.isEnabled) {
          await this.#ledSystem.startQLabReceiver(this, this.#broadcaster);
        } else {
          this.#ledSystem.stopQLabReceiver();
        }
        this.#broadcaster.broadcastToWebClients();
        break;
      case 'UPDATE_ALL_LIGHTS':
        // TODO
        break;
      default:
        console.log(`Did not handle Message: ${message.type}`);
    }
  }

  updateLightByID({ id, color }: UpdateLightByID['data']): void {
    const light = Light.getLightByID(id);

    light.setColorString(color);

    this.#broadcaster.flushLightsWithDefaultAndBroadcast();
  }
}
