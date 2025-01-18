
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import MainPage from './MainPage';
import UrlPage from './UrlPage';

const App = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/url/:id" element={<UrlPage/>}/>
        <Route path='*' element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
