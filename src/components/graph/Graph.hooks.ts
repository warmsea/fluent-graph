import { isFunction, throttle } from "lodash";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useReducer,
  useRef,
  useState
} from "react";

export function useStateRef<S = undefined>(
  initialState: S | (() => S),
  throttleMs: number = 0
): [S, Dispatch<SetStateAction<S>>, MutableRefObject<S>] {
  const [state, setState] = useState(initialState);
  const ref = useRef(state);
  const throttledSetState = useCallback(
    isFinite(throttleMs) && throttleMs > 0
      ? throttle(setState, throttleMs)
      : setState,
    [setState]
  );

  var dispatch = useCallback(
    value => {
      if (isFunction(value)) {
        ref.current = value(ref.current);
      } else {
        ref.current = value;
      }

      throttledSetState(ref.current);
    },
    [throttledSetState]
  );

  return [state, dispatch, ref];
}

export function useForceUpdate(throttleMs: number): () => void {
  // @ts-ignore: Unused locals
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ignored, forceUpdate] = useReducer((v: number) => v + 1, 0);
  return isFinite(throttleMs) && throttleMs > 0
    ? throttle(forceUpdate, throttleMs)
    : forceUpdate;
}
