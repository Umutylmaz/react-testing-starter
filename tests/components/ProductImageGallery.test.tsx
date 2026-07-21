import { render, screen } from '@testing-library/react';
import ProductImageGallery from '../../src/components/ProductImageGallery';

describe('ProductImageGallery', () => {
  it('should render nothing, if imageUrls array is empty', () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render list of images', () => {
    const imgURLs: string[] = ['url1', 'url2'];
    render(<ProductImageGallery imageUrls={imgURLs} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(imgURLs.length);
    imgURLs.forEach((url, index) => {
      expect(images[index]).toHaveAttribute('src', url);
    });
  });
});
