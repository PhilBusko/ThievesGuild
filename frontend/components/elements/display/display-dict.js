/**************************************************************************************************
DISPLAY DICTIONARY
**************************************************************************************************/
import { styled } from '@mui/material/styles'
import * as ST from '../styled-elements';


const ContrastText = styled(ST.BaseText)(({ theme }) => ({
    color: ST.DefaultText,
}));

function DisplayDict(props) {

    const DisplayTable = styled('table')(({ theme }) => ({
        maxWidth: props.width,
        padding: '0px 6px 4px 6px', 
        border: `1px solid ${ST.FadedBlue}`,
        borderRadius: '2px',
        background: ST.TableBkgd,
        '& tr': {
            '& td:nth-of-type(1)': {paddingRight: '6px'},
        },
    }));

    return (<>
        {Object.keys(props.infoDx).length > 0 &&
            <DisplayTable>
                <tbody>
                    { Object.keys(props.infoDx).map((key, idx) => ( 
                        <tr key={idx}>
                            <td>
                                <ContrastText sx={{ whiteSpace: 'nowrap'}}><b>{key}:</b></ContrastText>
                            </td>
                            <td>
                                <ContrastText>{ props.infoDx[key] }</ContrastText>
                            </td>
                        </tr> 
                    )) }
                </tbody>
            </DisplayTable>
        }
        {Object.keys(props.infoDx).length == 0 &&
            <DisplayTable sx={{ height: props.height }}>
                <tbody>
                    <tr>
                        <td>
                            <ContrastText sx={{ textAlign: 'center' }}>No Data</ContrastText>
                        </td>
                    </tr> 
                </tbody>
            </DisplayTable>
        }
    </>);
}

DisplayDict.defaultProps = {
    infoDx: {},
    width: '280px',
    height: '180px',
};

export default DisplayDict;
