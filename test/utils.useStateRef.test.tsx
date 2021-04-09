import React, { FC, useEffect } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { useStateRef } from "../src/utils";
import { act } from "react-dom/test-utils";

describe("useStateRef", () => {
  let container: HTMLElement | null = null;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    unmountComponentAtNode(container!);
    container!.remove();
    container = null;
  });

  const TestComponent: FC = () => {
    var [count, setCount, countRef] = useStateRef(0);
    useEffect(() => {
      const button = document.querySelector("[data-testid=increment]");
      (button as HTMLElement).onclick = () => setCount(countRef.current + 1);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (
      <>
        <p>{count}</p>
        <button data-testid="increment" />
      </>
    );
  };

  it("should expose state via a ref", () => {
    act(() => {
      render(<TestComponent />, container);
    });
    const button = document.querySelector("[data-testid=increment]");
    expect(container?.textContent).toBe("0");
    act(() => {
      button?.dispatchEvent(new MouseEvent("click"));
    });
    expect(container?.textContent).toBe("1");
    act(() => {
      button?.dispatchEvent(new MouseEvent("click"));
    });
    expect(container?.textContent).toBe("2");
  });
});
