import { Spinner } from "react-bootstrap";

function Loading() {
  return (
    <span className="loading"><Spinner animation="border" /></span>
  );
}

export default Loading;
