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

async function startup() {
  const lightMapping = new LightMapping('OctoDeskSetup.csv');

  await lightMapping.populateMap();

  const wss = new WebSocketServer({ port: 8080 });

  const system = new LEDSystem([
    new OctoController({
      id: 'supercalifragilisticexpealidigital',
      ipAddress: '192.168.1.200',
      outputNumber: '2',
      startUniverse: 1000,
      numberOfLights: 50,
      lightMapping
    })
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