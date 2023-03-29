import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { Button, Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";
import { Exercise, UpdateExerciseModalProps } from "../../Interfaces/Exercise";
import { deleteRecord, patchRecord } from "../../Repository";

function UpdateExerciseModal({
  exercise,
  show,
  setShow,
  reload,
}: UpdateExerciseModalProps) {
  const [name, setName] = useState(exercise.name);
  const [weight, setWeight] = useState(exercise.weight);
  const [reps, setReps] = useState(exercise.reps);
  const [sets, setSets] = useState(exercise.sets);

  const { getAccessTokenSilently } = useAuth0();

  const handleClose = () => setShow(false);

  const handleUpdate = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const token = await getAccessTokenSilently();
    const body: Exercise = {
      id: exercise.id,
      dayId: exercise.dayId,
      name: name,
      weight: weight,
      reps: reps,
      sets: sets,
    };

    await patchRecord(
      `http://167.179.146.115:5000/api/exercise/${exercise.id}`,
      token,
      body
    );

    handleClose();
    reload();
  };

  const handleDelete = async () => {
    const token = await getAccessTokenSilently();

    await deleteRecord(
      `http://167.179.146.115:5000/api/exercise/${exercise.id}`,
      token
    );

    handleClose();
    reload();
  };

  return (
    <Modal show={show} onHide={handleClose} centered={true}>
      <Modal.Body>
        <Modal.Title className="mb-3">
          Update Exercise
          <OverlayTrigger
            key="top"
            placement="top"
            overlay={
              <Tooltip className="tooltip" id="top">
                Delete Exercise
              </Tooltip>
            }
          >
            <Button className="btn-trash float-end" onClick={handleDelete}>
              <Trash3Fill />
            </Button>
          </OverlayTrigger>
        </Modal.Title>

        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              className="mb-3"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What is the name of the exercise?"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Weight</Form.Label>
            <Form.Control
              className="mb-3"
              defaultValue={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              placeholder="What is the weight used for the exercise?"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Reps</Form.Label>
            <Form.Control
              className="mb-3"
              defaultValue={reps}
              onChange={(e) => setReps(Number(e.target.value))}
              placeholder="What is the number of reps for the exercise?"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Sets</Form.Label>
            <Form.Control
              className="mb-3"
              defaultValue={sets}
              onChange={(e) => setSets(Number(e.target.value))}
              placeholder="What is the number of sets for the exercise?"
            />
          </Form.Group>

          <Form.Group className="d-flex justify-content-end">
            <Button className="btn-cancel me-3" onClick={handleClose}>
              Close
            </Button>
            <Button className="btn-submit" onClick={handleUpdate} type="submit">
              Update
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdateExerciseModal;
