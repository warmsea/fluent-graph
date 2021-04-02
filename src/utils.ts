import { identity, isFunction, merge } from "lodash";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useRef,
  useState
} from "react";

export function css(...classNames: (string | undefined)[]): string {
  return classNames.filter(identity).join(" ");
}

export function useStateRef<S = undefined>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>, MutableRefObject<S>] {
  var [state, setState] = useState(initialState);
  var ref = useRef(state);

  var dispatch = useCallback(value => {
    if (isFunction(value)) {
      ref.current = value(ref.current);
    } else {
      ref.current = value;
    }

    setState(ref.current);
  }, []);

  return [state, dispatch, ref];
}

export function mergeConfig<D = any, E = any>(
  defaults: D,
  explicits: E
): D & E {
  return merge({}, defaults, explicits);
}
