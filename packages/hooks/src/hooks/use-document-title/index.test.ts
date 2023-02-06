import { renderHook } from '@testing-library/react';
import { useDocumentTitle } from './index';

describe('useDocumentTitle', () => {
  it('should update document title', () => {
    document.title = 'Title';
    expect(document.title).toBe('Title');
    const hook = renderHook((props) => useDocumentTitle(props), {
      initialProps: 'New Title',
    });

    expect(document.title).toBe('New Title');
  });

  it('should update document title when title change', () => {
    const hook = renderHook((props) => useDocumentTitle(props), {
      initialProps: 'New Title',
    });

    expect(document.title).toBe('New Title');

    hook.rerender('Other Title');
    expect(document.title).toBe('Other Title');
  });

  it('should not restore old title by default', () => {
    document.title = 'Title';
    const hook = renderHook((props) => useDocumentTitle(props), {
      initialProps: 'New Title',
    });

    expect(document.title).toBe('New Title');
    hook.unmount();

    expect(document.title).toBe('New Title');
  });

  it('should restore old title on unmounted with restoreOnUnmount option', () => {
    document.title = 'Title';
    const hook = renderHook((props) => useDocumentTitle(props, { restoreOnUnmount: true }), {
      initialProps: 'New Title',
    });

    expect(document.title).toBe('New Title');
    hook.unmount();

    expect(document.title).toBe('Title');
  });
});
