import { parse } from 'ts-command-line-args';
import {promises as fs} from 'fs';

// Excalidraw Link: https://excalidraw.com/#json=a9Q76cp1RPUeVrFnGxhF0,7Xcl1kiNea7mJ_Dw_FPowQ

type OctoName = 'supercalifragilisticexpealidigital' | 'berts_brights' | 'spoonful_of_circuit';
type Channel = 1 | 2;
type Coordinate = [number, number];

const SPACING = 3;

// @ts-ignore
const DIRNAME = import.meta.dirname;

interface Args {
  fileName: string;
}

const args = parse<Args>({
  fileName: {
    type: String,
  },
});

const allLights = generateAllLights();

async function writeToCSV(lights: Light[]): Promise<void> {
  const csvContent = lights.map(light => {
    return `${light.light_id},${light.x_coordinate},${light.y_coordinate}`;
  });

  const csvWithHeaders = [
    'light_id,x_coordinate,y_coordinate',
    ...csvContent,
  ];

  await fs.writeFile(`${DIRNAME}/${args.fileName}`, csvWithHeaders.join('\n'));
  console.log(`Wrote ${lights.length} lights to ${args.fileName}`);
}

writeToCSV(allLights);


type LightsForOpeningArgs = {
  octoName: OctoName;
  channel: Channel;
  startCoordinate: Coordinate;
  spacing: number;
  width: number;
  height: number;
}

type Light = {
  light_id: string,
  x_coordinate: number,
  y_coordinate: number,
};

function generateAllLights(): Light[] {
  const supercali1 = generateLightsForOpening({
    octoName: 'supercalifragilisticexpealidigital',
    channel: 1,
    startCoordinate: [21.5, 0],
    spacing: SPACING,
    width: 43.5,
    height: 96
  });
  
  const supercali2 = generateLightsForOpening({
    octoName: 'supercalifragilisticexpealidigital',
    channel: 2,
    startCoordinate: [0, 0],
    spacing: SPACING,
    width: 86.5,
    height: 127
  });
  
  const bertsBrights1 = generateLightsForOpening({
    octoName: 'berts_brights',
    channel: 1,
    startCoordinate: [148.75, 0],
    spacing: SPACING,
    width: 58.5,
    height: 140
  });
  
  const bertsBrights2 = generateLightsForOpening({
    octoName: 'berts_brights',
    channel: 2,
    startCoordinate: [114.5, 0],
    spacing: SPACING,
    width: 127,
    height: 180
  });
  
  const spoonful1 = generateLightsForOpening({
    octoName: 'spoonful_of_circuit',
    channel: 1,
    startCoordinate: [294, 0],
    spacing: SPACING,
    width: 43.5,
    height: 96
  });
  
  const spoonful2 = generateLightsForOpening({
    octoName: 'spoonful_of_circuit',
    channel: 2,
    startCoordinate: [272.5, 0],
    spacing: SPACING,
    width: 86.5,
    height: 127
  });
  
  return [
    ...supercali1, 
    ...supercali2, 
    ...bertsBrights1, 
    ...bertsBrights2,
    ...spoonful1,
    ...spoonful2,
  ];
}

function generateLightsForOpening({
  octoName,
  channel,
  startCoordinate,
  spacing,
  width,
  height,
}: LightsForOpeningArgs): Light[] {
  let sequence = 1;
  let [xPos, yPos] = startCoordinate;

  const lights: Light[] = [];
  const maxHeight = height + yPos;
  const maxWidth = width + xPos;

  // Do left vertical first
  while (yPos < maxHeight) {
    lights.push({
      light_id: `${octoName}:${channel}-${sequence}`,
      x_coordinate: xPos,
      y_coordinate: yPos,
    });

    yPos += spacing;
    sequence++;
  }

  // Reset the yPos to be the max height
  yPos = maxHeight;

  // Then accross the top
  while (xPos < maxWidth) {
    lights.push({
      light_id: `${octoName}:${channel}-${sequence}`,
      x_coordinate: xPos,
      y_coordinate: yPos,
    });

    xPos += spacing;
    sequence++;
  }

  // Reset the xPos to be the max width
  xPos = maxWidth;

  // Then down the right side
  while (yPos > startCoordinate[1]) {
    lights.push({
      light_id: `${octoName}:${channel}-${sequence}`,
      x_coordinate: xPos,
      y_coordinate: yPos,
    });

    yPos -= spacing;
    sequence++;
  }

  return lights;
}