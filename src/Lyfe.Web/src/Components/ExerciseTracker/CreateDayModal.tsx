import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Day, CreateDayModalProps } from "../../Interfaces/Day";
import { postRecord } from "../../Repository";

function CreateDayModal({ show, setShow, reload }: CreateDayModalProps) {
  const [name, setName] = useState("Monday");
  const [description, setDescription] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  const handleClose = () => setShow(false);

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const token = await getAccessTokenSilently();
    const body: Day = {
      name: name,
      description: description,
    };

    await postRecord("http://167.179.146.115:5000/api/day", token, body);

    handleClose();
    reload();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body>
        <Modal.Title className="mb-3">Add Exercise Day</Modal.Title>

        <Form>
          <Form.Group>
            <Form.Label>Day</Form.Label>
            <Form.Select
              className="mb-3"
              onChange={(e) => setName(e.target.value)}
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              className="mb-3"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what type of exercises you'll do on this day"
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

export default CreateDayModal;
