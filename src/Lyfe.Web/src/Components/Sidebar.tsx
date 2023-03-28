import { useAuth0 } from "@auth0/auth0-react";
import { Nav } from "react-bootstrap";
import {
  CardList,
  GraphDownArrow,
  HouseFill,
  Images,
  PersonFill
} from "react-bootstrap-icons";

interface SidebarProps {
  setShowCreateWeightModal: React.Dispatch<React.SetStateAction<boolean>>,
  setShowCreateDayModal: React.Dispatch<React.SetStateAction<boolean>>
}

function Sidebar({setShowCreateWeightModal, setShowCreateDayModal}: SidebarProps) {
  const { logout } = useAuth0();

  return (
    <Nav className="flex-sm-column justify-content-evenly">
      <Nav.Link href="/"><HouseFill /></Nav.Link>
      <Nav.Link href="#" onClick={() => setShowCreateWeightModal(true)}><GraphDownArrow /></Nav.Link>
      <Nav.Link href="#" onClick={() => setShowCreateDayModal(true)}><CardList /></Nav.Link>
      <Nav.Link href="/gallery"><Images /></Nav.Link>
      <Nav.Link href="#" onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}><PersonFill /></Nav.Link>
    </Nav>
  );
}

export default Sidebar;
