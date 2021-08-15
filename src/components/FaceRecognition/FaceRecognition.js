import React from "react";

const FaceRecognition = ({imageUrl, celeb, valor}) => {
    return(
        <div className='center ma'>
            <div className='absolute mt2'>
                    <p className='f2 white ttc'>{celeb}</p>
            <img 
                alt=''
                src={imageUrl}
                width='auto'
                height='500px'/>
                    {!imageUrl
                        ?<p>{""}</p>
                        :(valor>0.8 
                            ?<p className='f2 white '>{"Pegou o changeling canalha!"}</p>
                            :<p className='f2 white '>{"Infelizmente não foi dessa vez!"}</p>)}
            </div>
        </div>
    );
}

export default FaceRecognition;