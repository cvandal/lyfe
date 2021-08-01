import React, {Component} from "react";
import {User} from "../interfaces/User";
import {
    Card,
    CardContent,
    CardHeader,
    Typography
} from "@material-ui/core";

interface Props {
    user: User,
}

interface State {}

export default class WeightDifference extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    };

    mostRecentWeight = () => {
        const weights = this.props.user.weights;
        return weights[weights.length - 1];
    }

    weightDifference = () => {
        const mostRecentWeight = this.mostRecentWeight();
        return mostRecentWeight ? mostRecentWeight.currentWeight - mostRecentWeight.goalWeight : 0;
    }

    render () {
        return (
            <div>
                <Card elevation={6}>
                    <CardHeader
                        className="fixed-height-96"
                        title="Weight Difference" />

                    <CardContent className="fixed-height-300">
                        <Typography className="weight-difference" variant="h1">{this.weightDifference()}</Typography>
                    </CardContent>
                </Card>
            </div>
        );
    };
};
