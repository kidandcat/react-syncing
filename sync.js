import React from "react";
import PubSub from "pubsub-js";

export default {
  Master,
  Slave
};
class Master extends React.Component {
  constructor() {
    super();
    this._syncKind = "Master";
    this.state = {};
    this.set = this.set.bind(this);
  }
  componentDidMount() {
    this.token = PubSub.subscribe("state", (msg, { cmd, value }) => {
      switch (cmd) {
        case "stateToMaster":
          this.setState(value, () => {
            PubSub.publish("state", {
              cmd: "stateToSlaves",
              value: this.state
            });
          });
          break;
        case "get":
          PubSub.publish("state", {
            cmd: "stateToSlaves",
            value: this.state
          });
          break;
      }
    });
    this.token2 = PubSub.subscribe("action", (msg, { action, params }) => {
      if (this[action]) this[action](...params);
    });
    try {
      this.didMount = this.didMount.bind(this);
      this.didMount();
    } catch (e) {}
  }
  componentWillUnmount() {
    PubSub.unsubscribe(this.token);
    PubSub.unsubscribe(this.token2);
    try {
      this.willUnmount = this.willUnmount.bind(this);
      this.willUnmount();
    } catch (e) {}
  }
  set(state) {
    this.setState(state, () => {
      PubSub.publish("state", { cmd: "stateToSlaves", value: this.state });
    });
  }
}

class Slave extends React.Component {
  constructor() {
    super();
    this._syncKind = "Slave";
    this.state = {};
    this.set = this.set.bind(this);
    this.action = this.action.bind(this);
  }
  componentDidMount() {
    this.token = PubSub.subscribe("state", (msg, { cmd, value }) => {
      switch (cmd) {
        case "stateToSlaves":
          this.setState(value);
          break;
      }
    });
    PubSub.publish("state", { cmd: "get" });
    try {
      this.didMount = this.didMount.bind(this);
      this.didMount();
    } catch (e) {}
  }
  componentWillUnmount() {
    PubSub.unsubscribe(this.token);
    PubSub.unsubscribe(this.token2);
    try {
      this.willUnmount = this.willUnmount.bind(this);
      this.willUnmount();
    } catch (e) {}
  }
  set(state) {
    PubSub.publish("state", { cmd: "stateToMaster", value: state });
  }
  action(action, ...params) {
    PubSub.publish("action", { action, params });
  }
}
