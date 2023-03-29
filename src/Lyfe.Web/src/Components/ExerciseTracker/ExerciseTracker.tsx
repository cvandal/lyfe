import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { Pencil, PlusCircle, Trash3Fill } from "react-bootstrap-icons";
import { daysSortedByName } from "../../Helpers/ExerciseTrackerHelpers";
import { Day } from "../../Interfaces/Day";
import { Exercise, ExerciseTrackerProps } from "../../Interfaces/Exercise";
import { getRecord } from "../../Repository";
import Loading from "../Loading";
import CreateDayModal from "./CreateDayModal";
import DeleteDayModal from "./DeleteDayModal";
import CreateExerciseModal from "./CreateExerciseModal";
import UpdateExerciseModal from "./UpdateExerciseModal";

function ExerciseTracker({
  showCreateDayModal,
  setShowCreateDayModal,
}: ExerciseTrackerProps) {
  const [data, setData] = useState<Day[]>();
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState<Day>();
  const [exercise, setExercise] = useState<Exercise>();
  const [showDeleteDayModal, setShowDeleteDayModal] = useState(false);
  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const handleDeleteDay = (day: Day) => {
    setDay(day);
    setShowDeleteDayModal(true);
  };

  const handleCreateExercise = (day: Day) => {
    setDay(day);
    setShowCreateExerciseModal(true);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setExercise(exercise);
    setShowEditExerciseModal(true);
  };

  const fetchData = useCallback(async () => {
    const token = await getAccessTokenSilently();
    const data = await getRecord("http://167.179.146.115:5000/api/day", token);

    setData(data);
    setLoading(false);
  }, [getAccessTokenSilently]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Row>
          {daysSortedByName(data!).map((day) => (
            <Col md={4} className="mt-4">
              <Card>
                <Card.Body>
                  <Card.Title className="mb-3">
                    {day.name}

                    <OverlayTrigger
                      key="top"
                      placement="top"
                      overlay={
                        <Tooltip className="tooltip" id="top">
                          Delete Day
                        </Tooltip>
                      }
                    >
                      <Button
                        className="btn-trash float-end ms-3"
                        onClick={() => handleDeleteDay(day)}
                      >
                        <Trash3Fill />
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                      key="top"
                      placement="top"
                      overlay={<Tooltip id="top">Add Exercise</Tooltip>}
                    >
                      <Button
                        className="btn-add float-end ms-3"
                        onClick={() => handleCreateExercise(day)}
                      >
                        <PlusCircle />
                      </Button>
                    </OverlayTrigger>
                  </Card.Title>

                  <p>{day.description}</p>

                  <Table className="mb-0" responsive={true}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Weight</th>
                        <th>Reps</th>
                        <th>Sets</th>
                        <th>Edit</th>
                      </tr>
                    </thead>

                    <tbody>
                      {day.exercises
                        ?.sort((a, b) => a.name.localeCompare(b.name))
                        .map((exercise) => (
                          <tr>
                            <td>{exercise.name}</td>
                            <td>{exercise.weight}</td>
                            <td>{exercise.reps}</td>
                            <td>{exercise.sets}</td>
                            <td>
                              <Button
                                className="btn-edit d-flex"
                                onClick={() => handleEditExercise(exercise)}
                              >
                                <Pencil />
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          ))}

          {showCreateDayModal && (
            <CreateDayModal
              show={showCreateDayModal}
              setShow={setShowCreateDayModal}
              reload={fetchData}
            />
          )}
          {showDeleteDayModal && (
            <DeleteDayModal
              day={day!}
              show={showDeleteDayModal}
              setShow={setShowDeleteDayModal}
              reload={fetchData}
            />
          )}
          {showCreateExerciseModal && (
            <CreateExerciseModal
              day={day!}
              show={showCreateExerciseModal}
              setShow={setShowCreateExerciseModal}
              reload={fetchData}
            />
          )}
          {showEditExerciseModal && (
            <UpdateExerciseModal
              exercise={exercise!}
              show={showEditExerciseModal}
              setShow={setShowEditExerciseModal}
              reload={fetchData}
            />
          )}
        </Row>
      )}
    </>
  );
}

export default ExerciseTracker;
