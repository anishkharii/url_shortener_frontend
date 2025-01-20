
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import MainPage from './MainPage';
import UrlPage from './UrlPage';
import UrlList from './UrlList';

const App = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/urls/:id" element={<UrlPage/>}/>
        <Route path='/urls' element={<UrlList/>}/>
        <Route path='*' element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
