import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FlowerData } from './flower-field/flowerModel';

interface MockFlowerFieldProps {
  flowers: FlowerData[];
  visible: boolean;
  onBloomComplete: () => void;
}

let flowerFieldProps: MockFlowerFieldProps;

vi.mock('./components/FlowerField', () => ({
  FlowerField: (props: MockFlowerFieldProps) => {
    flowerFieldProps = props;
    return <canvas data-testid="flower-field" />;
  },
}));

import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('runs the bloom, completion, clear, and recast flow', async () => {
    const user = userEvent.setup();
    render(<App />);

    const staff = screen.getByRole('button', { name: 'Bloom flowers' });
    expect(
      screen.getByText('Tap the staff to bloom flowers'),
    ).toBeInTheDocument();
    expect(staff).toBeEnabled();
    expect(flowerFieldProps.visible).toBe(false);

    await user.click(staff);
    expect(staff).toBeDisabled();
    expect(flowerFieldProps.visible).toBe(true);
    expect(
      screen.getByRole('button', { name: 'Clear flowers' }),
    ).toBeInTheDocument();
    const firstCast = flowerFieldProps.flowers;

    act(() => flowerFieldProps.onBloomComplete());
    expect(staff).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Clear flowers' }));
    expect(flowerFieldProps.visible).toBe(false);
    expect(
      screen.getByText('Tap the staff to bloom flowers'),
    ).toBeInTheDocument();

    await user.click(staff);
    expect(staff).toBeDisabled();
    expect(flowerFieldProps.visible).toBe(true);
    expect(flowerFieldProps.flowers).not.toBe(firstCast);
    expect(flowerFieldProps.flowers).toHaveLength(400);
  });
});
