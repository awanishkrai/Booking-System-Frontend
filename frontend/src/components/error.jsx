import react from 'react';
export default function Error({message}){
    return(
        <div id="errorBox" style={{color:"red",fontSize:"20px",textAlign:"center"}}>
            {message}
        </div>
    )
}