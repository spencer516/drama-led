import MacroBase from './MacroBase';

export type MinimumDataType = {
  maxFPS?: number;
  [key: string]: unknown;
};

type CustomParams = {
  [key: string]: unknown;
};

export default class ContinuousMacro<
  TMessageData extends MinimumDataType,
  TCustomParams extends CustomParams,
> extends MacroBase<TMessageData> {
  cancelAnimation: (() => void) | null = null;

  get maxFPS() {
    return this.data.maxFPS ?? 60;
  }

  startImpl() {
    if (this.cancelAnimation != null) {
      this.cancelAnimation();
    }

    const customParams = this.getCustomParams();

    this.cancelAnimation = this.animator.loop((timeElapsed, frameNumber) => {
      this.tick(timeElapsed, frameNumber, customParams);
    }, this.maxFPS);
  }

  getCustomParams(): TCustomParams {
    throw new Error('Not Implemented');
  }

  stopImpl() {
    this.cancelAnimation?.();
    this.cancelAnimation = null;
  }

  tick(
    _timeElapsed: number,
    _frameNumber: number,
    _customParams: TCustomParams,
  ) {
    throw new Error('Not Implemented');
  }
}
