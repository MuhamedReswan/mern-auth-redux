import { Spinner } from 'react-bootstrap' 

import React from 'react'

const Loader = () => {
  return (
<Spinner aanimation="border" role="status"
style={{
    width:'100',
    height:'100',
    margin:'auto',
    display:'block'
}}>

</Spinner>
  )
}

export default Loader;
