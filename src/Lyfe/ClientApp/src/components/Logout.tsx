import React, {Component} from "react";
import {OktaAuth} from "@okta/okta-auth-js";
import {
    Typography
} from "@material-ui/core";

interface Props {
    oktaAuth: OktaAuth;
}

interface State {}

export default class Logout extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    };

    componentDidMount() {
        this.props.oktaAuth.signOut();
    };

    render () {
        return (
            <Typography className="loading">Logging out...</Typography>
        );
    };
};
