import React, {Component} from "react";
import {Route, RouteComponentProps, withRouter} from "react-router";
import {OktaAuth, toRelativeUrl} from "@okta/okta-auth-js";
import {LoginCallback, SecureRoute, Security} from "@okta/okta-react";
import {Layout} from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

import "./style.css"

interface Props extends RouteComponentProps {}

interface State {}

export default withRouter(class App extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    };

    oktaAuth = new OktaAuth({
        issuer: "https://dev-15114775.okta.com/oauth2/default",
        clientId: "0oa1danr8nVU4QUuN5d7",
        redirectUri: window.location.origin + "/login/callback",
        pkce: true
    });

    restoreOriginalUri = async (_oktaAuth: OktaAuth, originalUri: string) => {
        this.props.history.replace(toRelativeUrl(originalUri, window.location.origin));
    };

    onAuthRequired = () => {
        this.props.history.push("/login");
    };

    render () {
        return (
            <Security oktaAuth={this.oktaAuth} restoreOriginalUri={this.restoreOriginalUri} onAuthRequired={this.onAuthRequired}>
                <Layout>
                    <SecureRoute exact path="/">
                        <Dashboard oktaAuth={this.oktaAuth} authState={this.oktaAuth.authStateManager.getAuthState()} />
                    </SecureRoute>
                    <Route path="/login">
                        <Login oktaAuth={this.oktaAuth} authState={this.oktaAuth.authStateManager.getAuthState()} />
                    </Route>
                    <Route path="/login/callback" component={LoginCallback} />
                </Layout>
            </Security>
        );
    };
});
