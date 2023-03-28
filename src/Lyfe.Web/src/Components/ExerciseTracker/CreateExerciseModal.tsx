import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Exercise, CreateExerciseModalProps } from "../../Interfaces/Exercise";
import { postRecord } from "../../Repository";

function CreateExerciseModal({day, show, setShow, reload}: CreateExerciseModalProps) {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(0);

  const { getAccessTokenSilently } = useAuth0();

  const handleClose = () => setShow(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const token = await getAccessTokenSilently();
    const body: Exercise = {
      dayId: day.id!,
      name: name,
      weight: weight,
      reps: reps,
      sets: sets
    };

    await postRecord("http://167.179.146.115:5000/api/exercise", token, body);

    handleClose();
    reload();
  };

  return (
    <Modal show={show} onHide={handleClose} centered={true}>
      <Modal.Body>
        <Modal.Title className="mb-3">Add Exercise</Modal.Title>
        
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              className="mb-3"
              onChange={(e) => setName(e.target.value)}
              placeholder="What is the name of the exercise?"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Weight</Form.Label>
            <Form.Control
              className="mb-3"
              onChange={(e) => setWeight(Number(e.target.value))}
              placeholder="What is the weight used for the exercise?"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Reps</Form.Label>
            <Form.Control
              className="mb-3"
              onChange={(e) => setReps(Number(e.target.value))}
              placeholder="What is the number of reps for the exercise?"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Sets</Form.Label>
            <Form.Control
              className="mb-3"
              onChange={(e) => setSets(Number(e.target.value))}
              placeholder="What is the number of sets for the exercise?"
            />
          </Form.Group>

          <Form.Group className="d-flex justify-content-end">
            <Button className="btn-cancel me-3" onClick={handleClose}>Close</Button>
            <Button className="btn-submit" onClick={handleSubmit} type="submit">Submit</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateExerciseModal;
