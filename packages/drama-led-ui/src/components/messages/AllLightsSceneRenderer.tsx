"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { makeRGBValue } from "@spencer516/drama-led-messages/src/AddressTypes";
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

        {lights.map((light) => {
          const {
            id,
            red,
            green,
            blue,
            coordinates: { x, y },
          } = light;
          const rgbValues = [red.rgbValue, green.rgbValue, blue.rgbValue];
          const isOff = rgbValues.every((value) => value === 0);
          const backgroundColor = `rgb(${rgbValues.join(",")})`;

          return (
            <mesh
              key={id}
              position={[x, y, 0]}
              onClick={() => {
                sendMessage({
                  type: "UPDATE_LIGHT_BY_ID",
                  data: {
                    id,
                    rgb: {
                      red: makeRGBValue(isOff ? 255 : 0),
                      green: makeRGBValue(isOff ? 255 : 0),
                      blue: makeRGBValue(isOff ? 255 : 0),
                    },
                  },
                });
              }}
            >
              <circleGeometry args={[0.75, 10]} />
              <meshStandardMaterial color={backgroundColor} />
            </mesh>
          );
        })}

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
