import React from "react";
import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import sampleFishes from "../sample-fishes";
import Fish from "./Fish";
import base from "../base";

class App extends React.Component {
  constructor() {
    super();
    this.updateFish = this.updateFish.bind(this);
    this.addFish = this.addFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);

    this.state = {
      fishes: {},
      order: {}
    };
  }

  componentWillMount() {
    this.ref = base.syncState(`${this.props.params.storeID}/fishes`, {
      context: this,
      state: "fishes"
    });

    const localStorageRef = localStorage.getItem(
      `order-${this.props.params.storeID}`
    );

    if (localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(
      `order-${this.props.params.storeID}`,
      JSON.stringify(nextState.order)
    );
  }

  addFish(fish) {
    const fishes = { ...this.state.fishes };
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    this.setState({ fishes: fishes });
  }

  updateFish(key, updatedFish) {
    const fishes = { ...this.state.fishes };
    fishes[key] = updatedFish;
    this.setState({ fishes: fishes });
  }

  removeFish(key) {
    const fishes = { ...this.state.fishes };
    fishes[key] = null;
    this.setState({ fishes: fishes });
  }

  loadSamples() {
    this.setState({
      fishes: sampleFishes
    });
  }

  addToOrder(key) {
    const order = { ...this.state.order };
    order[key] = order[key] + 1 || 1;
    this.setState({
      order: order
    });
  }

  removeFromOrder(key){
    const order = {...this.state.order};
    delete order[key];
    this.setState({order})
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Whaddup Dog" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(key => (
              <Fish
                key={key}
                index={key}
                addToOrder={this.addToOrder}
                details={this.state.fishes[key]}
              />
            ))}
          </ul>
        </div>
        <Order
          params={this.props.params}
          fishes={this.state.fishes}
          order={this.state.order}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory
          updateFish={this.updateFish}
          removeFish={this.removeFish}
          loadSamples={this.loadSamples}
          addFish={this.addFish}
          fishes={this.state.fishes}
        />
      </div>
    );
  }
}

export default App;
