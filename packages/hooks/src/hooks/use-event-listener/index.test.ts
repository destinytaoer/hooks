import { renderHook } from '@testing-library/react';
import { useEventListener } from './index';

describe('useEventListener', () => {
  let container: HTMLDivElement;
  let container2: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container2 = document.createElement('div');
    document.body.appendChild(container);
    document.body.appendChild(container2);
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.removeChild(container2);
  });

  it('test on click listener', () => {
    let state: number = 0;
    const onClick = () => {
      state++;
    };
    const { rerender, unmount } = renderHook(() =>
      useEventListener('click', onClick, { target: () => container })
    );

    document.body.click();
    expect(state).toEqual(0);
    rerender();
    container.click();
    expect(state).toEqual(1);
    unmount();
    document.body.click();
    expect(state).toEqual(1);
  });

  it('test dynamic target', () => {
    let state: number = 0;
    const onClick = () => {
      state++;
    };
    let dom = container;
    const { rerender, unmount } = renderHook(() =>
      useEventListener('click', onClick, { target: () => dom })
    );

    container.click();
    expect(state).toEqual(1);
    dom = container2;
    rerender();
    container2.click();
    expect(state).toEqual(2);
  });
});
