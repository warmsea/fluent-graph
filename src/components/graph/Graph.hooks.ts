import debounce from "lodash/debounce";
import isFunction from "lodash/isFunction";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

export function useStateRef<S = undefined>(
  initialState: S | (() => S),
  debounceMs = 0
): [S, Dispatch<SetStateAction<S>>, MutableRefObject<S>] {
  const [state, setState] = useState(initialState);
  const ref = useRef(state);
  const debounced = useMemo(
    () =>
      isFinite(debounceMs) && debounceMs > 0
        ? debounce(setState, debounceMs, { maxWait: debounceMs })
        : setState,
    [setState, debounceMs]
  );

  const dispatch = useCallback(
    (value) => {
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

export function useForceUpdate(debounceMs = 0): () => void {
  const [_, forceUpdate] = useReducer((v) => v + 1, 0);
  return isFinite(debounceMs) && debounceMs > 0
    ? debounce(forceUpdate, debounceMs, { maxWait: debounceMs })
    : forceUpdate;
}
