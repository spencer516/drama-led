'use client';

import { SendMessage } from "@/utils/useLEDServerWebSocket";
import { AllLights } from "@spencer516/drama-led-messages/src/OutputMessage";
import { Canvas, useThree } from '@react-three/fiber'
import { useEffect } from "react";
import { makeRGBValue } from "@spencer516/drama-led-messages/src/AddressTypes";

type Props = {
  message: AllLights,
  sendMessage: SendMessage
};

function Camera() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(150, 50, 400);
    camera.lookAt(150, 50, 0);
  }, [camera]);

  return <></>
}

export default function AllLightsSceneRenderer({ message, sendMessage }: Props) {
  const lights = message.data.lights;

  return <div className="w-full h-full bg-gray-500 text-white">
    <Canvas
      camera={{ position: [0, 0, 200] }}
    >
      <Camera />
      <ambientLight intensity={1} />
      <directionalLight position={[0, 0, 5]} color="white" />
      {lights.map(light => {
        const { id, red, green, blue, coordinates: { x, y } } = light;
        const rgbValues = [red.rgbValue, green.rgbValue, blue.rgbValue];
        const isOff = rgbValues.every(value => value === 0);
        const backgroundColor = `rgb(${rgbValues.join(',')})`;

        return <mesh key={id} position={[x, y, 0]} onClick={() => {
          sendMessage({
            type: 'UPDATE_LIGHT_BY_ID',
            data: {
              id,
              rgb: {
                red: makeRGBValue(isOff ? 255 : 0),
                green: makeRGBValue(isOff ? 255 : 0),
                blue: makeRGBValue(isOff ? 255 : 0),
              }
            }
          });
        }}>
          <circleGeometry args={[2, 10]} />
          <meshStandardMaterial color={backgroundColor} />
        </mesh>
      })}

    </Canvas>
  </div>
}