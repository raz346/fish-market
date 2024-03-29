import React from 'react';
import Header from './Header';
import Inventory from './Inventory';
import Order from './Order';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends React.Component {
  state = {
    fishes: {},
    order: {}
  }

  componentDidMount() {
    const localStorageRef = localStorage.getItem(this.props.match.params.storeId);
    if(localStorageRef) {
      this.setState({order: JSON.parse(localStorageRef) });
    }
    this.ref = base.syncState(`${this.props.match.params.storeId}/fishes`,{
    context: this,
      state: "fishes"
    });
  }

  componentDidUpdate() {
    localStorage.setItem(this.props.match.params.storeId, JSON.stringify(this.state.order));
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  addFish = fish => {
    const fishes = {...this.state.fishes};
    fishes[`fish${Date.now()}`] = fish;
    this.setState({
      fishes: fishes
    });
  }

  updateFish = (key, updatedFish) => {
    // cpoy of current state
    const fishes = {...this.state.fishes};
    // update that state
    fishes[key] = updatedFish;
    // set to state
    this.setState ({
      fishes: fishes
  });
  }

  deleteFish = key => {
    const fishes = {...this.state.fishes};
    fishes[key] = null;
    this.setState({
      fishes: fishes
    });
  }

  loadSampleFishes = () => {
    this.setState({
      fishes: sampleFishes
    });
  }

  addToOrder = key => {
    const order = {...this.state.order};
    order[key] = order[key] + 1 || 1;
    this.setState({
      order: order
    });
  }

  deleteFromOrder = key => {
    const order = {...this.state.order};
    delete order[key];
    this.setState ({
      order: order
    });
  }
  render() { 
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline='Fish Market'/>
          <ul className='fishes'>
            {Object.keys(this.state.fishes).map(key =>
               <Fish key={key} fishDetails={this.state.fishes[key]}
               addToOrder={this.addToOrder} index={key} />)}
          </ul>
        </div>
        <Order
        fishes={this.state.fishes} order={this.state.order}
        deleteFromOrder = {this.deleteFromOrder}/>
        <Inventory addFish={this.addFish} 
        loadSampleFishes={this.loadSampleFishes} 
        fishes = {this.state.fishes}
        updateFish = {this.updateFish}
        deleteFish = {this.deleteFish}
        />
      </div>
    );
  }
}
 
export default App;