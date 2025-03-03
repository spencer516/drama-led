import { scaleLinear, ScaleLinear } from 'd3-scale';
import Light from '../Light';
import ContinuousMacro from './ContinuousMacro';
import { StartPulse } from '@spencer516/drama-led-messages/src/macros/StartPulse';
import { interpolateRgb } from 'd3-interpolate';
import { clamp } from '../utils';
import { randomUniform } from 'd3-random';

type ActiveLightState = {
  finishTime: number;
  fadeAnimator: ScaleLinear<string, string>;
};

type CustomParams = {
  maxVisibleScale: ScaleLinear<number, number>;
  getRandomColor: () => string;
  inactiveLights: Set<Light>;
  activeLightStates: Map<Light, ActiveLightState>;
};

const randomZeroToOne = randomUniform(1);

export default class Pulse extends ContinuousMacro<
  StartPulse['data'],
  CustomParams
> {
  getCustomParams(): CustomParams {
    const lightsArray = this.lightsArray;
    const count = lightsArray.length;
    const density = this.data.density / 100;
    const maxVisibleLights = Math.floor(count * density);

    const [startColor, endColor] = this.data.colorRange;
    const colorInterpolator = interpolateRgb(startColor, endColor);

    const maxVisibleScale = scaleLinear()
      .domain([0, this.data.durationPerLight])
      .range([0, maxVisibleLights])
      .clamp(true);

    return {
      activeLightStates: new Map(),
      inactiveLights: new Set(lightsArray),
      getRandomColor: () => {
        return colorInterpolator(randomZeroToOne());
      },
      maxVisibleScale,
    };
  }

  getRandomLight(inactiveLights: Set<Light>): Light | null {
    const inactiveLength = inactiveLights.size;
    const randomIndex = Math.floor(Math.random() * inactiveLength);
    const lightIndex = clamp({
      value: randomIndex,
      min: 0,
      max: inactiveLength - 1,
    });

    const iterator = inactiveLights.values();

    let currentLight = null;

    for (let i = 0; i <= lightIndex; i++) {
      currentLight = iterator.next().value ?? null;
    }

    return currentLight;
  }

  createAnimatorForTime(
    currentTime: number,
    color: string,
  ): [number, ScaleLinear<string, string>] {
    const duration = this.data.durationPerLight;
    const finishTime = currentTime + duration;

    const fadeAnimator = scaleLinear<string>()
      .domain([currentTime, currentTime + duration / 2, finishTime])
      .range(['rgb(0,0,0)', color, 'rgb(0,0,0)'])
      .interpolate(interpolateRgb);

    return [finishTime, fadeAnimator];
  }

  tick(timeElapsed: number, params: CustomParams) {
    const {
      activeLightStates,
      maxVisibleScale,
      inactiveLights,
      getRandomColor,
    } = params;
    const maxVisibleLights = maxVisibleScale(timeElapsed);

    const [finishTime, fadeAnimator] = this.createAnimatorForTime(
      timeElapsed,
      getRandomColor(),
    );

    while (activeLightStates.size < maxVisibleLights) {
      const randomLight = this.getRandomLight(inactiveLights);

      if (randomLight != null) {
        inactiveLights.delete(randomLight);
        activeLightStates.set(randomLight, {
          fadeAnimator,
          finishTime,
        });
      }
    }

    for (const [light, state] of activeLightStates.entries()) {
      const { fadeAnimator, finishTime } = state;
      const color = fadeAnimator(timeElapsed);

      light.setColorString(color);

      if (finishTime < timeElapsed) {
        activeLightStates.delete(light);
        inactiveLights.add(light);
      }
    }
  }
}
