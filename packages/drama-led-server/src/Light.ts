import { Address, Channel, ChannelValue, LightConfig, LightValue, makeChannelValue, Universe } from "@spencer516/drama-led-messages/src/AddressTypes";
import { color, HSLColor, rgb, RGBColor } from 'd3-color';

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
    this.#greenChannel = rgbChannels[1];
    this.#blueChannel = rgbChannels[2];
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

  setColorString(colorString: string): void {
    const colorValue = color(colorString)?.rgb().clamp() ?? rgb(0, 0, 0);
    this.setColor(colorValue);
  }

  setColor(color: RGBColor | HSLColor | null): void {
    const rgbColor = color?.rgb().clamp() ?? rgb(0, 0, 0);
    this.setValue([
      makeChannelValue(100 * rgbColor.r / 255 * rgbColor.opacity),
      makeChannelValue(100 * rgbColor.g / 255 * rgbColor.opacity),
      makeChannelValue(100 * rgbColor.b / 255 * rgbColor.opacity),
    ]);
  }

  turnOff() {
    this.setValue([makeChannelValue(0), makeChannelValue(0), makeChannelValue(0)]);
  }

  turnOn() {
    this.setValue([makeChannelValue(100), makeChannelValue(100), makeChannelValue(100)]);
  }
}