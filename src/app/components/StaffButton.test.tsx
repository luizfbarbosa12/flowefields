import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StaffButton } from './StaffButton';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('StaffButton', () => {
  it('is an accessible command and respects its disabled state', () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <StaffButton onClick={onClick} disabled={false} />,
    );
    const button = screen.getByRole('button', { name: 'Bloom flowers' });

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();

    rerender(<StaffButton onClick={onClick} disabled />);
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('uses unique SVG definition IDs for each instance', () => {
    const { container } = render(
      <>
        <StaffButton onClick={() => undefined} disabled={false} />
        <StaffButton onClick={() => undefined} disabled={false} />
      </>,
    );
    const ids = [
      ...container.querySelectorAll('linearGradient, radialGradient, filter'),
    ].map((element) => element.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('does not render casting particles when reduced motion is requested', () => {
    vi.stubGlobal('matchMedia', (query: string): MediaQueryList => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }));

    render(<StaffButton onClick={() => undefined} disabled />);
    expect(screen.queryByTestId('casting-particles')).not.toBeInTheDocument();
  });
});
