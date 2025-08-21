import { FC, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '@/redux.config';


type ReduxPersistProviderProps = {

} & PropsWithChildren;

const ReduxPersistProvider: FC<ReduxPersistProviderProps> = ({ children }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}

export default ReduxPersistProvider