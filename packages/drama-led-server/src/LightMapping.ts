import { LightCoordinates, LightID, makeLightID } from '@spencer516/drama-led-messages/src/AddressTypes';
import { z } from 'zod';
import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';

const CSVMapping = z.array(z.object({
  light_id: z.string(),
  x_coordinate: z.string(),
  y_coordinate: z.string(),
}));

export default class LightMapping {
  #filename: string;
  #map: Map<LightID, LightCoordinates> = new Map();
  #defaultCoordinates: LightCoordinates = LightCoordinates.parse({
    x: 0,
    y: 0
  });

  constructor(
    filename: string
  ) {
    this.#filename = filename;
  }

  async populateMap() {
    this.#map = new Map();
    const csvContent = await fs.readFile(`${__dirname}/../mapping/${this.#filename}`);
    const csv = CSVMapping.parse(parse(csvContent, {
      columns: true
    }));

    for (const { light_id, x_coordinate, y_coordinate } of csv) {
      const lightID = makeLightID(light_id);
      this.#map.set(lightID, LightCoordinates.parse({
        x: parseInt(x_coordinate, 10),
        y: parseInt(y_coordinate, 10)
      }));
    }
  }

  getLightCoordinates(id: LightID): LightCoordinates {
    return this.#map.get(id) ?? this.#defaultCoordinates;
  }
}