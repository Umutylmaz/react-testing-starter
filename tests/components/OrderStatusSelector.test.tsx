import { render, screen } from '@testing-library/react';
import { it, expect, describe } from 'vitest';
import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import { Theme } from '@radix-ui/themes';
import ResizeObserver from 'resize-observer-polyfill';
import userEvent from '@testing-library/user-event';

globalThis.ResizeObserver = ResizeObserver;

window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('OrderStatusSelector', () => {
  const renderComponent = async () => {
    const onChange = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>,
    );
    return {
      button: screen.getByRole('combobox'),
      onChange,
      user: userEvent.setup(),
      getOption: (label: RegExp) =>
        screen.findByRole('option', { name: label }),
      getOptions: () => screen.findAllByRole('option'),
    };
  };

  it('should render New as the default value', async () => {
    const { button } = await renderComponent();
    expect(button).toHaveTextContent(/new/i);
  });

  it('should render correct statuses', async () => {
    const { button, getOptions, user } = await renderComponent();

    await user.click(button);
    const options = await getOptions();

    expect(options).toHaveLength(3);

    const labels = options.map((option) => option.textContent);
    expect(labels).toEqual(['New', 'Processed', 'Fulfilled']);
  });

  it.each([
    { label: /processed/i, value: 'processed' },
    { label: /fulfilled/i, value: 'fulfilled' },
  ])(
    'should call onChange with $value when the $label option is selected',
    async ({ label, value }) => {
      const { button, onChange, user, getOption } = await renderComponent();
      await user.click(button);

      const option = await getOption(label);
      await user.click(option);

      expect(onChange).toHaveBeenCalledWith(value);
    },
  );

  it("should call onChange with 'new' when new is selected second time", async () => {
    const { button, onChange, user, getOption } = await renderComponent();
    await user.click(button);
    const processedOption = await getOption(/processed/i);
    await user.click(processedOption);

    await user.click(button);
    const option = await getOption(/new/i);
    await user.click(option);

    expect(onChange).toHaveBeenCalledWith('new');
  });
});
