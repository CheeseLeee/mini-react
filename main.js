import './style.css'
import { Didact} from './packages/diarct'
import { Component } from './packages/workLoop'
class App extends Component {
  constructor(){
    super()
  }
  state = {
    num:1
  }
  handleNumAdd = () => {
    this.state.num++
    this.setState()
  }
  render(){
    console.log('reRender')
    return (
      Didact.createElement('div',{},
        Didact.createElement('h1',{},'i am H1'),
        Didact.createElement('p',{},`i am p and show num:${this.state.num}`),
        Didact.createElement('button',{onClick:this.handleNumAdd},'button')
      )
    )
  }
}
Didact.render(App,document.getElementById('root'))
