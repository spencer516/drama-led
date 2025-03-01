"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  LightConfig,
  makeRGBValue,
} from "@spencer516/drama-led-messages/src/AddressTypes";
import * as THREE from "three";
import { useLatestMessage, useSendMessage } from "@/utils/LEDServerContext";

type Props = {};

function Camera() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(175, 75, 200);
    camera.lookAt(175, 75, 0);
  }, [camera]);

  return <></>;
}

export default function AllLightsSceneRenderer({}: Props) {
  const sendMessage = useSendMessage();
  const message = useLatestMessage();
  const lights = message.lights;

  return (
    <div className="w-full h-full bg-gray-500 text-white">
      <Canvas camera={{ position: [0, 0, 200] }}>
        <Camera />
        <ambientLight intensity={1} />
        <directionalLight
          position={[0, 0, 5]}
          color="white"
        />

        <Lights lights={lights} />

        <Panel
          x={-0.5}
          y={0}
          outerWidth={86.5}
          outerHeight={127}
          innerHeight={96}
          innerWidth={43.5}
          color="rgb(30,30,30)"
        />

        <Panel
          x={57}
          y={0}
          outerWidth={127}
          outerHeight={180}
          innerHeight={140}
          innerWidth={58.5}
          color="rgb(30,30,30)"
        />

        <Panel
          x={136}
          y={0}
          outerWidth={88}
          outerHeight={127}
          innerHeight={96}
          innerWidth={43}
          color="rgb(30,30,30)"
        />
      </Canvas>
    </div>
  );
}

type LightsProps = {
  lights: LightConfig[];
};

// const circle = new THREE.CircleGeometry(0.75, 5);
const circle = new THREE.BoxGeometry(1, 1, 0);
const material = new THREE.MeshBasicMaterial({ vertexColors: true });

function Lights({ lights }: LightsProps) {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const numLights = lights.length;

  const colorsArray = useMemo(() => {
    const colorData = new Float32Array(lights.length * 3);

    for (let i = 0; i < lights.length; i++) {
      const light = lights[i];
      colorData[i * 3] = light.red.rgbValue;
      colorData[i * 3] = light.green.rgbValue;
      colorData[i * 3] = light.blue.rgbValue;
    }

    return colorData;
  }, [lights]);

  useFrame(() => {
    const mesh = meshRef.current;

    if (mesh == null) {
      return;
    }

    for (const [index, light] of iter(lights)) {
      const {
        coordinates: { x, y },
        red,
        green,
        blue,
      } = light;

      const position = new THREE.Vector3(x, y, 0);
      const matrix = new THREE.Matrix4();
      const color = new THREE.Color(
        red.rgbValue / 256,
        green.rgbValue / 256,
        blue.rgbValue / 256,
      );

      matrix.setPosition(position);
      mesh.setMatrixAt(index, matrix);
      mesh.setColorAt(index, color);
    }
    mesh.instanceMatrix.needsUpdate = true;

    if (mesh.instanceColor != null) {
      mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[circle, material, numLights]}
    >
      {/* @ts-ignore */}
      <meshBasicMaterial vertexColors={THREE.VertexColors} />
    </instancedMesh>
  );
}

function* iter<T>(list: T[]): Iterable<[number, T]> {
  let index = 0;

  for (const item of list) {
    yield [++index, item];
  }
}

type RectProps = {
  x: number;
  y: number;
  outerWidth: number;
  outerHeight: number;
  innerWidth: number;
  innerHeight: number;
  color: string;
};

function Panel({
  x,
  y,
  outerWidth,
  outerHeight,
  innerHeight,
  innerWidth,
  color,
}: RectProps) {
  const mesh = useMemo(() => {
    const outerShape = new THREE.Shape();

    outerShape.moveTo(x, y);
    outerShape.lineTo(x, y + outerHeight);
    outerShape.lineTo(x + outerWidth, y + outerHeight);
    outerShape.lineTo(x + outerWidth, y);
    outerShape.lineTo(x, y);

    const innerShape = new THREE.Shape();

    const innerXStart = x + (outerWidth - innerWidth) / 2;

    innerShape.moveTo(innerXStart, y);
    innerShape.lineTo(innerXStart, y + innerHeight);
    innerShape.lineTo(innerXStart + innerWidth, y + innerHeight);
    innerShape.lineTo(innerXStart + innerWidth, y);
    innerShape.lineTo(innerXStart, y);

    outerShape.holes.push(innerShape);

    return outerShape;
  }, [x, y, outerHeight, outerWidth, innerWidth, innerHeight]);

  return (
    <mesh position={[x, y, -1]}>
      <shapeGeometry args={[mesh]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
