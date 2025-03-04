import ContinuousMacro from './ContinuousMacro';
import { MinimumDataType } from './MacroBase';

export default abstract class StaticMacro<
  TMessageData extends MinimumDataType,
> extends ContinuousMacro<TMessageData> {
  tick() {
    this.setupLights();
  }

  getCustomParams() {
    return {};
  }

  abstract setupLights(): void;
}
