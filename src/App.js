import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const handleMessage = (event) => {
      console.log(event.data);
      if (event.data.type === 'UPDATE_POINTS') {
        setPoints(event.data.points);
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const sendMessageToUnity = (value) => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.contentWindow.postMessage({type: 'CALL_UNITY_FUNCTION', value: value}, "*");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <iframe
        src='https://jakeb99.github.io/web-game/'
        title='Unity webGL Game'
        width="1200"
        height="800"
        style={{border: 'none'}}
        onLoad={
          () => {
            console.log("Unity WebGL game loaded")
          }
        }
        ></iframe>
        <p>Points: {points} </p>
        <button onClick={() => sendMessageToUnity(5)} >Call Unity Function</button>
      </header>
    </div>
  );
}

export default App;
