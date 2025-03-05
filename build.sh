#!/bin/bash
git pull
yarn install

(
  cd packages/drama-led-messages
  yarn run compile
)

(
  cd packages/drama-led-server
  yarn run compile
)

(
  cd packages/drama-led-ui
  yarn run build
)