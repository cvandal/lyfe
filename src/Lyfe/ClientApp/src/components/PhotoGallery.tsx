import React, {Component} from "react";
import {OktaAuth} from "@okta/okta-auth-js";
import {User} from "../interfaces/User";
import {Get, Post, Put} from "../Repository";
import Header from "./Header";
import {
    IconButton,
    Card,
    CardContent,
    Container,
    Grid,
    Typography
} from "@material-ui/core";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

interface Props {
    oktaAuth: OktaAuth;
}

interface State {
    user: User
}

export default class PhotoGallery extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            user: {
                id: "",
                givenName: "",
                familyName: "",
                weights: [],
                exercises: []
            }
        };
    };

    componentDidMount() {
        this.loadData();
    };

    loadData = async () => {
        const accessToken = await this.props.oktaAuth.getAccessToken();
        const userFromOkta = await this.props.oktaAuth.getUser();
        const userFromLyfe = await Get(`/api/users/${userFromOkta.sub}`, accessToken);

        this.setState({user: userFromLyfe});
    };

    onChange = async (e: any) => {
    };

    render () {
        return this.state.user.id ? (
            <div className="flex-grow-1">
                <Header oktaAuth={this.props.oktaAuth} title={"Gallery"} />

                <Container maxWidth={false}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={3}>
                            <Card elevation={6}>
                                <CardContent>
                                    <input type="file" id="upload-photos" hidden onChange={this.onChange} />
                                    <label className={"upload-photos"} htmlFor="upload-photos">
                                        <IconButton component="span">
                                            <AddCircleOutlineIcon color={"secondary"} />
                                        </IconButton>
                                    </label>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        ) : <Typography className="loading">Loading...</Typography>;
    };
};
