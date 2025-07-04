import {BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Board from './components/Board'

function App(){
  return (
    <Router>
      <Routes>
        <Route path = '/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/board' element={<Board />} />
      </Routes>
    </Router>
  )
}

export default App;