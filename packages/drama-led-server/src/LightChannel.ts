import {
  Address,
  Channel,
  ChannelValue,
  LightChannelConfig,
  makeChannelValue,
  makeRGBValue,
  RGBValue,
  Universe,
  UniverseChannel,
} from '@spencer516/drama-led-messages';

function makeRGBValueFromChannelValue(value: ChannelValue): RGBValue {
  return makeRGBValue(Math.round((value / 100) * 255));
}

export class LightChannel {
  #universe: Universe;
  #channel: Channel;
  #value: ChannelValue = makeChannelValue(0);

  constructor([universe, channel]: UniverseChannel) {
    this.#universe = universe;
    this.#channel = channel;
  }

  set value(value: ChannelValue) {
    this.#value = value;
  }

  get value(): ChannelValue {
    return this.#value;
  }

  get isOn(): boolean {
    return this.#value > 0;
  }

  get channel(): Channel {
    return this.#channel;
  }

  get universe(): Universe {
    return this.#universe;
  }

  setRGBValue(value: number, opacity = 1) {
    this.#value = makeChannelValue(((100 * value) / 255) * opacity);
  }

  toAddress(): Address {
    return [this.#universe, this.#channel, this.#value];
  }

  toUniverseChannel(): UniverseChannel {
    return [this.#universe, this.#channel];
  }

  toLightChannelConfig(): LightChannelConfig {
    return {
      universe: this.#universe,
      channel: this.#channel,
      value: this.#value,
      rgbValue: makeRGBValueFromChannelValue(this.#value),
    };
  }
}
