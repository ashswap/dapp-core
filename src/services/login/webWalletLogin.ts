import moment from 'moment';
import { networkSelector } from '../../redux/selectors';
import { setWalletLogin } from '../../redux/slices';
import { store } from '../../redux/store';
import { newWalletProvider } from '../../utils';

export const webWalletLogin = async ({
  callbackRoute,
  token
}: {
  callbackRoute: string;
  token?: string;
}) => {
  try {
    const appState = store.getState();
    const network = networkSelector(appState);
    const provider = newWalletProvider(network);

    const expires = moment().add(3, 'minutes').unix();
    const walletLoginData = {
      data: {},
      expires: expires
    };

    store.dispatch(setWalletLogin(walletLoginData));

    const callbackUrl: string = encodeURIComponent(
      `${window.location.origin}${callbackRoute}`
    );
    const loginData = {
      callbackUrl: callbackUrl,
      ...(token && { token })
    };

    await provider.login(loginData);
  } catch (error) {
    console.error(error);
  }
};

export default webWalletLogin;
