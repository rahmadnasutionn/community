import { RefObject, useEffect, useRef } from "react";


function useEventListener<T extends HTMLElement = HTMLDivElement>(
  eventName: string,
  handler: Function,
  element?: RefObject<T>
) {
  const saveHandler = useRef<Function>();

  useEffect(() => {
    saveHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement: T | Window = element?.current || window;

    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    const eventListener = (event: Event) => {
      if (!!saveHandler.current) {
        saveHandler.current(event);
      }
    };


    targetElement.addEventListener(eventName, eventListener);

    return () => targetElement.removeEventListener(eventName, eventListener);
  }, [eventName, element]);

};

export default useEventListener;