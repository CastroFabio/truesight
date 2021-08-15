import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register.js/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import particlesConfig from "./particlesjs-config.json";
import './App.css';

const initalState = {
  input: '',
  imageUrl: '',
  celeb: '',
  valor: '',
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}


class App extends Component {
  constructor(){
    super();
    this.state =initalState
  }

  loadUser = (data) => {
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initalState)
    }else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  calculateCelebrity = (data) => {
    this.setState({celeb: (Math.trunc((data.outputs[0].data.regions[0].data.concepts[0].value)*100)+"%") +" "+ (data.outputs[0].data.regions[0].data.concepts[0].name)})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onImageSubmit= () => {
    this.setState({imageUrl: this.state.input})
      fetch('https://vast-temple-97785.herokuapp.com/imageurl',{
        method: 'post',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
    })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        this.setState({valor: response.outputs[0].data.regions[0].data.concepts[0].value})
        if(response && this.state.valor > 0.8){
          fetch('https://vast-temple-97785.herokuapp.com/image',{
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(this.setState(Object.assign(this.state.user, {entries:count})))
          })
          .catch(console.log)
        }
        this.calculateCelebrity(response)
      })
      .catch(err => console.log(err));
  }

  render(){
    const {isSignedIn, imageUrl, route, celeb} = this.state
    return (
      <div className="App">
        <Particles
          className= "particles" 
          params={particlesConfig}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route=== 'home'
          ? <div> 
              <Logo/>
              <Rank 
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm 
                onInputChange= {this.onInputChange}
                onImageSubmit= {this.onImageSubmit}
                />
              <FaceRecognition
                imageUrl={imageUrl}
                celeb={celeb}
                valor = {this.state.valor}
              />
            </div>
          : (
              route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
