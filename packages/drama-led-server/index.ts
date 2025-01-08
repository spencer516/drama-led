import { WebSocketServer } from 'ws';
import LightSequence from './src/LightSequence';
import Broadcaster from './src/Broadcaster';
import MessageHandler from './src/MessageHandler';
import { makeUniverse } from '@spencer516/drama-led-messages/src/AddressTypes';
import { Sender } from 'sacn';
import { parse } from 'ts-command-line-args'

interface Args {
  enableSacn: boolean;
}

const args = parse<Args>({
  enableSacn: {
    type: Boolean,
    defaultValue: false,
  },
});

const wss = new WebSocketServer({ port: 8080 });

const sacnSender = args.enableSacn ? new Sender({
  universe: 1000,
  iface: '192.168.0.1',
}) : null;

const lightSequence = LightSequence.create({
  startUniverse: makeUniverse(1000),
  numberOfStrands: 1,
});

const broadcaster = new Broadcaster(wss, lightSequence, sacnSender);

const messageHandler = new MessageHandler(
  wss,
  broadcaster,
  lightSequence
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
  broadcaster.broadcastClient(ws);
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