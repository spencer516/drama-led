import { Address, Channel, LightValue, makeChannel, Universe } from "./AddressTypes";
import Light from "./Light";
import { invariant, range } from "./utils";

type LightStrandConfig = {
  universe: Universe,
  channelStart: Channel,
  numberOfLights: number,
};

export default class LightStrand {
  #lights: Light[];
  #universe: Universe;

  constructor(
    univsers: Universe,
    lights: Light[]
  ) {
    this.#lights = lights;
    this.#universe = univsers;
  }

  static create({
    universe,
    channelStart,
    numberOfLights,
  }: LightStrandConfig): LightStrand {
    const lights = range(0, numberOfLights).map(lightIndex => {
      const redChannel = lightIndex * 3 + channelStart;
      return new Light(universe, [
        makeChannel(redChannel),
        makeChannel(redChannel + 1),
        makeChannel(redChannel + 2),
      ]);
    });

    return new LightStrand(universe, lights);
  }

  toAddresses(): Address[] {
    return this.#lights.flatMap(light => light.toAddresses());
  }

  get lights(): Light[] {
    return this.#lights;
  }

  setLightValue(
    lightIndex: number,
    lightValue: LightValue,
  ): void {
    const light = this.#lights[lightIndex];

    invariant(light != null, `No light found at index ${lightIndex}`);

    light.setValue(lightValue);
  }
}