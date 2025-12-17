import './styles/fonts.scss';
import './styles/global.scss';
import './styles/productDropdown.css';
import { Router } from './router';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <>
      <RouterProvider router={Router} />
    </>
  );
}

export default App;
