import {
  makeChannel,
  makeUniverse,
  Universe,
  UniverseChannel,
} from '@spencer516/drama-led-messages';
import { createSocket } from 'dgram';

export function range(start: number, length: number): number[] {
  return Array.from({ length }, (_, index) => index + start);
}

export function invariant(
  condition: unknown,
  message: string,
): asserts condition {
  if (condition) {
    return;
  }

  throw new Error(`Invariant failed: ${message}`);
}

const LIGHTS_PER_UNIVERSE = Math.floor(512 / 3);

export function getUniverseChannelMaker(
  startUniverse: Universe,
  sequenceNumber: number,
): (offset: number) => UniverseChannel {
  return (offset) => {
    const universeOffset = Math.floor(sequenceNumber / LIGHTS_PER_UNIVERSE);
    const universe = startUniverse + universeOffset;
    const sequenceInUniverse = sequenceNumber % LIGHTS_PER_UNIVERSE;

    const channel = sequenceInUniverse * 3 + offset + 1;
    return [makeUniverse(universe), makeChannel(channel)];
  };
}

export function checkSACNSocket(iface: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const socket = createSocket({ type: 'udp4', reuseAddr: true });
    socket.bind(5568, () => {
      try {
        socket.setMulticastInterface(iface);
        resolve(true);
      } catch (err) {
        reject(err);
      } finally {
        socket.close();
      }
    });
  });
}

export function clamp({
  value,
  min,
  max,
}: {
  value: number;
  min: number;
  max: number;
}): number {
  return Math.min(Math.max(min, value), max);
}
