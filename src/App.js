import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Amplify from "aws-amplify";
import amplifyConfig from "./amplify-config";
import { SignUpForm } from "./pages/signup-form";
import { SignInForm } from "./pages/signin-form ";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
Amplify.configure(amplifyConfig);

function App() {
  console.log(process.env.REACT_APP_AWSUSER_pools_id);
  return (
    <BrowserRouter>
      <div className="container-fluid">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/sigup">
                Cadastro de Usuario
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/sigin">
                Autenticação
              </Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/sigup">
            <SignUpForm />
          </Route>
          <Route path="/sigin">
            <SignInForm />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
