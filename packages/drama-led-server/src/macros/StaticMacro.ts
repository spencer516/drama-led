import MacroBase, { MinimumDataType } from './MacroBase';

export default class StaticMacro<
  TMessageData extends MinimumDataType,
> extends MacroBase<TMessageData> {
  startImpl() {
    this.setupLights();
  }

  stopImpl() {
    return;
  }

  setupLights() {
    throw new Error('Not Implemented');
  }
}
