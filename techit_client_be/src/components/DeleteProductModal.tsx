import { FunctionComponent } from "react";
import { Button, Modal } from "react-bootstrap";
import { deleteProduct } from "../services/productsService";

interface DeleteProductModalProps {
  show: boolean;
  onHide: Function;
  productId: string;
}

const DeleteProductModal: FunctionComponent<DeleteProductModalProps> = ({
  show,
  onHide,
  productId,
}) => {
  return (
    <>
      <Modal show={show} onHide={() => onHide()}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are your sure?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              deleteProduct(productId)
                .then(() => {
                  onHide();
                })
                .catch((err) => console.log(err));
            }}
          >
            Yes
          </Button>
          <Button variant="secondary" onClick={() => onHide()}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteProductModal;
