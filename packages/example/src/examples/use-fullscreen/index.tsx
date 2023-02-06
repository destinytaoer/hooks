import { FC, useEffect, useRef, useState } from 'react';
import { useFullscreen } from 'hooks';

interface IUseFullscreenProps {}

const UseFullscreen: FC<IUseFullscreenProps> = (props) => {
  const [state, setState] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setState(false);
    }, 3000);
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  return (
    <div>
      Fullscreen
      <div>{state && <Child />}</div>
    </div>
  );
};

const Child = () => {
  const ref = useRef(null);
  const [state, control] = useFullscreen(ref);
  return (
    <div ref={ref}>
      <button onClick={() => control.toggleFullscreen()}>fullscreen</button>
    </div>
  );
};

export default UseFullscreen;
