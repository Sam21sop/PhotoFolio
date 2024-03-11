import { Button } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import imageFormStyle from './imageForm.module.css'
import { useEffect, useRef } from "react";


export default function ImageForm(props) {

    // destructure state and eventHandler
    const {updateIntent, onAdd, onUpdate, loading, albumName} = props;

    // direct input reference using useRef
    const imageTitle = useRef();
    const imageUrl = useRef();

    // useEffect() hook for current image updation
    useEffect(() => {
        if(updateIntent){
            handleDefaultValue()
        }
    }, [updateIntent])

    // submit form handler
    const formSubmitHandler = (e) => {
        e.preventDefault();
        const imgTitle = imageTitle.current.value;
        const imgUrl = imageUrl.current.value;
        if (!updateIntent) {
            onAdd({
                imgTitle,
                imgUrl
            });
        } else {
            onUpdate({
                imgTitle,
                imgUrl
            });
        };
        clearInputFieldHandler();
    };

    // clear input fiels after submiting form
    const clearInputFieldHandler = () =>{
        imageTitle.current.value = '';
        imageUrl.current.value = '';
    };

    // handle update for default value
    const handleDefaultValue = () => {
        imageTitle.current.value = updateIntent.imgTitle;
        imageUrl.current.value = updateIntent.imgUrl;
    }


    return (
        <>
            <div className={imageFormStyle.imageForm}>
                <span>
                    {
                        !updateIntent ? 
                            `Add Image To ${albumName}` : 
                            `Update Image ${updateIntent.imageTitle}`
                    }
                </span>

                <form onSubmit={formSubmitHandler}>
                    <input 
                        type="text" 
                        required
                        placeholder="Image Title"
                        ref={imageTitle}
                        autoFocus
                    />

                    <input 
                        type="text" 
                        required
                        placeholder="Image Url"
                        ref={imageUrl}
                    />

                    <div className={imageFormStyle.buttonAction}>
                        <Button 
                            variant="contained" 
                            startIcon={<AddAPhotoIcon />}
                            color="success"
                            onClick={(e) => formSubmitHandler(e)}
                        >
                            {
                                !updateIntent ?
                                    "Add" :
                                    "Update"
                            }
                        </Button>

                        <Button 
                            variant="contained" 
                            startIcon={<CancelIcon />}
                            color="error"
                            onClick={clearInputFieldHandler}
                        >
                            Clear
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
};