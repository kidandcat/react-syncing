import React from "react";
import PubSub from "pubsub-js";

export default class Sync extends React.Component {
  /* ---------- */
  /* STATE SYNC */
  // Setup an empty state or it will be null and accessing things like
  // this.state.variable will throw exception because this.state will be null
  constructor() {
    super();
    this.state = {};
    this._received_messages = [];
    this.set = this.set.bind(this);
    this.action = this.action.bind(this);
  }
  componentDidMount() {
    this.token = PubSub.subscribe("state", (msg, { cmd, value, id }) => {
      switch (cmd) {
        case "state":
          if (!~this._received_messages.indexOf(id)) {
            this._received_messages.push(id);
            this.setState(value);
          }
          break;
        case "get":
          if (value != this) {
            const id = makeid();
            this._received_messages.push(id);
            PubSub.publish("state", { cmd: "state", id, value: this.state });
          }
          break;
      }
    });
    this.token2 = PubSub.subscribe("action", (msg, { action, params }) => {
      if (this[action]) this[action](...params);
    });
    const id = makeid();
    this._received_messages.push(id);
    PubSub.publish("state", { cmd: "get", id, value: this });
    try {
      this.didMount();
    } catch (e) {}
  }
  componentWillUnmount() {
    PubSub.unsubscribe(this.token);
    PubSub.unsubscribe(this.token2);
    try {
      this.willUnmount();
    } catch (e) {}
  }
  set(state) {
    const id = makeid();
    this._received_messages.push(id);
    this.setState(state, () => {
      PubSub.publish("state", { cmd: "state", id, value: this.state });
    });
  }
  action(action, ...params) {
    PubSub.publish("action", {
      action,
      params
    });
  }
  /* STATE SYNC */
  /* ---------- */
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 15; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}