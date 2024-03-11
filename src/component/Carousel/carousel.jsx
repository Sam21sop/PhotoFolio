import carouselStyle from './carousel.module.css';

export default function Carousel (props) {
    const {onNext, onPrev, onCancel, url, title} = props
    
    return (
        <>
            <div className={carouselStyle.carousel}>
                <button onClick={onCancel}>x</button>
                <button onClick={onPrev}>{"<"}</button>
                <img src={url} alt={title} />
                <button onClick={onNext}>{">"}</button>
            </div>
        </>
    )
}