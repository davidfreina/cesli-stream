import React, { useState, useEffect } from 'react';
import SimplePeer from 'simple-peer';
import AudioPlayer from 'react-h5-audio-player';

const VoipComponent = () => {
  const [peer, setPeer] = useState(null);

  useEffect(() => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          { urls: 'stun:46.38.233.72:3478' }, 
          { urls: 'turn:46.38.233.72:3478', username: 'patrickzangerl', credential: 'Hcz8MHFiaCeUjgabNoEhQPCGgqLab22xBAC9NVAMD723gmKEcqTYEuoPkCxEkHcu' } 
        ]
      }
    });

    peer.on('signal', data => {
      console.log('Signal gesendet:', JSON.stringify(data));
    });

    peer.on('connect', () => {
      console.log('Peer verbunden!');
    });

    peer.on('stream', stream => {
      console.log('Stream empfangen:', stream);

    });

    setPeer(peer);

    return () => {
      peer.destroy();
    };
  }, []);

  return (
    <div>
      <button onClick={() => {
        peer.signal();
      }}>
        Anruf starten
      </button>
      <AudioPlayer autoPlay controls srcObject={peer && peer.stream} />
    </div>
  );
};

export default VoipComponent;