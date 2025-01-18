
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Main from './Main';
import UrlPage from './UrlPage';

const App = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/url/:id" element={<UrlPage/>}/>
        <Route path='*' element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
