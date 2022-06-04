import React, { Component } from 'react';
import { Auth, Cache } from 'aws-amplify';

export class SignInForm extends Component {
    state = {
        username: '',
        password: '',
        signedIn: false,
        isSigningIn: false,
        isSigningOut: false,
        tokenId: '',
        refreshToken: '',
        fullName: '',
        email: '',
    }

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { signedIn, username, password } = this.state;

        if (!signedIn) {
            this.setState({ isSigningIn: true });
            Auth.signIn({
                username,
                password
            }).then((cognitoUser) => {
                console.log('Signed In!');
                console.log("CognitoUser:");
                console.log(cognitoUser);

                Auth.currentSession()
                .then((userSession) => {
                    console.log("Got user currentSession:");
                    console.log(userSession);
                    console.log(userSession.get);
                    this.setState({ 
                        signedIn: true, 
                        isSigningIn: false,
                        tokenId: userSession.idToken.jwtToken,
                        refreshToken: userSession.refreshToken.token
                    });
                })
                .catch((err) => {
                    this.setState({ isSigningIn: false });
                    console.log(err)
                });

                Auth.currentUserInfo()
                .then((user) => {
                    console.log("Got user infooooo!");
                    console.log(user);
                    this.setState({ 
                        fullName: user.attributes.name,
                        email: user.attributes.email
                    });
            });

            }).catch((err) => {
                this.setState({ isSigningIn: false });
                console.log(err)
            });
        }
    }

    changeAuthStorageConfiguration(e) {
        const shouldRememberUser = e.target.checked;
        if (shouldRememberUser) {
            const localStorageCache = Cache.createInstance({
                keyPrefix: "localStorageAuthCache",
                storage: window.localStorage
            });

            Auth.configure({
                storage: localStorageCache
            });
        } else {
            const sessionStorageCache = Cache.createInstance({
                keyPrefix: "sessionAuthCache",
                storage: window.sessionStorage
            });

            Auth.configure({
                storage: sessionStorageCache
            });
        }
    }

    handleLogout() {
        if (this.state.signedIn) {
            this.setState({ isSigningOut: true });
            Auth.signOut()
                .then((data) => {
                    this.setState({ 
                        signedIn: false, 
                        isSigningOut: false,
                        tokenId: '',
                        refreshToken: ''
                    });
                    console.log(data);
                })
                .catch((err) => {
                    this.setState({ isSigningOut: false });
                    console.log(err);
                });
        }
    }

    componentDidMount() {
        this.setState({ isSigningIn: true });
        Auth.currentSession()
            .then((userSession) => {
                console.log("Got user currentSession!");
                console.log(userSession);
                this.setState({ 
                    signedIn: true, 
                    isSigningIn: false,
                    tokenId: userSession.idToken.jwtToken,
                    refreshToken: userSession.refreshToken.token
                    
                });
            })
            .catch((err) => {
                this.setState({ isSigningIn: false });
                console.log(err)
            });

        Auth.currentUserInfo()
            .then((user) => {
                console.log("Got user infooooo!");
                console.log(user);
                this.setState({ 
                    fullName: user.attributes.name,
                    email: user.attributes.email
                });

            });

        
    }

    render() {
        if (this.state.signedIn) {
            return (<div>
                <div><b>Your tokenId:</b></div><div>{this.state.tokenId}</div>
                <div><b>Your refreshToken:</b></div><div>{this.state.refreshToken}</div>

                <div><b>Your fullName Attributes:</b></div><div>{this.state.fullName}</div>
                <div><b>Your email Attributes:</b></div><div>{this.state.email}</div>
                <br></br>
                <button className="btn-toggle" onClick={this.handleLogout} className="btn btn-danger">Sair</button>
            </div>)
        }

        return (<form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label htmlFor="usernameSignInInput">Username</label>
                <input className="form-control" type="text" name="username" id="usernameSignInInput" onChange={ this.handleChange } />
            </div>
            <div className="form-group">
                <label htmlFor="passwordSignInInput">Senha</label>
                <input className="form-control" type="password" name="password" id="passwordSignInInput" onChange={ this.handleChange } />
            </div>
            <div className="form-group form-check">
                <input defaultChecked type="checkbox" className="form-check-input" id="rememberMeSignInInput" onChange={this.changeAuthStorageConfiguration} />
                <label className="form-check-label" htmlFor="rememberMeSignInInput">Lembrar-se de mim</label>
            </div>
            <button disabled={this.state.isSigningIn} type="submit" className="btn btn-primary">Entrar</button>
        </form>)
    }
}