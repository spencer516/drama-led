import { NamedLEDSection } from '@spencer516/drama-led-messages/src/NamedLEDSection';
import LEDSystem from '../LEDSystem';
import Animator from '../Animator';
import MacroCoordinator from './MacroCoordinator';
import { InputMessage } from '@spencer516/drama-led-messages/src/InputMessage';
import { MacroStatus } from '@spencer516/drama-led-messages/src/OutputMessage';

export type MinimumDataType = {
  [key: string]: unknown;
};

export type MessageShape<T extends MinimumDataType = {}> = {
  type: InputMessage['type'];
  cueID: string;
  segment: NamedLEDSection;
  data: T;
};

export type MacroParams = {
  ledSystem: LEDSystem;
  animator: Animator;
  macroCoordinator: MacroCoordinator;
};

export default class MacroBase<
  TMessageType extends MinimumDataType = MinimumDataType,
> {
  ledSystem: LEDSystem;
  animator: Animator;
  macroCoordinator: MacroCoordinator;
  message: MessageShape<TMessageType>;

  constructor(
    { ledSystem, animator, macroCoordinator }: MacroParams,
    message: MessageShape<TMessageType>,
  ) {
    this.ledSystem = ledSystem;
    this.animator = animator;
    this.macroCoordinator = macroCoordinator;
    this.message = message;
  }

  get data(): TMessageType {
    return this.message.data;
  }

  get segment() {
    return this.message.segment;
  }

  get cueID() {
    return this.message.cueID;
  }

  get type() {
    return this.message.type;
  }

  getMacroStatus(): MacroStatus {
    return {
      cueID: this.cueID,
      macroName: this.constructor.name,
    };
  }

  static create<TMessageType extends MinimumDataType>(
    this: new (
      params: MacroParams,
      message: MessageShape<TMessageType>,
    ) => MacroBase<TMessageType>,
    message: MessageShape<TMessageType>,
    params: MacroParams,
  ): MacroBase<TMessageType> {
    return new this(params, message);
  }

  *lightsIterator() {
    yield* this.ledSystem.iterateSegment(this.message.segment);
  }

  get lightsCount() {
    return Array.from(this.lightsIterator()).length;
  }

  start() {
    this.macroCoordinator.macroStarted(this);
    this.startImpl();
  }

  startImpl() {
    throw new Error('Not Implemented');
  }

  stop() {
    this.macroCoordinator.macroStopped(this);

    for (const [, light] of this.lightsIterator()) {
      light.turnOff();
    }

    this.stopImpl();
  }

  stopImpl() {
    throw new Error('Not Implemented');
  }
}
