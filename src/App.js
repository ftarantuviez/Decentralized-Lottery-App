import "./App.css";
import React from "react";
import lottery from "./lottery";
import web3 from "./web3";

class App extends React.Component {
  state = { manager: "", players: [], balance: "", value: "", message: "" };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    if (!window.ethereum) {
      return alert("Install Metamask please!");
    }
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "You have been entered!" });
  };

  pickAWinner = async (event) => {
    if (!window.ethereum) {
      return alert("Install Metamask please!");
    }
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    this.setState({ message: "A winner has been picked!" });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager} <br /> There are
          currently {this.state.players.length} competing to win{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>
        <hr />

        <form onSubmit={this.handleSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              onChange={(event) => this.setState({ value: event.target.value })}
              value={this.state.value}
            />
          </div>
          <button type="submit">Enter</button>
        </form>
        <hr />
        <h4>Ready to pick a winner</h4>

        <button onClick={this.pickAWinner}>Pick a winner</button>
        <hr />

        <p>{this.state.message}</p>
      </div>
    );
  }
}
export default App;
