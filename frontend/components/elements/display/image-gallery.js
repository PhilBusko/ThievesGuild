/**************************************************************************************************
IMAGE GALLERY
**************************************************************************************************/
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ImageList, ImageListItem, ImageListItemBar} from '@mui/material';
import { Gallery, Item as GalleryItem } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';


const ThumbnailImage = styled('img')(({ theme }) => ({
    width: 180, 
    cursor: 'pointer', 
}));

const StyledImageItem = styled(ImageListItem)(({ theme }) => ({
    border: '1px solid black',
    borderRadius: '2px', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
}));

const StyledItemBar = styled(ImageListItemBar)(({ theme }) => ({
    maxHeight: '30px', 
    fontFamily: 'Sylfaen', 
    padding: '2px 6px',
    '& .MuiImageListItemBar-titleWrap': {padding: '0px'},
}));


function ImageGallery(props) {

    const theme = useTheme();
    var galleryCols = 1;
    if ( useMediaQuery(theme.breakpoints.up('md')) )
        galleryCols = 3;
    if ( useMediaQuery(theme.breakpoints.up('lg')) )
        galleryCols = 4;

    return (
        <ImageList cols={galleryCols} >
            <Gallery >
                { props.imageLs.map( (imgInfo, idx) => (
                    <StyledImageItem key={idx}>
                        <GalleryItem original={ imgInfo.path } width='1024' height='768' >
                            {({ ref, open }) => (
                                <ThumbnailImage src={ imgInfo.path } ref={ref} onClick={open} />
                            )}
                        </GalleryItem>
                        <StyledItemBar title={imgInfo.title} position='below' />
                    </StyledImageItem>
                )) }
            </Gallery>
        </ImageList>
    );
}

ImageGallery.defaultProps = {
    imageLs: [],
};

export default ImageGallery;
