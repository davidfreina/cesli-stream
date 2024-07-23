import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';
import AudioPlayer from 'react-h5-audio-player';
import VoipComponent from './VoipComponent';

const App = () => {
  return (
    <div>
      <h1>WebRTC VoIP Demo</h1>
      <VoipComponent></VoipComponent>
    </div>
  );
};

export default App;