import React, { Component } from "react";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";

import store, { history } from "./store";

import SiteMap from "./sitemap";
import LoadingScreen from "./views/components/loadingscreen";

import "./app.css";

class App extends Component {
  updateTitle() {
    const { pathname } = history.location;
    let breadcrumb = pathname.split("/");
    let subtitles = [];

    for (let i = 1; i < breadcrumb.length; i++) {
      breadcrumb[i] && subtitles.push(breadcrumb[i]);
    }

    let subtitle = subtitles.length > 0 ? " | " + subtitles.join(" - ") : "";
    document.title = `MySQL Admin${subtitle}`;
  }

  componentDidMount() {
    this.updateTitle();
    this._unlisten = history.listen(() => this.updateTitle());
  }

  componentWillUnmount() {
    this._unlisten();
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <SiteMap />
        </Router>
        <LoadingScreen />
      </Provider>
    );
  }
}

export default App;
