import React, {Component} from "react";
import {CssBaseline} from "@material-ui/core";
import {
    createTheme,
    ThemeProvider
} from "@material-ui/core/styles";

export class Layout extends Component {
    render () {
        // Charade: "#282a36"
        // Gun Powder: "#44475a"
        // White: "#f8f8f2"
        // Waikawa Gray: "#6272a4"
        // Cyan: "#8be9fd"
        // Green: "#50fa7b"
        // Orange: "#ffb86c"
        // Pink: "#ff79c6"
        // Purple: "#bd93f9"
        // Red: "#ff5555"
        // Yellow: "#f1fa8c"

        const theme = createTheme({
            palette: {
                background: {
                    default: "#282a36"
                }
            },
            overrides: {
                MuiAppBar: {
                    colorPrimary: {
                        color: "#282a36",
                        backgroundColor: "#bd93f9"
                    },
                    positionStatic: {
                        marginBottom: 24
                    }
                },
                MuiDrawer: {
                    paper: {
                        color: "#f8f8f2",
                        backgroundColor: "#282a36"
                    }
                },
                MuiPaper: {
                    root: {
                        color: "#f8f8f2",
                        backgroundColor: "#282a36"
                    }
                },
                MuiTypography: {
                    root: {
                        color: "#f8f8f2"
                    }
                },
                MuiListItemIcon: {
                    root: {
                        color: "#f8f8f2"
                    }
                },
                MuiTextField: {
                    root: {
                        marginBottom: 24,
                    }
                },
                MuiOutlinedInput: {
                    root: {
                        "& $notchedOutline": {
                            borderColor: "#bd93f9"
                        },
                        "&:hover $notchedOutline": {
                            borderColor: "#bd93f9"
                        },
                        "&$focused $notchedOutline": {
                            borderColor: "#bd93f9"
                        }
                    }
                },
                MuiInputBase: {
                    root: {
                        color: "#f8f8f2"
                    }
                },
                MuiInputLabel: {
                    outlined: {
                        color: "#f8f8f2",
                        "&$focused": {
                            color: "#f8f8f2"
                        }
                    }
                },
                MuiButton: {
                    contained: {
                        color: "#282a36",
                        backgroundColor: "#bd93f9",
                        "&:hover": {
                            color: "#282a36",
                            backgroundColor: "#bd93f9"
                        }
                    },
                    containedPrimary: {
                        color: "#f8f8f2",
                        backgroundColor: "#44475a",
                        "&:hover": {
                            color: "#f8f8f2",
                            backgroundColor: "#44475a"
                        }
                    },
                    containedSecondary: {
                        color: "#f8f8f2",
                        backgroundColor: "#ff5555",
                        "&:hover": {
                            color: "#f8f8f2",
                            backgroundColor: "#ff5555"
                        }
                    }
                },
                MuiDialog: {
                    paper: {
                        width: 400
                    }
                },
                MuiDialogContentText: {
                    root: {
                        color: "#f8f8f2"
                    }
                },
                MuiTableHead: {
                    root: {
                        backgroundColor: "#bd93f9"
                    }
                },
                MuiTableRow: {
                    root: {
                        "&:nth-of-type(even)": {
                            backgroundColor: "#44475a"
                        }
                    }
                },
                MuiTableCell: {
                    alignCenter: {
                        color: "#f8f8f2",
                        borderBottom: "none"
                    }
                }
            },
        });

        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div>
                    {this.props.children}
                </div>
            </ThemeProvider>
        );
    }
}
