import MacroBase from './MacroBase';

export type MinimumDataType = {
  [key: string]: unknown;
};

type CustomParams = {
  [key: string]: unknown;
};

export default abstract class ContinuousMacro<
  TMessageData extends MinimumDataType,
  TCustomParams extends CustomParams = {},
> extends MacroBase<TMessageData> {
  cancelAnimation: (() => void) | null = null;

  startImpl() {
    if (this.cancelAnimation != null) {
      this.cancelAnimation();
    }

    const customParams = this.getCustomParams();

    this.cancelAnimation = this.animator.loop((timeElapsed) => {
      this.tick(timeElapsed, customParams);
    });
  }

  abstract getCustomParams(): TCustomParams;

  stopImpl() {
    this.cancelAnimation?.();
    this.cancelAnimation = null;
  }

  abstract tick(timeElapsed: number, customParams: TCustomParams): void;
}
