'use client';

// import { useState } from 'react';
import useLEDServerWebSocket from '@/utils/useLEDServerWebSocket';
// import { makeChannelValue } from '@spencer516/drama-led-messages/src/AddressTypes';
import LedStatus from './LedStatus';
import MessageRenderer from './MessageRenderer';

export default function LedServer() {
  const { sendMessage, lastMessage, readyState } = useLEDServerWebSocket();

  return <>
    <h1>LED Server</h1>
    <LedStatus readyState={readyState} />
    <MessageRenderer message={lastMessage} sendMessage={sendMessage} />
  </>
}