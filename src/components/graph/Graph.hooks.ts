import { debounce, isFunction } from "lodash";
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
  debounceMs: number = 0
): [S, Dispatch<SetStateAction<S>>, MutableRefObject<S>] {
  const [state, setState] = useState(initialState);
  const ref = useRef(state);
  const debounced = useCallback(
    isFinite(debounceMs) && debounceMs > 0
      ? debounce(setState, debounceMs, { maxWait: debounceMs })
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

      debounced(ref.current);
    },
    [debounced]
  );

  return [state, dispatch, ref];
}

export function useForceUpdate(debounceMs: number = 0): () => void {
  // @ts-ignore: Unused locals
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ignored, forceUpdate] = useReducer((v: number) => v + 1, 0);
  return isFinite(debounceMs) && debounceMs > 0
    ? debounce(forceUpdate, debounceMs, { maxWait: debounceMs })
    : forceUpdate;
}
