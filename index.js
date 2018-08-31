"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _pubsubJs = require("pubsub-js");

var _pubsubJs2 = _interopRequireDefault(_pubsubJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sync = function (_React$Component) {
  _inherits(Sync, _React$Component);

  /* ---------- */
  /* STATE SYNC */
  // Setup an empty state or it will be null and accessing things like
  // this.state.variable will throw exception because this.state will be null
  function Sync() {
    _classCallCheck(this, Sync);

    var _this = _possibleConstructorReturn(this, (Sync.__proto__ || Object.getPrototypeOf(Sync)).call(this));

    _this.state = {};
    _this._received_messages = [];
    _this.set = _this.set.bind(_this);
    _this.action = _this.action.bind(_this);
    return _this;
  }

  _createClass(Sync, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.token = _pubsubJs2.default.subscribe("state", function (msg, _ref) {
        var cmd = _ref.cmd,
            value = _ref.value,
            id = _ref.id;

        switch (cmd) {
          case "state":
            if (_this2._received_messages.indexOf(id) !== -1) {
              _this2._received_messages.push(id);
              _this2.setState(value);
            }
            break;
          case "get":
            if (value != _this2) {
              var _id = makeid();
              _this2._received_messages.push(_id);
              _pubsubJs2.default.publish("state", { cmd: "state", id: _id, value: _this2.state });
            }
            break;
        }
      });
      this.token2 = _pubsubJs2.default.subscribe("action", function (msg, _ref2) {
        var action = _ref2.action,
            params = _ref2.params;

        if (_this2[action]) _this2[action].apply(_this2, _toConsumableArray(params));
      });
      var id = makeid();
      this._received_messages.push(id);
      _pubsubJs2.default.publish("state", { cmd: "get", id: id, value: this });
      try {
        this.didMount = this.didMount.bind(this);
        this.didMount();
      } catch (e) {}
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _pubsubJs2.default.unsubscribe(this.token);
      _pubsubJs2.default.unsubscribe(this.token2);
      try {
        this.willUnmount = this.willUnmount.bind(this);
        this.willUnmount();
      } catch (e) {}
    }
  }, {
    key: "set",
    value: function set(state) {
      var _this3 = this;

      var id = makeid();
      this._received_messages.push(id);
      this.setState(state, function () {
        _pubsubJs2.default.publish("state", { cmd: "state", id: id, value: _this3.state });
      });
    }
  }, {
    key: "action",
    value: function action(_action) {
      for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      _pubsubJs2.default.publish("action", {
        action: _action,
        params: params
      });
    }
    /* STATE SYNC */
    /* ---------- */

  }]);

  return Sync;
}(_react2.default.Component);

exports.default = Sync;


function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 15; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }return text;
}
