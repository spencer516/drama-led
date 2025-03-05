#!/bin/bash
{(
  cd packages/drama-led-server
  ./run-server.sh &
)} 2>&1 | tee /dev/tty &

{(
  cd packages/drama-led-ui
  ./run-ui.sh &
)} 2>&1 | tee /dev/tty &

wait