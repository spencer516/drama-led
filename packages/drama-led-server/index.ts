import { WebSocketServer } from 'ws';
import Broadcaster from './src/Broadcaster';
import MessageHandler from './src/MessageHandler';
import OctoController from './src/OctoController';
import LEDSystem, { SACN_NETWORK_INTERFACE } from './src/LEDSystem';
import LightMapping from './src/LightMapping';
import QLabReceiver from './src/QLabReceiver';
import GledoptoController from './src/GledoptoController';

function set<T>(items: T[]): Set<T> {
  return new Set(items);
}

async function startup() {
  const lightMapping = new LightMapping('FullSystemGeneratedV4-Gledopto.csv');

  await lightMapping.populateMap();

  const wss = new WebSocketServer({ port: 8080 });

  const CONTROLLER_SUPERCALI_1 = new OctoController({
    id: 'supercalifragilisticexpealidigital',
    ipAddress: '192.168.1.200',
    outputNumber: '1',
    startUniverse: 1000,
    sacnNetworkInterface: SACN_NETWORK_INTERFACE,
    lightMapping,
    isReversedDirection: false,
  });

  const CONTROLLER_SUPERCALI_2 = new OctoController({
    id: 'supercalifragilisticexpealidigital',
    ipAddress: '192.168.1.200',
    outputNumber: '2',
    startUniverse: 1100,
    sacnNetworkInterface: SACN_NETWORK_INTERFACE,
    lightMapping,
    isReversedDirection: false,
  });

  const CONTROLLER_BERTS_BRIGHTS_1 = new OctoController({
    id: 'berts_brights',
    ipAddress: '192.168.1.201',
    outputNumber: '1',
    startUniverse: 1200,
    sacnNetworkInterface: SACN_NETWORK_INTERFACE,
    lightMapping,
    isReversedDirection: false,
  });

  const CONTROLLER_BERTS_BRIGHTS_2 = new OctoController({
    id: 'berts_brights',
    ipAddress: '192.168.1.201',
    outputNumber: '2',
    startUniverse: 1300,
    sacnNetworkInterface: SACN_NETWORK_INTERFACE,
    lightMapping,
    isReversedDirection: false,
  });

  const CONTROLLER_SPOONFUL_1 = new OctoController({
    id: 'spoonful_of_circuit',
    ipAddress: '192.168.1.202',
    outputNumber: '1',
    startUniverse: 1400,
    sacnNetworkInterface: SACN_NETWORK_INTERFACE,
    lightMapping,
    isReversedDirection: true,
  });

  const CONTROLLER_SPOONFUL_2 = new OctoController({
    id: 'spoonful_of_circuit',
    ipAddress: '192.168.1.202',
    outputNumber: '2',
    startUniverse: 1500,
    sacnNetworkInterface: SACN_NETWORK_INTERFACE,
    lightMapping,
    isReversedDirection: true,
  });

  const GLED_CONTROLLER_1 = new GledoptoController({
    id: 'gledopto_1',
    host: 'gledopto-1-wireless.local',
    startUniverse: 1600,
    numberOfLights: 50,
    lightMapping
  });

  const qlab = new QLabReceiver({
    port: 53001,
  });

  const system = new LEDSystem(
    qlab,
    [
      CONTROLLER_SUPERCALI_1,
      CONTROLLER_SUPERCALI_2,
      CONTROLLER_BERTS_BRIGHTS_1,
      CONTROLLER_BERTS_BRIGHTS_2,
      CONTROLLER_SPOONFUL_1,
      CONTROLLER_SPOONFUL_2,
    ],
    [GLED_CONTROLLER_1],
    {
      FULL_ARCH_STAGE_LEFT: set([
        CONTROLLER_SUPERCALI_1,
        CONTROLLER_SUPERCALI_2,
      ]),
      FULL_ARCH_CENTER: set([
        CONTROLLER_BERTS_BRIGHTS_1,
        CONTROLLER_BERTS_BRIGHTS_2,
      ]),
      FULL_ARCH_STAGE_RIGHT: set([
        CONTROLLER_SPOONFUL_1,
        CONTROLLER_SPOONFUL_2,
      ]),
      INNER_ARCH_STAGE_LEFT: set([CONTROLLER_SUPERCALI_1]),
      INNER_ARCH_CENTER: set([CONTROLLER_BERTS_BRIGHTS_1]),
      INNER_ARCH_STAGE_RIGHT: set([CONTROLLER_SPOONFUL_1]),
      OUTER_ARCH_STAGE_LEFT: set([CONTROLLER_SUPERCALI_2]),
      OUTER_ARCH_CENTER: set([CONTROLLER_BERTS_BRIGHTS_2]),
      OUTER_ARCH_STAGE_RIGHT: set([CONTROLLER_SPOONFUL_2]),
      ALL_ARCHES_FULL: set([
        CONTROLLER_SUPERCALI_1,
        CONTROLLER_SUPERCALI_2,
        CONTROLLER_BERTS_BRIGHTS_1,
        CONTROLLER_BERTS_BRIGHTS_2,
        CONTROLLER_SPOONFUL_1,
        CONTROLLER_SPOONFUL_2,
      ]),
      ALL_ARCHES_OUTER: set([
        CONTROLLER_SUPERCALI_2,
        CONTROLLER_SPOONFUL_2,
        CONTROLLER_BERTS_BRIGHTS_2,
      ]),
      ALL_ARCHES_INNER: set([
        CONTROLLER_SUPERCALI_1,
        CONTROLLER_SPOONFUL_1,
        CONTROLLER_BERTS_BRIGHTS_1,
      ]),
      HOUSE: set([
        GLED_CONTROLLER_1
      ])
    },
  );

  const broadcaster = new Broadcaster(wss, system);

  const messageHandler = new MessageHandler(broadcaster, system);

  wss.on('connection', function connection(ws) {
    console.log('connected!');
    ws.on('close', function close() {
      console.log('disconnected');
    });
    ws.on('error', console.error);
    ws.on('message', function message(data) {
      messageHandler.onMessage(data.toString());
    });

    // Send the initial state on connect!
    broadcaster.broadcastToWebClients();
  });

  wss.on('listening', function listening() {
    console.log('listening on port 8080');
    // broadcaster.startBroadcastLoop(5000);
  });

  wss.on('error', function error(error) {
    console.error(error);
  });
}

startup();
