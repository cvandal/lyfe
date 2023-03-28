import { useAuth0 } from "@auth0/auth0-react";
import { Button, Form, Modal } from "react-bootstrap";
import { DeleteDayModalProps } from "../../Interfaces/Day";
import { deleteRecord } from "../../Repository";

function DeleteDayModal({day, show, setShow, reload}: DeleteDayModalProps) {
  const { getAccessTokenSilently } = useAuth0();

  const handleClose = () => setShow(false);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const token = await getAccessTokenSilently();

    await deleteRecord(`http://167.179.146.115:5000/api/day/${day.id}`, token);

    handleClose();
    reload();
  };

  return (
    <Modal show={show} onHide={handleClose} centered={true}>
      <Modal.Body>
        <Modal.Title className="mb-3">Delete Exercise Day</Modal.Title>

        <p>Are you sure you want to delete the exercise day for {day.name}?</p>

        <Form>
          <Form.Group className="d-flex justify-content-end">
            <Button className="btn-cancel me-3" onClick={handleClose}>Close</Button>
            <Button className="btn-submit" onClick={handleDelete} type="submit">Delete</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteDayModal;
