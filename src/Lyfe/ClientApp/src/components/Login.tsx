import React, {Component} from "react";
import {AuthState, OktaAuth} from "@okta/okta-auth-js";
import {
    Button,
    Container,
    TextField,
    Typography
} from "@material-ui/core";

interface Props {
    oktaAuth: OktaAuth;
    authState: AuthState;
}

interface State {
    sessionToken?: string,
    username: string,
    password: string
}

export default class Login extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            sessionToken: "",
            username: "",
            password: ""
        };
    };

    handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({username: e.target.value});
    };

    handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({password: e.target.value});
    };

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        this.props.oktaAuth.signInWithCredentials({
            username: this.state.username,
            password: this.state.password
        })
        .then(res => {
            const sessionToken = res.sessionToken;

            // @ts-ignore
            this.setState({sessionToken}, () => this.props.oktaAuth.signInWithRedirect({sessionToken}));
        })
        .catch(err => console.log("Error: ", err));
    };

    render () {
        if (!this.props.authState) {
            return <Typography className="logging-in">Logging in...</Typography>;
        }

        return (
            <Container maxWidth="xs">
                <form onSubmit={this.handleSubmit}>
                    <img className="logo" src={"images/logo.png"} alt="Lyfe" />

                    <TextField
                        type="text"
                        id="username"
                        name="username"
                        label="Username"
                        variant="outlined"
                        required
                        fullWidth
                        autoFocus
                        onChange={this.handleUsernameChange}
                    />

                    <TextField
                        type="password"
                        id="password"
                        name="password"
                        label="Password"
                        variant="outlined"
                        required
                        fullWidth
                        onChange={this.handlePasswordChange}
                    />

                    <Button type="submit" variant="contained" fullWidth>Login</Button>
                </form>
            </Container>
        );
    };
};
