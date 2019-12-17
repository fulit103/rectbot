import React, { Component } from 'react';
import axios from 'axios';
import Message from './Message';

class Chatbot extends Component {

  constructor(props) {
    super(props);
    this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
    this.state = {
      messages: []
    }
  }

  async df_text_query(text) {
    let says = {
      speaks: 'me',
      msg: {
        text: {
          text: text
        }
      }
    };

    this.setState( {messages:[...this.state.messages, says]});

    const res = await axios.post('/api/df_text_query', {text});
    for (let msg of res.data.fulfillmentMessages) {      
      says = {
        speaks: 'bot',
        msg: msg
      }
      this.setState( {messages:[...this.state.messages, says]});
    }
  }

  async df_event_query(event) {
    const res = await axios.post('/api/df_event_query', {event});
    for (let msg of res.data.fulfillmentMessages) {
      let says ={
        speaks: 'bot',
        msg: msg
      }
      this.setState( {messages:[...this.state.messages, says]});
    }
  }

  componentDidMount() {
    this.df_event_query('Welcome');
  }

  renderMessages(stateMessages){
    if (stateMessages && stateMessages.length>0 ) {
      return stateMessages.map((message, i) => {
        return <Message key={i} speaks={message.speaks} text={message.msg.text.text} />;
      })
    } else {
      return <div className="progress"><div className="indeterminate"></div></div>;
    }
  }

  _handleInputKeyPress(e) {
    if (e.key === 'Enter' && e.target.value !== '') {
      this.df_text_query(e.target.value);
      e.target.value = '';
    }
  }
  
  render() {
    return (
      <div style={{ height:400, width: 400, float:'right' }}>
        <div id='chatbot' style={{ height:'100%', width:'100%', overflow:'auto'}}>
          <h2>Chatbot</h2>
          {this.renderMessages(this.state.messages)}
          <input type='text' onKeyPress={this._handleInputKeyPress}/>
        </div>        
      </div>      
    );
  }
}

export default Chatbot;