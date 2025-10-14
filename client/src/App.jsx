import { Provider } from 'react-redux';
import { store } from './store';
import AppRoutes from "./routes/AppRoutes.jsx";

const App = () => {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
};

export default App;
