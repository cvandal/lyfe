import React, {Component} from "react";
import {OktaAuth} from "@okta/okta-auth-js";
import {User} from "../interfaces/User";
import {Weight} from "../interfaces/Weight";
import {Post, Put} from "../Repository";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField
} from '@material-ui/core';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import moment from "moment";

interface Props {
    oktaAuth: OktaAuth,
    user: User,
    refreshData: any
}

interface State {
    openWeightDialog: boolean,
    goalWeight: number,
    currentWeight: number,
    weight: null | Weight
}

export default class WeightTracker extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            openWeightDialog: false,
            goalWeight: parseInt(""),
            currentWeight: parseInt(""),
            weight: null
        };
    };

    lineChartData = () => {
        const weights = this.props.user.weights;

        return weights.slice(Math.max(weights.length - 30, 0)).map((w) => ({
            "Name": moment(w.dateTime).format("DD/MM/YYYY"),
            "Goal Weight": w.goalWeight,
            "Weight": w.currentWeight
        }));
    };

    mostRecentWeight = () => {
        const weights = this.props.user.weights;
        return weights[weights.length - 1];
    }

    toggleWeightDialog = () => {
        const mostRecentWeight = this.mostRecentWeight();
        const goalWeight = mostRecentWeight ? mostRecentWeight.goalWeight : 0;

        this.setState({goalWeight: goalWeight});

        this.state.openWeightDialog ?
            this.setState({openWeightDialog: false}) :
            this.setState({openWeightDialog: true});
    };

    handleGoalWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const goalWeight = isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber;

        this.setState({goalWeight: goalWeight});
    };

    handleCurrentWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentWeight = isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber;

        this.setState({currentWeight: currentWeight});
    };

    handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const accessToken = await this.props.oktaAuth.getAccessToken();
        const mostRecentWeight = this.mostRecentWeight();

        if (mostRecentWeight != undefined && moment().isSame(mostRecentWeight.dateTime, "day")) {
            this.setState({
                weight: {
                    id: mostRecentWeight.id,
                    userId: mostRecentWeight.userId,
                    goalWeight: this.state.goalWeight,
                    currentWeight: this.state.currentWeight,
                    dateTime: mostRecentWeight.dateTime
                }
            });

            await Put(`/api/weights/${mostRecentWeight.id}`, accessToken, this.state.weight);
        } else {
            this.setState({
                weight: {
                    userId: this.props.user.id,
                    goalWeight: this.state.goalWeight,
                    currentWeight: this.state.currentWeight,
                    dateTime: moment().toISOString(true)
                }
            });

            await Post(`/api/weights/`, accessToken, this.state.weight);
        }

        this.setState({openWeightDialog: false});

        this.props.refreshData();
    }

    render () {
        return (
            <div>
                <Card elevation={6}>
                    <CardHeader
                        className="fixed-height-96"
                        action={
                            <IconButton color="inherit" onClick={this.toggleWeightDialog}>
                                <FitnessCenterIcon />
                            </IconButton>
                        }
                        title="Weight Tracker"
                    />

                    <CardContent className="fixed-height-300">
                        <ResponsiveContainer>
                            <LineChart data={this.lineChartData()}>
                                <Line type="monotone" dataKey="Goal Weight" stroke="#50fa7b" />
                                <Line type="monotone" dataKey="Weight" stroke="#bd93f9" />
                                <Tooltip
                                    contentStyle={{color: "#f8f8f2", borderColor: "#44475a", backgroundColor: "#282a36"}}
                                    cursor={false}
                                />
                                <XAxis dataKey="Name" stroke="#44475a" interval="preserveStartEnd" />
                                <YAxis hide={true} type="number" domain={[70]} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Dialog open={this.state.openWeightDialog} onClose={this.toggleWeightDialog}>
                    <DialogTitle>Record Weight</DialogTitle>

                    <form noValidate onSubmit={this.handleSubmit}>
                        <DialogContent>
                            <DialogContentText>Please enter your goal weight.</DialogContentText>
                            <TextField
                                type="number"
                                id="goalWeight"
                                name="goalWeight"
                                label="Goal Weight"
                                variant="outlined"
                                required
                                defaultValue={this.state.goalWeight}
                                fullWidth
                                onChange={this.handleGoalWeightChange}
                            />

                            <DialogContentText>Please enter your current weight.</DialogContentText>
                            <TextField
                                type="number"
                                id="currentWeight"
                                name="currentWeight"
                                label="Current Weight"
                                variant="outlined"
                                required
                                fullWidth
                                autoFocus
                                onChange={this.handleCurrentWeightChange}
                            />
                        </DialogContent>

                        <DialogActions>
                            <Button variant="contained" color="primary" onClick={this.toggleWeightDialog}>Cancel</Button>
                            <Button type="submit" variant="contained">Save</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        );
    };
};
