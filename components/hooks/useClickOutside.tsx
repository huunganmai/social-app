import {RefObject, useEffect } from 'react'

const useClickOutside = (ref : RefObject<HTMLDivElement> | null, handler: any) => {
    useEffect(() => {
        const listener = (event: any) => {
            // Do nothing if clicking ref's element or descendent elements
            if (!ref?.current || ref.current?.contains(event.target)) {
              return;
            }
            handler();
          };
      
          document.addEventListener('mousedown', listener);
          document.addEventListener('touchstart', listener);
          return () => {
            document.removeEventListener('mousedown', listener);
            document.addEventListener('touchstart', listener);
          };
    }, [ref, handler])
}

export default useClickOutside