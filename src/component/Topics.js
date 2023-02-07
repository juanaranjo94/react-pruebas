import React from "react";
import {

  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";

function Topics() {
    // The `path` lets us build <Route> paths that are
    // relative to the parent route, while the `url` lets
    // us build relative links.
    let { path, url } = useRouteMatch();
  
    return (
        <div className="App">
            <div className="App-header">
            <h2>Topics</h2>
            <ul>
            <li>
                <Link to={`${url}/rendering`}>Rendering with React</Link>
            </li>
            <li>
                <Link to={`${url}/components`}>Components</Link>
            </li>
            <li>
                <Link to={`${url}/props-v-state`}>Props v. State</Link>
            </li>
            </ul>
            </div>
        <Switch>
          <Route exact path={path}>
            <h3>Please select a topic.</h3>
          </Route>
          <Route path={`${path}/:topicId`}>
            <Topic />
          </Route>
        </Switch>
      </div>
    );
  }
  
  function Topic() {

    let { topicId } = useParams();
  
    return (
        <div >
        <h3>{topicId}</h3>
      </div>
    );
  }

export default Topics