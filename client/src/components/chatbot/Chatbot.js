import React, { Component } from 'react';
import axios from 'axios';
import Message from './Message';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';
import Card from './Card';
import QuickReplies from './QuickReplies';


const cookies = new Cookies();

class Chatbot extends Component {

  messagesEnd;
  inputText;

  constructor(props) {
    super(props);
    this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
    this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);
    this._clickHandlerShowChatbot = this._clickHandlerShowChatbot.bind(this);
    this.state = {
      messages: [],
      showChatBot: true,
      height: 500,
    }
    if (cookies.get('userID') === undefined) {
      cookies.set('userID', uuid(), { path: '/' })
    }
    console.log(cookies.get('userID'));
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

    const res = await axios.post('/api/df_text_query', {text, userID: cookies.get('userID')});
    for (let msg of res.data.fulfillmentMessages) {      
      says = {
        speaks: 'bot',
        msg: msg
      }
      this.setState( {messages:[...this.state.messages, says]});
    }
  }

  async df_event_query(event) {
    const res = await axios.post('/api/df_event_query', {event, userID: cookies.get('userID')});
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
    this.inputText.focus();
  }

  componentDidUpdate() {
    if (this.state.showChatBot) {
      this.messagesEnd.scrollIntoView({behavior: "smooth"})
    }
  }

  _handleInputKeyPress(e) {
    if (e.key === 'Enter' && e.target.value !== '') {
      this.df_text_query(e.target.value);
      e.target.value = '';
    }
  }

  _handleQuickReplyPayload(event, payload, text) {
    event.preventDefault();
    event.stopPropagation();

    switch (payload) {
      case 'training_masterclass':
        this.df_event_query('MASTERCLASS');
        break;
      default:
        this.df_text_query(text);
        break;
    } 
  }

  _clickHandlerShowChatbot(event) {
    event.preventDefault();

    this.setState({
      ...this.state, 
      showChatBot: !this.state.showChatBot, 
      height:!this.state.showChatBot ? 500:100
    })
  }

  renderCards(cards) {
    return (
      cards.map((card, i) => <Card key={i} payload={card.structValue} /> )
    )
  }

  renderOneMessage(message, i) {
    if (message.msg && message.msg.text && message.msg.text.text) {
      return <Message key={i} speaks={message.speaks} text={message.msg.text.text} />;
    } else if (message.msg && message.msg.payload && message.msg.payload.fields && message.msg.payload.fields.cards ) {
      return (
        <div key={i}>
          <div className='card-panel gray lighten-5 z-depth-1'>
            <div style={{overflow: 'hidden'}}>
              <div className='col s2'>
                <a className='btn-floating btn-large waves-effect waves-light red'>
                  {message.speaks}
                </a>
              </div>
              <div style={{overflow: 'auto', overflowY: 'scroll'}}>
                <div style={{height: 300, width:message.msg.payload.fields.cards.listValue.values.length*270}}>
                  {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
                </div>
              </div>
            </div>
          </div>          
        </div>
      );
    } else if (
      message.msg &&
      message.msg.payload &&
      message.msg.payload.fields &&
      message.msg.payload.fields.quick_replies 
    ) {
      return (
        <QuickReplies 
          text={message.msg.payload.fields.text ? message.msg.payload.fields.text : null}
          key={i}
          replyClick={this._handleQuickReplyPayload}
          speaks={message.speaks}
          payload={message.msg.payload.fields.quick_replies.listValue.values}
        />
      )
    }
  }

  renderMessages(stateMessages){
    if (stateMessages && stateMessages.length>0 ) {
      return stateMessages.map((message, i) => {        
        return this.renderOneMessage(message, i);
      })
    } else {
      return <div className="progress"><div className="indeterminate"></div></div>;
    }
  }
  
  render() {
    return (
      <div style={{...this.props.styles, height:this.state.height}}>
        {!this.state.showChatBot && this.props.full && 
          <div id='chatbot' style={{ height:438, width:'100%', overflow:'auto'}}> 
          </div>
        }
        <nav>
          <div className='nav-wrapper' style={{paddingLeft:10, cursor: "pointer"}} onClick={this._clickHandlerShowChatbot} >
            <a className='brand-logo'>ChatBot</a>
          </div>
        </nav>
        {this.state.showChatBot && 
          <>
            <div id='chatbot' style={{ height:388, width:'100%', overflow:'auto'}}>          
              {this.renderMessages(this.state.messages)}
              <div style={{ float: 'left', clear:'both' }} ref={(el) => {this.messagesEnd = el}}></div>
              
            </div>        
            <div className='col s12'>
              <input type='text' onKeyPress={this._handleInputKeyPress} ref={(el) => {this.inputText = el}} 
                style={{margin:0, paddingLeft: '1%', paddingRight: '1%', width: '98%'}} 
                placeholder='Escribe un mensaje'
              />
            </div>
          </>
        }
      </div>      
    );
  }
}

export default Chatbot;