import React, {Component} from "react";
import {AuthState, OktaAuth} from "@okta/okta-auth-js";
import {User} from "../interfaces/User";
import {DayOfWeek} from "../interfaces/Exercise";
import WeightTracker from "./WeightTracker"
import WeightDifference from "./WeightDifference";
import ExerciseTracker from "./ExerciseTracker";
import {Get} from "../Repository";
import {
    AppBar,
    Button,
    Container,
    Divider,
    Drawer,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/Dashboard";
import MenuIcon from "@material-ui/icons/Menu";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";

interface Props {
    oktaAuth: OktaAuth;
    authState: AuthState;
}

interface State {
    user: User,
    openDrawer: boolean
}

export default class Dashboard extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            user: {
                id: "",
                username: "",
                weights: [],
                exercises: []
            },
            openDrawer: false
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

    toggleDrawer = () => {
        this.state.openDrawer ?
            this.setState({openDrawer: false}) :
            this.setState({openDrawer: true});
    };

    render () {
        return this.state.user.id ? (
            <div className="flex-grow-1">
                <AppBar position="static" elevation={0}>
                    <Toolbar>
                        <IconButton color="inherit" onClick={this.toggleDrawer}>
                            <MenuIcon />
                        </IconButton>

                        <Drawer anchor="left" open={this.state.openDrawer} onClose={this.toggleDrawer}>
                            <List>
                                <ListItem button>
                                    <ListItemIcon><DashboardIcon color="inherit" /></ListItemIcon>
                                    <ListItemText primary="Dashboard" />
                                </ListItem>
                                <ListItem button>
                                    <ListItemIcon><PhotoCameraIcon  color="inherit" /></ListItemIcon>
                                    <ListItemText primary="Photo Gallery (Coming Soon)" />
                                </ListItem>
                            </List>

                            <Divider />
                        </Drawer>

                        <Typography className="flex-grow-1" variant="h6" color="inherit">Dashboard</Typography>

                        <Button color="inherit" onClick={() => {this.props.oktaAuth.signOut()}}>Logout</Button>
                    </Toolbar>
                </AppBar>

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
        ): <Typography className="loading">Logging in...</Typography>;
    };
};
