import {Button } from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRef } from "react";
import albumFormStyle from './albumForm.module.css';


export default function AlbumForm (props) {
    // extract state and eventhandle from props
    const {onAdd, loading} = props;

    // direct accessing input node using useRef()
    const albumNameInput = useRef();

    //  handle form subimt event 
    const handleSubmit = (e) => {
        // e.PreventDefault();
        const albumName = albumNameInput.current.value;
        onAdd(albumName);
        handleClear();
    }

    // clear input field after submitting form
    const handleClear = () => (albumNameInput.current.value = '')

    // return form UI
    return (
        <>
            <div className={albumFormStyle.albumForm}>
                <span>Create an Album</span>
                <form>
                    {/* user input for folder name  */}
                    <input 
                        type="text" 
                        ref={albumNameInput} 
                        required
                        onClick={handleClear}
                        placeholder="Enter Album Name"
                        autoFocus
                    />

                    {/* button for creating folder  */}
                    <Button 
                        variant="contained" 
                        startIcon={<CreateNewFolderIcon />}
                        color="success"
                        onClick={handleSubmit}
                    >
                        Create
                    </Button>

                    {/* button for clear the current name  */}
                    <Button 
                        variant="contained" 
                        startIcon={<CancelIcon />}
                        color="error"
                        onClick={handleClear}
                    >
                        Clear
                    </Button>
                </form>
            </div>                
        </>
    )
}