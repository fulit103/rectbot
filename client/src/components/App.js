import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import About from './pages/About';
import Shop from './shop/Shop';
import Header from './Header';
import Chatbot from './chatbot/Chatbot';

const App = (props) => {

  const render = () => {
    if ( window.location.pathname == '/chatbot' ) {
      return (
        <Chatbot styles={{width: '100%'}} full={true} />
      )
    } else {
      return (
        <div>
          <BrowserRouter>
            <Header />
            <div className='container'>          
              <Route exact path="/" component={Landing}/>
              <Route exact path="/about" component={About}/>
              <Route exact path="/shop" component={Shop}/>
              <Chatbot styles={{ height:500, width: 400, marginRight:10,position: 'absolute', bottom: 0, right:0, border:'1px solid lightgrey' }} full={false} />          
            </div>
          </BrowserRouter>
        </div>
      )
    }
  }

  return (
    <>
      {render()}
    </>
  );
};

export default App;