import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {
  dateFormatter,
  latestRecord,
} from "../../Helpers/WeightTrackerHelpers";
import { CreateWeightModalProps, Weight } from "../../Interfaces/Weight";
import { patchRecord, postRecord } from "../../Repository";

function CreateWeightModal({
  weights,
  show,
  setShow,
  reload,
}: CreateWeightModalProps) {
  const latest = latestRecord(weights)!;

  const [currentWeight, setCurrentWeight] = useState(latest.currentWeight);
  const [goalWeight, setGoalWeight] = useState(latest.goalWeight);

  const { getAccessTokenSilently } = useAuth0();

  const handleClose = () => setShow(false);

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const token = await getAccessTokenSilently();
    const currentDate = new Date();
    const body: Weight = {
      ...(dateFormatter(latest.currentDate) === dateFormatter(currentDate) && {
        id: latest.id,
      }),
      currentDate: currentDate,
      currentWeight: currentWeight,
      goalWeight: goalWeight,
    };
    const url = "http://167.179.146.115:5000/api/weight";
    const requestUrl = body.id ? `${url}/${latest.id}` : url;
    const requestFunction = body.id ? patchRecord : postRecord;

    await requestFunction(requestUrl, token, body);

    handleClose();
    reload();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body>
        <Modal.Title className="mb-3">Record Weight</Modal.Title>

        <Form>
          <Form.Group>
            <Form.Label>Current Weight</Form.Label>
            <Form.Control
              className="mb-3"
              onChange={(e) => setCurrentWeight(Number(e.target.value))}
              placeholder="What is your current weight?"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Goal Weight</Form.Label>
            <Form.Control
              className="mb-3"
              defaultValue={goalWeight}
              onChange={(e) => setGoalWeight(Number(e.target.value))}
              placeholder="What is your goal weight?"
            />
          </Form.Group>

          <Form.Group className="d-flex justify-content-end">
            <Button className="btn-cancel me-3" onClick={handleClose}>
              Close
            </Button>
            <Button className="btn-submit" onClick={handleSubmit} type="submit">
              Submit
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateWeightModal;
