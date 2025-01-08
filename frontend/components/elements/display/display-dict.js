/**************************************************************************************************
DISPLAY DICTIONARY
**************************************************************************************************/
import { styled } from '@mui/material/styles'
import * as ST from '../styled-elements';


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
            <DisplayTable sx={{ width: props.width }}>
                <tbody>
                    { Object.keys(props.infoDx).map((key, idx) => ( 
                        <tr key={idx}>
                            <td>
                                <ST.BaseText sx={{ whiteSpace: 'nowrap'}}><b>{key}:</b></ST.BaseText>
                            </td>
                            <td>
                                <ST.BaseText>{ props.infoDx[key] }</ST.BaseText>
                            </td>
                        </tr> 
                    )) }
                </tbody>
            </DisplayTable>
        }
        {Object.keys(props.infoDx).length == 0 &&
            <DisplayTable sx={{ width: '150px', height: props.height }}>
                <tbody>
                    <tr>
                        <td>
                            <ST.BaseText sx={{ textAlign: 'center' }}>No Data</ST.BaseText>
                        </td>
                    </tr> 
                </tbody>
            </DisplayTable>
        }
    </>);
}

DisplayDict.defaultProps = {
    infoDx: {},
    width: '240px',
    height: '180px',
};

export default DisplayDict;
