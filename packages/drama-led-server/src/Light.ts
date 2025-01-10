import { Address, LightConfig, LightCoordinates, LightID, UniverseChannel } from "@spencer516/drama-led-messages/src/AddressTypes";
import { color, HSLColor as d3HSLColor, rgb, RGBColor as d3RGBColor } from 'd3-color';
import { LightChannel } from "./LightChannel";
import { invariant } from "./utils";
import { RGBColor } from "@spencer516/drama-led-messages/src/InputMessage";

const LIGHT_STORE = new Map<LightID, Light>();

export default class Light {
  #id: LightID;
  #coordinates: LightCoordinates;
  #redChannel: LightChannel;
  #greenChannel: LightChannel;
  #blueChannel: LightChannel;

  constructor(
    id: LightID,
    coordinates: LightCoordinates,
    universeChannels: [UniverseChannel, UniverseChannel, UniverseChannel],
  ) {
    this.#coordinates = coordinates;
    this.#redChannel = new LightChannel(universeChannels[0]);
    this.#greenChannel = new LightChannel(universeChannels[1]);
    this.#blueChannel = new LightChannel(universeChannels[2]);
    this.#id = id;

    LIGHT_STORE.set(id, this);
  }

  get id() {
    return this.#id;
  }

  static getLightByID(id: LightID): Light {
    const light = LIGHT_STORE.get(id);

    invariant(light != null, `Could not find light with id ${id}`);

    return light;
  }

  toLightChannels(): [LightChannel, LightChannel, LightChannel] {
    return [this.#redChannel, this.#greenChannel, this.#blueChannel];
  }

  toAddresses(): [Address, Address, Address] {
    return [
      this.#redChannel.toAddress(),
      this.#greenChannel.toAddress(),
      this.#blueChannel.toAddress(),
    ];
  }

  toLightConfig(): LightConfig {
    return {
      id: this.#id,
      coordinates: this.#coordinates,
      red: this.#redChannel.toLightChannelConfig(),
      green: this.#greenChannel.toLightChannelConfig(),
      blue: this.#blueChannel.toLightChannelConfig(),
    };
  }

  setRGB(rgbColor: RGBColor) {
    this.#redChannel.setRGBValue(rgbColor.red);
    this.#greenChannel.setRGBValue(rgbColor.green);
    this.#blueChannel.setRGBValue(rgbColor.blue);
  }

  setColorString(colorString: string): void {
    const colorValue = color(colorString)?.rgb().clamp() ?? rgb(0, 0, 0);
    this.setColor(colorValue);
  }

  setColor(color: d3RGBColor | d3HSLColor | null): void {
    const rgbColor = color?.rgb().clamp() ?? rgb(0, 0, 0);
    this.#redChannel.setRGBValue(rgbColor.r, rgbColor.opacity);
    this.#greenChannel.setRGBValue(rgbColor.g, rgbColor.opacity);
    this.#blueChannel.setRGBValue(rgbColor.b, rgbColor.opacity);
  }

  turnOff() {
    this.setColorString('black');
  }

  turnOn() {
    this.setColorString('white');
  }
}