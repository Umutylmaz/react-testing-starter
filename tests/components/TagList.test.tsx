import { render, screen } from '@testing-library/react';
import { it, expect, describe } from 'vitest';
import TagList from '../../src/components/TagList';

describe('TagList', () => {
  it('should render items of the list', async () => {
    render(<TagList />);
    /* await waitFor(() => {
        const listItems = screen.getAllByRole('listitem');
        expect(listItems.length).toBeGreaterThan(0);
    })

    */

    const listItems = await screen.findAllByRole('listitem');

    expect(listItems.length).toBeGreaterThan(0);
  });
});
