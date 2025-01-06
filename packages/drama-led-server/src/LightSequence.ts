import { Address, LightConfig, makeChannel, makeUniverse, Universe } from "@spencer516/drama-led-messages/src/AddressTypes";
import Light from "./Light";
import LightStrand from "./LightStrand";
import { range } from "./utils";

type LightSequenceConfig = {
  startUniverse: Universe,
  numberOfStrands: number,
};

// TODO: I should make a light sequence tie to a specific Octo Unit
// and increment the universe when the number of channels is exceeded.

export default class LightSequence {
  #lightStrands: LightStrand[];

  constructor(
    lightSrands: LightStrand[]
  ) {
    this.#lightStrands = lightSrands;
  }

  static create({
    startUniverse,
    numberOfStrands
  }: LightSequenceConfig): LightSequence {
    const strands = range(0, numberOfStrands).map(index =>
      LightStrand.create({
        universe: makeUniverse(startUniverse + index),
        channelStart: makeChannel(1),
        numberOfLights: 50,
      })
    )

    return new LightSequence(strands);
  }

  toAddresses(): Address[] {
    return this.#lightStrands.flatMap(strand => strand.toAddresses());
  }

  toLinearSequence(): Light[] {
    return this.#lightStrands.flatMap(strand => strand.lights);
  }

  toLightConfigs(): LightConfig[] {
    return this.toLinearSequence().map(light => light.toConfig());
  }
}