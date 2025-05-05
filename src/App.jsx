import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router'; 
import Selector from './components/Selector';
import Salon from './components/Salon';

function App() {
  return (  
    <BrowserRouter>
      {/* <Navigation/> */}
      <Routes>
        <Route index element={<Selector />}></Route>
        <Route path="/salon/:id" element={<Salon />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
