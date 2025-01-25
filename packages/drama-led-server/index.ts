import { WebSocketServer } from 'ws';
import Broadcaster from './src/Broadcaster';
import MessageHandler from './src/MessageHandler';
import { parse } from 'ts-command-line-args'
import OctoController from './src/OctoController';
import LEDSystem from './src/LEDSystem';
import LightMapping from './src/LightMapping';

interface Args {
  enableSacn: boolean;
}

const args = parse<Args>({
  enableSacn: {
    type: Boolean,
    defaultValue: false,
  },
});

const SACN_NETWORK_INTERFACE = '192.168.1.199';

async function startup() {
  const lightMapping = new LightMapping('FullSystem.csv');

  await lightMapping.populateMap();

  const wss = new WebSocketServer({ port: 8080 });

  const CONTROLLER_SUPERCALI_2 = new OctoController({
    id: 'supercalifragilisticexpealidigital',
    ipAddress: '192.168.1.200',
    outputNumber: '2',
    startUniverse: 1100,
    numberOfLights: 250,
    sacnNetworkInterface: SACN_NETWORK_INTERFACE,
    lightMapping
  });
  
  const CONTROLLER_BERTS_BRIGHTS_2 = new OctoController({
    id: 'berts_brights',
    ipAddress: '192.168.1.201',
    outputNumber: '2',
    startUniverse: 1300,
    sacnNetworkInterface: SACN_NETWORK_INTERFACE,
    numberOfLights: 1,
    lightMapping
  });
  
  const CONTROLLER_SPOONFUL_2 = new OctoController({
    id: 'spoonful_of_circuit',
    ipAddress: '192.168.1.202',
    outputNumber: '2',
    startUniverse: 1500,
    sacnNetworkInterface: SACN_NETWORK_INTERFACE,
    numberOfLights: 1,
    lightMapping
  });

  const system = new LEDSystem([
    CONTROLLER_SUPERCALI_2,
    CONTROLLER_BERTS_BRIGHTS_2,
    CONTROLLER_SPOONFUL_2
  ]);

  if (args.enableSacn) {
    system.enableSacnOutput();
  }

  const broadcaster = new Broadcaster(wss, system);

  const messageHandler = new MessageHandler(
    wss,
    broadcaster,
    system
  );

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
    broadcaster.broadcast(ws);
  });

  wss.on('listening', function listening() {
    console.log('listening on port 8080');
    // broadcaster.startBroadcastLoop(5000);
  });

  wss.on('error', function error(error) {
    console.error(error);
  });

  process.on('exit', () => {
    broadcaster.cancelBroadcastLoop();
  });
}

startup();