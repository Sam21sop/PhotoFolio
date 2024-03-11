// import from react
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Spinner from 'react-spinner-material';

// import custom style
import albumListStyle from './albumList.module.css';

// material UI
import {Button } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CancelIcon from '@mui/icons-material/Cancel';

// firebase imports 
import {addDoc, collection, Timestamp, query, orderBy, getDocs} from "firebase/firestore";
import db from '../../../firebase/firebaseConfig';

// import custom component
import AlbumForm from '../AlbumForm/albumForm';
import ImageList from '../ImageList/imageList'

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


export default function AlbumList(){
    // define required state
    const [albums, setAlbum] = useState([]);
    const [loading, setLoading] = useState(false);
    const [albumAddLoading, setAlbumAddLoading] = useState(false);
    const [createAlbumIntent, setCreateAlbumIntent] = useState(false);
    const [activeAlbum, setActiveAlbum] = useState(null);

    // useEffect for fetching data from firebase
    useEffect(() => {
        getAlbums();
    }, []);

    // fetch all album from firebase db
    const getAlbums = async () => {
        setLoading(true);  // change loading state

        // get the collection ref
        const albumRef = collection(db, "albums");
        
        // get specific document
        const albumSnapshot = await getDocs(
            query(albumRef, orderBy("created", "desc"))
        );
        
        // store document data in a object(array type)
        const albumData = albumSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        // seting album to state
        setAlbum(albumData)

        setLoading(false) // change the loading state
    };

    // adding folder/album to db
    const addAlbum = async (name) => {
        // check whether name is present or not
        if(albums.find((a) => (a.name === name))){
            return toast.error("Album name already in use.")
        };

        setAlbumAddLoading(true) // change state for adding new album

        // get the album ref from collection
        const albumRef = await addDoc(collection(db, 'albums'), {
            name, 
            created: Timestamp.now()
        });

        // set state for newly created album
        setAlbum((prev) => [{id:albumRef.id, name}, ...prev]);

        setAlbumAddLoading(false) // change state to initial state

        // notify user
        toast.success("Album added successfully.");
    };

    // hadling click to specific album
    const handleClick = (name) => {
        if(activeAlbum === name){
            return setActiveAlbum(null);
        };
        setActiveAlbum(name);
    };

    // handle back by a step
    const handleBack = () => (setActiveAlbum(null))

    // conditionally rendering
    if (albums.length === 0 && !loading) {
        return (
            <>
                <div className={albumListStyle.top}>
                    <h3>No albums found.</h3>
                    <Button 
                        variant="contained" 
                        startIcon={!createAlbumIntent ? <CreateNewFolderIcon /> : <CancelIcon />}
                        onClick={() => (setCreateAlbumIntent(!createAlbumIntent))}
                    >
                        {!createAlbumIntent ? "Add Album" : "Cancel"}
                    </Button>
                </div>
                {createAlbumIntent && <AlbumForm onAdd={addAlbum} />}
            </>
        );
    };

    if (loading) {
        return(
            <div className={albumListStyle.loader}>
                <Spinner color='#0077ff' />
            </div>
        )
    }

    return (
        <>
            {
                createAlbumIntent && !activeAlbum && (
                    <AlbumForm 
                        loading={albumAddLoading} 
                        onAdd={addAlbum}
                    />
                )
            }

            {
                !activeAlbum && (
                    <div>
                        <div className={albumListStyle.top}>
                            <h3>Your Albums</h3>
                            <Button 
                                variant="contained" 
                                startIcon={!createAlbumIntent ? <CreateNewFolderIcon /> : <CancelIcon />}
                                onClick={() => (setCreateAlbumIntent(!createAlbumIntent))}
                            >
                                {!createAlbumIntent ? "Add Album" : "Cancel"}
                            </Button>
                        </div>

                        <div className={albumListStyle.albumsList}>
                            {
                                albums.map((album) => (
                                    <div 
                                        className={albumListStyle.album}
                                        key={album.id}
                                        onClick={() => (handleClick(album.name))}
                                    >
                                        <img src="./galleryImg.png" alt="Album-Bg-Img"/>
                                        <span>{album.name}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )
            }

            {
                activeAlbum && (
                    <ImageList
                        albumId={albums.find((a) => a.name === activeAlbum).id}
                        albumName={activeAlbum}
                        onBack={handleBack}
                    />
                )
            }
        </>
    )
}


