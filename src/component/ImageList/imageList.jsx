// import material ui component
import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// import cutom module style in css
import imageListStyle from './imageList.module.css'

// import react functions
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Spinner from 'react-spinner-material';

// custome compoent
import ImageForm from '../ImageForm/imageForm';
import Carousel from '../Carousel/carousel';

// import fiber db functions
import {getDocs, 
  collection, 
  addDoc, 
  deleteDoc, 
  setDoc, 
  Timestamp, 
  query, 
  orderBy, 
  doc,
  getDoc} from 'firebase/firestore';
import db from '../../../firebase/firebaseConfig';

// store images in local variable
let IMAGES;

export default function ImageList(props) {
  // extract state and hnadler
  const {albumId, albumName, onBack} = props;

  // define state for images
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchIntent, setSearchIntent] = useState(false);
  const [addImageIntent, setAddImageIntent] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [updateImageIntent, setUpdateImageIntent] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [activeHoverImageIndex, setActiveHoverImageIndex] = useState(null);
  const searchInput = useRef()

  // useEffect()
  useEffect(() => {
    getImages();
  }, [])

  // ++++++++++++++++++++++++ Logic ++++++++++++++++++++++++++++++++++++++

  // get images from firebase
  const getImages = async () => {
    setLoading(true) // change the state for loading/fetching 

    // get the document reference
    const imagesRef = collection(db, "albums", albumId, "images");
    const imagesSnapshot = await getDocs(
      query(imagesRef, orderBy("created", "desc"))
    );

    // setImages to state
    const imagesData = imagesSnapshot.docs.map((doc) => ({
      id:doc.id,
      ...doc.data()
    }));
    setImages(imagesData);

    IMAGES = imagesData;

    setLoading(false) // change the state of set loading
  }

  // handler for next
  const handleNext = () => {
    if (activeImageIndex === images.length - 1) {
      return setActiveImageIndex(0);
    };

    setActiveImageIndex((prev) => (prev + 1));
  };

  // hanlder for previous
  const handlePrev = () =>{
    if (activeImageIndex === 0) {
      return setActiveImageIndex(images.length - 1);
    };
    setActiveImageIndex((prev) => (prev + 1));
  };

  // handler for search click
  const handleSearchClick = () =>{
    if (searchIntent) {
      searchInput.current.value = '';
      getImages();
    };
    setSearchIntent(!searchIntent);
  };

  // handler for searching images
  const handleSearch = () => {
    const userSearchQuery = searchInput.current.value;
    if(!userSearchQuery){
      return IMAGES;
    };

    // filter imagees title based on userSearchQuery
    const filterImages = IMAGES.filter((i) => i.imgTitle.includes(userSearchQuery));
    setImages(filterImages);
  };

  // handler for image add to firebase
  const handleAdd = async ({imgTitle, imgUrl}) => {
    setImageLoading(true);
    const imageRef = await addDoc(collection(db, "albums", albumId, "images"), {
      imgTitle,
      imgUrl,
      created: Timestamp.now()
    });

    // set images
    setImages((prev) => ([{id:imageRef.id, imgTitle, imgUrl}, ...prev]));

    toast.success("Image Added Suceessfully.");
    setImageLoading(false); // change the state of setImageLoading
  };

  // handler for cancel
  const handleCancel = () => (setActiveImageIndex(null));

  // handler for update image
  const handleUpdate = async ({imgTitle, imgUrl}) => {
    setImageLoading(true);  // change the state of the setImageLoading

    const imageRef = doc(db, "albums", albumId, "images", updateImageIntent.id);
    await setDoc(imageRef, {imgTitle, imgUrl});
    
    // update image
    const updatedImage = images.map((image) => {
      if (image.id === imageRef.id) {
        return {id: imageRef.id, imgTitle, imgUrl};
      };

      return image;
    });

    // set images
    setImages(updatedImage);
    toast.success("Image updated successfully.");
    setImageLoading(false);
    setUpdateImageIntent(false);
  };

  // handler for delete
  const handleDelete = async(e, id) => {
    e.stopPropagation();
    await deleteDoc(doc(db, "album", albumId, "images", id));
    const filteredImages = images.filter((i) => i.id !== id);
    setImages(filteredImages);
    toast.success("Image deleted successfully.");
  };

  // ++++++++++++++++++++++++ UI ++++++++++++++++++++++++++++++++++++++
  if (!images.length && !searchInput.current?.value && !loading) {
    return (
      <>
        <div className={imageListStyle.top}>
          <span onClick={onBack}>
            <img src="./back.png" alt="back" />
          </span>
          <h3>No images found in the album.</h3>

          <Button 
              variant="contained" 
              onClick={() => setAddImageIntent(!addImageIntent)}
          >
            {!addImageIntent ? "Add Image" : "Cancel"}
          </Button>
        </div>

        {
          addImageIntent && (
            <ImageForm
              loading={imageLoading}
              onAdd={handleAdd}
              albumName={albumName}
            />
          )
        }
      </>
    )
  }

  return (
    <>
      {(addImageIntent || updateImageIntent) && (
        <ImageForm
          loading={imageLoading}
          onAdd={handleAdd}
          albumName={albumName}
          onUpdate={handleUpdate}
          updateIntent={updateImageIntent}
        />
      )}

      {(activeImageIndex || activeImageIndex === 0) && (
        <Carousel
          title={images[activeImageIndex].imgTitle}
          url={images[activeImageIndex].imgUrl}
          onNext={handleNext}
          onPrev={handlePrev}
          onCancel={handleCancel}
        />
      )}

      <div className={imageListStyle.top}>
        <span onClick={onBack}>
          <img src="./back.png" alt="backward" />
        </span>
        <h3>Images in {albumName}</h3>

        <div className={imageListStyle.search}>
          {
            searchIntent && (
              <input
                placeholder='Search...'
                onChange={handleSearch}
                ref={searchInput}
                autoFocus={true}
              />
            )
          }

          <img 
            src={!searchIntent ? "./search.png" : "./clear.png"} 
            alt="search" 
            onClick={handleSearchClick}  
          />
        </div>

        {
          updateImageIntent && (
            <button 
              className='active'
              onClick={() => setUpdateImageIntent(false)}
            >
              Cancel 
            </button>
          )
        }

        {
          !updateImageIntent && (
            <button
              onClick={()=>setAddImageIntent(!addImageIntent)}
            >
              {!addImageIntent ? "Add Image" : "Cancel"}
            </button>    
          )
        }
      </div>


      {loading && (
        <div className={imageListStyle.loader}>
          <Spinner color='blue'/>
        </div>
      )}

      {/* {
        !loading && (
          <div className={imageListStyle.imageList}>
            {images.map((image, index) => (
              <div
                className={imageListStyle.image}
                key={image.id}
                onMouseOver={()=> setActiveHoverImageIndex(index)}
                onMouseOut={()=> setActiveHoverImageIndex(null)}
                onClick={()=> setActiveImageIndex(index)}
              >
                <div
                  className={`${imageListStyle.update} ${
                    activeHoverImageIndex === index && imageListStyle.active
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setUpdateImageIntent(image)
                  }}
                >
                  <img src="./edit.png" alt="Update" />
                </div>

                <div
                  className={`${imageListStyle.delete} ${
                    activeHoverImageIndex === index && imageListStyle.active
                  }`}
                  onClick={(e)=> handleDelete(e, image.id)}
                >
                  <img src="./delete.png" alt="delete" />
                </div>

                <img 
                  src={image.imgUrl} 
                  alt={image.imgTitle} 
                  onError={({currentTarget}) => {
                    currentTarget.src = './warning.png'
                  }}
                />
                
                <span>{image.imgTitle}</span>
              </div>
            ))}
          </div>
        )
      } */} 

      {
        !loading && (
          <Stack
            direction='row' 
            className={imageListStyle.imageList}
          >
            {images.map((image, index) => (
              
                <div
                  className={imageListStyle.image}
                  key={image.id}
                  onMouseOver={()=> setActiveHoverImageIndex(index)}
                  onMouseOut={()=> setActiveHoverImageIndex(null)}
                  onClick={()=> setActiveImageIndex(index)}
                >
                  <div
                    className={`${imageListStyle.update} ${
                      activeHoverImageIndex === index && imageListStyle.active
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setUpdateImageIntent(image)
                    }}
                  >
                    <img src="./edit.png" alt="Update" />
                  </div>

                  <div
                    className={`${imageListStyle.delete} ${
                      activeHoverImageIndex === index && imageListStyle.active
                    }`}
                    onClick={(e)=> handleDelete(e, image.id)}
                  >
                    <img src="./delete.png" alt="delete" />
                  </div>

                  <img 
                    src={image.imgUrl} 
                    alt={image.imgTitle} 
                    onError={({currentTarget}) => {
                      currentTarget.src = './warning.png'
                    }}
                  />
                  
                  <span>{image.imgTitle}</span>
                </div>
              
            ))}
          </Stack>
        )
      }
    </>
  )
}
