# react-syncing

Synchronize state between react components using pubsub.

## Instructions

Extends your main class (the typical App) from Master, the rest from Slave, the source of trust will be the Master

If you extends from `Master or Slave`:

instead of using `setState`, use `set`,

instead of using `componentWillUnmount`, use `willUnmount`,

and instead of using `componentDidMount`, use `didMount`

That's all!

## Usage

```jsx
import {Master} from "react-syncing";

export class App extends Master {
  render() {
    return (
      <div>
        <p>{this.state.name}</p>
        <NameInput />
      </div>
    );
  }
}
```

From another component

```jsx
import {Slave} from "react-syncing";

export class NameInput extends Slave {
  didMount() {
    // Default name
    this.set({ name: "Name" });
  }
  render() {
    return <input onInput={e => this.set({ name: e.target.value })} />;
  }
}
```

## Performance

https://kidandcat.github.io/sync-performance/

All the squares are syncing the state with the Root element that keeps changing the color and adding new elements. Only the firs Square receives the color as a prop.
The first square shows the number of rendered elements.

In my computer, it renders 200 elements without any issue. After that, it start suffering delays, I would need to test react alone too. Anyway, obviously, you shouldn't be syncing every single component of your webpage.

## License

MIT
