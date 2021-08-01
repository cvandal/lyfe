import React, {Component} from "react";
import {OktaAuth} from "@okta/okta-auth-js";
import {User} from "../interfaces/User";
import {DayOfWeek, Exercise} from "../interfaces/Exercise";
import {Post, Put, Delete} from "../Repository";
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';

interface Props {
    oktaAuth: OktaAuth,
    user: User,
    dayOfWeek: DayOfWeek,
    refreshData: any
}

interface State {
    openExerciseDialog: boolean,
    isExistingExercise: boolean,
    dialogTitle: string,
    showDeleteButton: boolean,
    name: string,
    weight: null | number,
    reps: null | number,
    sets: null | number,
    exercise: Exercise
}

const initialState = {
    openExerciseDialog: false,
    isExistingExercise: false,
    dialogTitle: "",
    showDeleteButton: false,
    name: "",
    weight: null,
    reps: null,
    sets: null,
    exercise: {
        userId: "",
        name: "",
        weight: null,
        reps: null,
        sets: null,
        dayOfWeek: null
    }
}

export default class ExerciseTracker extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = initialState;
    };

    toggleExerciseDialog = (isExistingExercise: boolean, dialogTitle: string, exercise: Exercise, showDeleteButton: boolean) => {
        this.setState({
            isExistingExercise: isExistingExercise,
            dialogTitle: dialogTitle,
            exercise: exercise,
            showDeleteButton: showDeleteButton
        });

        this.state.openExerciseDialog ?
            this.setState({openExerciseDialog: false}) :
            this.setState({openExerciseDialog: true});
    };

    handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({name: e.target.value});
    };

    handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({weight: e.target.valueAsNumber});
    };

    handleRepsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({reps: e.target.valueAsNumber});
    };

    handleSetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({sets: e.target.valueAsNumber});
    };

    handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const accessToken = await this.props.oktaAuth.getAccessToken();

        if (this.state.isExistingExercise) {
            this.setState({
                exercise: {
                    id: this.state.exercise.id,
                    userId: this.state.exercise.userId,
                    name: this.state.name ? this.state.name : this.state.exercise.name,
                    weight: this.state.weight ? this.state.weight : this.state.exercise.weight,
                    reps: this.state.reps ? this.state.reps : this.state.exercise.reps,
                    sets: this.state.sets ? this.state.sets : this.state.exercise.sets,
                    dayOfWeek: this.state.exercise.dayOfWeek
                }
            });

            await Put(`/api/exercises/${this.state.exercise.id}`, accessToken, this.state.exercise);
        } else {
            this.setState({
                exercise: {
                    userId: this.props.user.id,
                    name: this.state.name,
                    weight: this.state.weight,
                    reps: this.state.reps,
                    sets: this.state.sets,
                    dayOfWeek: this.props.dayOfWeek
                }
            });

            await Post(`/api/exercises/`, accessToken, this.state.exercise);
        }

        this.setState(initialState);

        this.props.refreshData();
    };

    deleteExercise = async (exercise: Exercise) => {
        const accessToken = await this.props.oktaAuth.getAccessToken();

        await Delete(`/api/exercises/${exercise.id}`, accessToken)

        this.setState(initialState);

        this.props.refreshData();
    };

    render () {
        return (
            <div>
                <Card elevation={6}>
                    <CardHeader
                        action={
                            <IconButton color="inherit" onClick={() => this.toggleExerciseDialog(false, "Add Exercise", this.state.exercise, false)}>
                                <FitnessCenterIcon />
                            </IconButton>
                        }
                        title={DayOfWeek[this.props.dayOfWeek]} />

                    <CardContent>
                        {this.props.user.exercises.some((e) => e.dayOfWeek === this.props.dayOfWeek) ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align={"center"} style={{color: "#282a36"}}>Exercise</TableCell>
                                            <TableCell align={"center"} style={{color: "#282a36"}}>Weight</TableCell>
                                            <TableCell align={"center"} style={{color: "#282a36"}}>Reps</TableCell>
                                            <TableCell align={"center"} style={{color: "#282a36"}}>Sets</TableCell>
                                            <TableCell align={"center"} style={{color: "#282a36"}}>Edit</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {this.props.user.exercises
                                            .filter((e) => e.dayOfWeek === this.props.dayOfWeek)
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map((e) => (
                                                <TableRow key={e.name}>
                                                    <TableCell align={"center"}>{e.name}</TableCell>
                                                    <TableCell align={"center"}>{e.weight}</TableCell>
                                                    <TableCell align={"center"}>{e.reps}</TableCell>
                                                    <TableCell align={"center"}>{e.sets}</TableCell>
                                                    <TableCell align={"center"}>
                                                        <Button
                                                            color={"inherit"}
                                                            onClick={() => this.toggleExerciseDialog(true, "Edit Exercise", e, true)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography>Rest Day</Typography>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={this.state.openExerciseDialog} onClose={() => this.setState(initialState)}>
                    <DialogTitle>{this.state.dialogTitle}</DialogTitle>

                    <form noValidate onSubmit={this.handleSubmit}>
                        <DialogContent>
                            <DialogContentText>Please enter the name for this exercise.</DialogContentText>
                            <TextField
                                type="text"
                                id="name"
                                name="name"
                                label="Name"
                                variant="outlined"
                                required
                                defaultValue={this.state.exercise.name}
                                fullWidth
                                autoFocus
                                onChange={this.handleNameChange}
                            />

                            <DialogContentText>Please enter the weight for this exercise.</DialogContentText>
                            <TextField
                                type="number"
                                id="weight"
                                name="weight"
                                label="Weight"
                                variant="outlined"
                                required
                                defaultValue={this.state.exercise.weight}
                                fullWidth
                                onChange={this.handleWeightChange}
                            />

                            <DialogContentText>Please enter the number of reps for this exercise.</DialogContentText>
                            <TextField
                                type="number"
                                id="reps"
                                name="reps"
                                label="Reps"
                                variant="outlined"
                                required
                                defaultValue={this.state.exercise.reps}
                                fullWidth
                                onChange={this.handleRepsChange}
                            />

                            <DialogContentText>Please enter the number of sets for this exercise.</DialogContentText>
                            <TextField
                                type="number"
                                id="sets"
                                name="sets"
                                label="Sets"
                                variant="outlined"
                                required
                                defaultValue={this.state.exercise.sets}
                                fullWidth
                                onChange={this.handleSetsChange}
                            />
                        </DialogContent>

                        <DialogActions>
                            {this.state.showDeleteButton ? (<Button variant="contained" color="secondary" onClick={() => this.deleteExercise(this.state.exercise)}>Delete</Button>) : null}
                            <Button variant="contained" color="primary" onClick={() => this.setState(initialState)}>Cancel</Button>
                            <Button type="submit" variant="contained">Save</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        );
    };
};
