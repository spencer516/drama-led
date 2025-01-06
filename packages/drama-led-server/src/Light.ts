import { Address, Channel, ChannelValue, LightConfig, LightValue, makeChannelValue, Universe } from "@spencer516/drama-led-messages/src/AddressTypes";

export default class Light {
  #universe: Universe;

  #redChannel: Channel;
  #blueChannel: Channel;
  #greenChannel: Channel;

  #redValue: ChannelValue = makeChannelValue(0);
  #blueValue: ChannelValue = makeChannelValue(0);
  #greenValue: ChannelValue = makeChannelValue(0);

  constructor(
    universe: Universe,
    rgbChannels: [Channel, Channel, Channel],
  ) {
    this.#universe = universe;
    this.#redChannel = rgbChannels[0];
    this.#blueChannel = rgbChannels[1];
    this.#greenChannel = rgbChannels[2];
  }

  toAddresses(): [Address, Address, Address] {
    return [
      [this.#universe, this.#redChannel, this.#redValue],
      [this.#universe, this.#greenChannel, this.#greenValue],
      [this.#universe, this.#blueChannel, this.#blueValue],
    ]
  }

  toConfig(): LightConfig {
    return {
      universe: this.#universe,
      rgbChannels: [this.#redChannel, this.#greenChannel, this.#blueChannel],
      red: this.#redValue,
      green: this.#greenValue,
      blue: this.#blueValue,
    };
  }

  setValue([redValue, greenValue, blueValue]: LightValue): void {
    this.#redValue = redValue;
    this.#greenValue = greenValue;
    this.#blueValue = blueValue;
  }
}