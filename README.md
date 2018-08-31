# react-syncing

Synchronize state between react components using pubsub.


## Instructions

If you extends from `Sync` instead of using `setState`, use `set`,

instead of using `componentWillUnmount`, use `willUnmount`,

And instead of using `componentDidMount`, use `didMount`

That's all!

## Usage

```
import Sync from "react-syncing";

export class App extends Sync {
  render(){
    return <div>{this.state.name}</div>
  }
}

```

From another component

```
import Sync from "react-syncing";

export class NameInput extends Sync {
  didMount(){
    // Default name
    this.set({name: "Name"})
  }
  render(){
    return <input onInput={(e) => this.set({name: e.target.value})} />
  }
}
```
