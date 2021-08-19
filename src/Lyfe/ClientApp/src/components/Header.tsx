import React, {Component} from "react";
import {OktaAuth} from "@okta/okta-auth-js";
import {
    AppBar,
    Button,
    Divider,
    Drawer,
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
    title: string;
}

interface State {
    openDrawer: boolean
}

export default class Header extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            openDrawer: false
        };
    };

    toggleDrawer = () => {
        this.state.openDrawer ?
            this.setState({openDrawer: false}) :
            this.setState({openDrawer: true});
    };

    render () {
        return (
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <IconButton color="inherit" onClick={this.toggleDrawer}>
                        <MenuIcon />
                    </IconButton>

                    <Drawer anchor="left" open={this.state.openDrawer} onClose={this.toggleDrawer}>
                        <List>
                            <ListItem button component="a" href="/">
                                <ListItemIcon><DashboardIcon color="inherit" /></ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItem>

                            <ListItem button component="a" href="/gallery">
                                <ListItemIcon><PhotoCameraIcon  color="inherit" /></ListItemIcon>
                                <ListItemText primary="Photo Gallery" />
                            </ListItem>
                        </List>

                        <Divider />
                    </Drawer>

                    <Typography className="flex-grow-1" variant="h6" color="inherit">{this.props.title}</Typography>

                    <Button color="inherit" onClick={() => {this.props.oktaAuth.signOut()}}>Logout</Button>
                </Toolbar>
            </AppBar>
        )
    };
};
