import MacroBase, { MinimumDataType } from './MacroBase';

export default abstract class StaticMacro<
  TMessageData extends MinimumDataType,
> extends MacroBase<TMessageData> {
  startImpl() {
    this.setupLights();
  }

  stopImpl() {
    return;
  }

  abstract setupLights(): void;
}
