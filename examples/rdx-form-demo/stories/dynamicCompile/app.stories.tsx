import * as React from 'react';
import bundle from './bundle';
export default {
  title: 'ESbuild/App',
  parameters: {
    info: { inline: true },
  },
};
const code = `import * as  React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Hello jsx book!</h1>
      <h2>Start editing to create something magic!</h2>
      <p>By the way, you can import (almost) ANY npm package using our magic bundler</p>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));`

export const App = () => {
  const iframe = React.useRef<HTMLIFrameElement>();

  const src = 
`
  <html>
    <head>
      <style>html { background-color: white; }</style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        const handleError = (err) => {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style=" position: absolute; top: 10px; left: 10px; color: red;"><h4>Runtime Error</h4>' + err + '</div>';
          console.error(err);
        };
        window.addEventListener('error', (event) => {
          event.preventDefault();
          handleError(event.error);
        });
        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch (err) {
            handleError(err);
          }
        }, false);
      </script>
    </body>
  </html>
`;

  const [input, setInput] = React.useState('');
  const [code, setCode] = React.useState('');
  const [err, setErr] = React.useState('');

  React.useEffect(() => {
    iframe.current.srcdoc = src;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);

  }, [code, src]);

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      const { code, err } = await bundle(input);
      setCode(code);
      setErr(err);
    }, 750);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <div>
      <div>
        <h1>Code Tar Pit</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', height: '50vh', width: '100%', border: '1px solid red' }}>
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%' }}>
          <textarea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ width: '100%' }}
          />
          <iframe
            ref={iframe}
            srcDoc={src}
            title="preview"
            sandbox="allow-scripts"
            style={{ width: '100%' }}
          />
          {err && <div>{err}</div>}
        </div>
      </div>
    </div>
  );
}