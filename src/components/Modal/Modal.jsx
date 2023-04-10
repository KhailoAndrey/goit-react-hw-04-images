import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { DivModal, Overlay } from './Modal.styled';

export function Modal({ largeImageURL, closeModal }) {
  useEffect(() => {
    const handlePressESC = e => {
      if (e.code === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handlePressESC);
    return () => {
      window.removeEventListener('keydown', handlePressESC);
    };
  }, [closeModal]);

  // export class Modal extends Component {
  //   componentDidMount() {
  //     window.addEventListener('keydown', this.handlePressESC);
  //   }
  const handleOverlayClick = e => {
    if (e.currentTarget === e.target) {
      closeModal();
    }
  };
  //   componentWillUnmount() {
  //     window.removeEventListener('keydown', this.handlePressESC);
  //   }
  //   render() {
  return (
    <Overlay onClick={handleOverlayClick}>
      <DivModal>
        <img src={largeImageURL} alt="large_photo" />
      </DivModal>
    </Overlay>
  );
}
// }
// }

Modal.propTypes = {
  largeImageURL: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};
