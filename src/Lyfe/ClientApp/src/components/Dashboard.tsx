import React, {Component} from "react";
import {OktaAuth} from "@okta/okta-auth-js"
import {User} from "../interfaces/User";
import {DayOfWeek} from "../interfaces/Exercise";
import Header from "./Header";
import WeightTracker from "./WeightTracker"
import WeightDifference from "./WeightDifference";
import ExerciseTracker from "./ExerciseTracker";
import {Get} from "../Repository";
import {
    Container,
    Grid,
    Typography
} from "@material-ui/core";

interface Props {
    oktaAuth: OktaAuth;
}

interface State {
    user: User
}

export default class Dashboard extends Component<Props, State> {
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

    refreshData = async () => {
        this.loadData();
    }

    render () {
        return this.state.user.id ? (
            <div className="flex-grow-1">
                <Header oktaAuth={this.props.oktaAuth} title={"Dashboard"} />

                <Container maxWidth={false}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={8}>
                            <WeightTracker oktaAuth={this.props.oktaAuth} user={this.state.user} refreshData={this.refreshData} />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <WeightDifference user={this.state.user} />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <ExerciseTracker oktaAuth={this.props.oktaAuth} user={this.state.user} dayOfWeek={DayOfWeek.Monday} refreshData={this.refreshData} />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <ExerciseTracker oktaAuth={this.props.oktaAuth} user={this.state.user} dayOfWeek={DayOfWeek.Tuesday} refreshData={this.refreshData} />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <ExerciseTracker oktaAuth={this.props.oktaAuth} user={this.state.user} dayOfWeek={DayOfWeek.Wednesday} refreshData={this.refreshData} />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <ExerciseTracker oktaAuth={this.props.oktaAuth} user={this.state.user} dayOfWeek={DayOfWeek.Thursday} refreshData={this.refreshData} />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <ExerciseTracker oktaAuth={this.props.oktaAuth} user={this.state.user} dayOfWeek={DayOfWeek.Friday} refreshData={this.refreshData} />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <ExerciseTracker oktaAuth={this.props.oktaAuth} user={this.state.user} dayOfWeek={DayOfWeek.Saturday} refreshData={this.refreshData} />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <ExerciseTracker oktaAuth={this.props.oktaAuth} user={this.state.user} dayOfWeek={DayOfWeek.Sunday} refreshData={this.refreshData} />
                        </Grid>
                    </Grid>
                </Container>
            </div>
        ) : <Typography className="loading">Loading...</Typography>;
    };
};
