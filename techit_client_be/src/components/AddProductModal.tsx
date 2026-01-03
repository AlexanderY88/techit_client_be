import { FunctionComponent } from "react";
import { Button, Modal } from "react-bootstrap";
import AddProduct from "./AddProduct";

interface AddProductModalProps {
  show: boolean;
  onHide: Function;
}

const AddProductModal: FunctionComponent<AddProductModalProps> = ({
  show,
  onHide,
}) => {
  return (
    <>
      <Modal
        show={show}
        onHide={() => onHide()}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddProduct onHide={() => onHide()} />
        </Modal.Body>
        {/* <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default AddProductModal;
