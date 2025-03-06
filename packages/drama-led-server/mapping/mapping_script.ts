import { parse } from 'ts-command-line-args';
import { promises as fs } from 'fs';

// Excalidraw Link: https://excalidraw.com/#json=a9Q76cp1RPUeVrFnGxhF0,7Xcl1kiNea7mJ_Dw_FPowQ

type OctoName =
  | 'supercalifragilisticexpealidigital'
  | 'berts_brights'
  | 'spoonful_of_circuit';

type Channel = 1 | 2;
type Coordinate = [number, number];

const SPACING = 1;

// @ts-expect-error - Import issue with TS config
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
  const csvContent = lights.map((light) => {
    return `${light.light_id},${light.x_coordinate},${light.y_coordinate}`;
  });

  const csvWithHeaders = ['light_id,x_coordinate,y_coordinate', ...csvContent];

  await fs.writeFile(`${DIRNAME}/${args.fileName}`, csvWithHeaders.join('\n'));
  console.log(`Wrote ${lights.length} lights to ${args.fileName}`);
}

writeToCSV(allLights);

type LightsForOpeningArgs = {
  octoName: OctoName;
  channel: Channel;
  startCoordinate: Coordinate;
  width: number;
  height: number;
  direction: 'right-to-left' | 'left-to-right';
  lightCounts: [number, number, number];
};

type Light = {
  light_id: string;
  x_coordinate: string;
  y_coordinate: string;
};

function generateAllLights(): Light[] {
  const spoonful1 = generateLightsForOpening({
    // INNER
    octoName: 'spoonful_of_circuit',
    channel: 1,
    startCoordinate: [21.5, 0],
    width: 43.5,
    height: 96,
    direction: 'right-to-left',
    lightCounts: [97, 45, 97],
  });

  const spoonful2 = generateLightsForOpening({
    // OUTER
    octoName: 'spoonful_of_circuit',
    channel: 2,
    startCoordinate: [0, 0],
    width: 86.5,
    height: 127,
    direction: 'right-to-left',
    lightCounts: [125, 84, 125],
  });

  const bertsBrights1 = generateLightsForOpening({
    // INNER
    octoName: 'berts_brights',
    channel: 1,
    startCoordinate: [148.75, 0],
    width: 58.5,
    height: 140,
    direction: 'left-to-right',
    lightCounts: [141, 61, 141],
  });

  const bertsBrights2 = generateLightsForOpening({
    // OUTER
    octoName: 'berts_brights',
    channel: 2,
    startCoordinate: [114.5, 0],
    width: 127,
    height: 180,
    direction: 'left-to-right',
    lightCounts: [179, 124, 179],
  });

  const supercali1 = generateLightsForOpening({
    // INNER
    octoName: 'supercalifragilisticexpealidigital',
    channel: 1,
    startCoordinate: [294, 0],
    width: 43.5,
    height: 96,
    direction: 'left-to-right',
    lightCounts: [97, 45, 96],
  });

  const supercali2 = generateLightsForOpening({
    // OUTER
    octoName: 'supercalifragilisticexpealidigital',
    channel: 2,
    startCoordinate: [272.5, 0],
    width: 86.5,
    height: 127,
    direction: 'left-to-right',
    lightCounts: [125, 84, 125],
  });

  // const gledopto = generateForGledopto(
  //   370,
  //   30,
  //   40
  // );

  return [
    ...spoonful1,
    ...spoonful2,
    ...bertsBrights1,
    ...bertsBrights2,
    ...supercali1,
    ...supercali2,
  ];
}

function fx(num: number): string {
  return num.toFixed(4);
}

function generateLightsForOpening({
  octoName,
  channel,
  startCoordinate,
  width,
  height,
  direction,
  lightCounts,
}: LightsForOpeningArgs): Light[] {
  let sequence = 1;
  let [xPos, yPos] = startCoordinate;

  const lights: Light[] = [];

  const [firstSegmentCount, secondSegmentCount, thirdSegmentCount] =
    lightCounts;

  const isLTR = direction === 'left-to-right';

  const firstSegmentXPos = isLTR ? xPos : xPos + width;
  const firstSegmentYPosStart = yPos;
  const firstSegmentSpacing = height / firstSegmentCount;

  for (let i = 0; i < firstSegmentCount; i++) {
    lights.push({
      light_id: `${octoName}:${channel}-${sequence}`,
      x_coordinate: fx(firstSegmentXPos),
      y_coordinate: fx(firstSegmentYPosStart + firstSegmentSpacing * i),
    });

    sequence++;
  }

  const secondSegmentXPosStart = isLTR ? xPos : xPos + width;
  const secondSegmentYPos = yPos + height;
  const secondSegmentSpacing = width / secondSegmentCount;

  for (let i = 0; i < secondSegmentCount; i++) {
    lights.push({
      light_id: `${octoName}:${channel}-${sequence}`,
      x_coordinate: fx(
        isLTR
          ? secondSegmentXPosStart + secondSegmentSpacing * i
          : secondSegmentXPosStart - secondSegmentSpacing * i,
      ),
      y_coordinate: fx(secondSegmentYPos),
    });

    sequence++;
  }

  const thirdSegmentXPos = isLTR ? xPos + width : xPos;
  const thirdSegmentYPostStart = yPos + height;
  const thirdSegmentSpacing = height / thirdSegmentCount;

  for (let i = 0; i < thirdSegmentCount; i++) {
    lights.push({
      light_id: `${octoName}:${channel}-${sequence}`,
      x_coordinate: fx(thirdSegmentXPos),
      y_coordinate: fx(thirdSegmentYPostStart - thirdSegmentSpacing * i),
    });

    sequence++;
  }

  return lights;
}

function generateForGledopto(
  xPosition: number,
  width: number,
  height: number
): Light[] {
  const lights: Light[] = [];

  for (let i = 0; i < 100; i++) {
    const xPos = Math.random() * width + xPosition;
    const yPos = Math.random() * height;
    lights.push({
      light_id: `gledopto-${i}`,
      x_coordinate: fx(xPos),
      y_coordinate: fx(yPos),
    });
  }

  return lights;
}