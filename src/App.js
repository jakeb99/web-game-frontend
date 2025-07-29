import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const iframeRef = useRef(null);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // Listen for messages from Unity
    const handleMessage = (event) => {
      console.log('Received from Unity:', event.data);
      if (event.origin !== 'https://jakeb99.github.io') return;

      try {

        const data = JSON.parse(event.data);
        console.log('Parsed JSON:', event.data);

        if (data.type === "LEVEL_END") {
          setPoints(parseInt(data.data))
        }
      } catch (e) {
        console.log('String message:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const sendToUnity = (message) => {
    if (iframeRef.current?.contentWindow) {
      const messageString = typeof message === 'object' ? JSON.stringify(message) : message;
      iframeRef.current.contentWindow.postMessage(messageString, '*');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <iframe 
          ref={iframeRef}
          src='https://jakeb99.github.io/web-game/'
          title='Unity webGL Game'
          width="1200"
          height="800"
          style={{border: 'none'}}
          onLoad={() => {
            console.log("Unity WebGL game loaded");
          }}
        />

        <button onClick={() => sendToUnity({type: 'LOAD_SCENE', data: "Scene-1"})}>
          Switch to scene 1
        </button>
        
        <button onClick={() => sendToUnity({type: 'LOAD_SCENE', data: "Scene-2"})}>
          Switch to scene 2
        </button>

        <p>Points: {points}</p>
      </header>
    </div>
  );
}

export default App;