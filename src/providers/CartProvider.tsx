import { CartProvider as RCartProvider } from 'react-use-cart';

interface CartProviderOptions {
	children?: React.ReactElement;
}

export const CartProvider = ({ children }: CartProviderOptions) => {
	return <RCartProvider>{children}</RCartProvider>;
};
