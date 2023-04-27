import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import ChatLayout from './layouts/chatLayout';
import Conversation from './components/conversation';
import NoConversation from './components/noconversations';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={Login} />
        <Route path='/register' Component={Signup} />
        <Route path='/chats' Component={ChatLayout} >
          <Route path='/chats' Component={NoConversation} />
          <Route path='/chats/:id' Component={Conversation} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
