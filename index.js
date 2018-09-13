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

exports.default = {
  Master: Master,
  Slave: Slave
};

var Master = function (_React$Component) {
  _inherits(Master, _React$Component);

  function Master() {
    _classCallCheck(this, Master);

    var _this = _possibleConstructorReturn(this, (Master.__proto__ || Object.getPrototypeOf(Master)).call(this));

    _this._syncKind = "Master";
    _this.state = {};
    _this.set = _this.set.bind(_this);
    return _this;
  }

  _createClass(Master, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.token = _pubsubJs2.default.subscribe("state", function (msg, _ref) {
        var cmd = _ref.cmd,
            value = _ref.value;

        switch (cmd) {
          case "stateToMaster":
            _this2.setState(value, function () {
              _pubsubJs2.default.publish("state", {
                cmd: "stateToSlaves",
                value: _this2.state
              });
            });
            break;
          case "get":
            _pubsubJs2.default.publish("state", {
              cmd: "stateToSlaves",
              value: _this2.state
            });
            break;
        }
      });
      this.token2 = _pubsubJs2.default.subscribe("action", function (msg, _ref2) {
        var action = _ref2.action,
            params = _ref2.params;

        if (_this2[action]) _this2[action].apply(_this2, _toConsumableArray(params));
      });
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

      this.setState(state, function () {
        _pubsubJs2.default.publish("state", { cmd: "stateToSlaves", value: _this3.state });
      });
    }
  }]);

  return Master;
}(_react2.default.Component);

var Slave = function (_React$Component2) {
  _inherits(Slave, _React$Component2);

  function Slave() {
    _classCallCheck(this, Slave);

    var _this4 = _possibleConstructorReturn(this, (Slave.__proto__ || Object.getPrototypeOf(Slave)).call(this));

    _this4._syncKind = "Slave";
    _this4.state = {};
    _this4.set = _this4.set.bind(_this4);
    _this4.action = _this4.action.bind(_this4);
    return _this4;
  }

  _createClass(Slave, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this5 = this;

      this.token = _pubsubJs2.default.subscribe("state", function (msg, _ref3) {
        var cmd = _ref3.cmd,
            value = _ref3.value;

        switch (cmd) {
          case "stateToSlaves":
            _this5.setState(value);
            break;
        }
      });
      _pubsubJs2.default.publish("state", { cmd: "get" });
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
      _pubsubJs2.default.publish("state", { cmd: "stateToMaster", value: state });
    }
  }, {
    key: "action",
    value: function action(_action) {
      for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      _pubsubJs2.default.publish("action", { action: _action, params: params });
    }
  }]);

  return Slave;
}(_react2.default.Component);
