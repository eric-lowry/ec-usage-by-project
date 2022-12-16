import { useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import fetchAPI from '../lib/fetchAPI';

export default function EditTag({ deployment, onClose }) {
  const tagRef = useRef();
  const queryClient = useQueryClient();

  const mutation = useMutation(tag =>
    fetchAPI(`/api/tag/${deployment.id}`, {
      method: 'PUT',
      body: { tag },
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries('period-info');
            onClose();
        }
    }
  );

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    const tag = tagRef.current.value.trim();
    mutation.mutate(tag);
  };

  return (
    <div>
      <Modal show={!!deployment} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <strong>Deployment</strong> {deployment?.name}
          <Form.Group className="mt-3">
            <Form.Label className="fw-bold">Tag</Form.Label>
            <Form.Control
              aria-label="tag value"
              ref={tagRef}
              defaultValue={deployment?.tag || ''}
            />
            <Form.Text className="text-muted">
              An empty value will remove the project tag from the deployment.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <span className="text-danger">
            {mutation.isError ? 'Unable to set tag' : ''}
          </span>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={mutation.isLoading || mutation.isError}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
