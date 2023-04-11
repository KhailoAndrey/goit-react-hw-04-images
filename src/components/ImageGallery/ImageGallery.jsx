import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ImageGalleryItem from 'components/ImageGalleryItem/ImageGalleryItem';
import { getImages } from 'services/fetch';
import { ImageGalleryList } from './ImageGallery.styled';
import { Loader } from 'components/Loader/Loader';
import { Modal } from 'components/Modal/Modal';
import { LoadMoreBtn } from 'components/Button/Button';
import { toast } from 'react-hot-toast';

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};
export default function ImageGallery({ searchText }) {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [isShowModal, setIsShowModal] = useState(false);
  const [largeImgURL, setLargeImgURL] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadMore, setIsLoadMore] = useState(true);
  const prevSearchText = useRef('');

  const closeModal = () => {
    setIsShowModal(false);
  };

  // useEffect(() => {
  //   setCurrentPage(1);
  //   // setImages([]);
  // }, [searchText]);

  useEffect(() => {
    if (prevSearchText.current !== searchText) setCurrentPage(1);
    if (searchText) {
      setStatus(STATUS.PENDING);
      setIsLoadMore(true);
      getImages(searchText, currentPage)
        .then(data => {
          if (data.totalHits === 0) {
            setStatus(STATUS.RESOLVED);
            setIsLoadMore(false);
            toast.error('Ничего не найдено. Попробуйте изменить запрос.', {
              position: 'top-center',
              duration: 1500,
            });
          } else if (Math.floor(data.totalHits / currentPage) < 12) {
            setStatus(STATUS.RESOLVED);
            setIsLoadMore(false);
            toast.success('Больше картинок не найдено.', {
              position: 'top-center',
              duration: 1500,
            });
          }
          if (data.status === 'error') {
            return Promise.reject(data.message);
          }
          const imageArr = data.hits.map(
            ({ id, tags, webformatURL, largeImageURL }) => ({
              id,
              tags,
              webformatURL,
              largeImageURL,
            })
          );
          if (currentPage !== 1) {
            setImages(prev => [...prev, ...imageArr]);
          } else {
            setImages(imageArr);
          }
          setStatus(STATUS.RESOLVED);
        })
        .catch(() => {
          setStatus(STATUS.REJECTED);
        });
    }
    prevSearchText.current = searchText;
  }, [searchText, currentPage]);

  const loadMoreBtn = () => {
    setCurrentPage(prev => prev + 1);
  };

  const imageClick = e => {
    const imageId = e.target.id;
    const index = images.findIndex(
      image => Number(image.id) === Number(imageId)
    );
    const largeImage = images[index].largeImageURL;
    setLargeImgURL(largeImage);
    setIsShowModal(true);
  };

  return (
    <>
      {status === STATUS.PENDING && currentPage === 1 && <Loader />}
      {isShowModal && (
        <Modal largeImageURL={largeImgURL} closeModal={closeModal} />
      )}
      {images.length > 0 && (
        <>
          <ImageGalleryList onClick={e => imageClick(e)}>
            {images.map(image => {
              return (
                <ImageGalleryItem
                  webformatURL={image.webformatURL}
                  key={image.id}
                  id={image.id}
                  tags={image.tags}
                />
              );
            })}
          </ImageGalleryList>
          {status === STATUS.RESOLVED && isLoadMore && (
            <LoadMoreBtn onClick={loadMoreBtn} />
          )}
          {status === STATUS.PENDING && <Loader />}
        </>
      )}
      {status === STATUS.REJECTED &&
        toast.error('Что-то пошло не так ...', {
          position: 'top-center',
          duration: 2000,
        })}
    </>
  );
}

ImageGallery.propTypes = {
  searchText: PropTypes.string.isRequired,
};
