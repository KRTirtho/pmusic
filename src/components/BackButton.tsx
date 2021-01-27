import React, { ReactElement } from 'react'
import { Button } from '@nodegui/react-nodegui'
import {useHistory} from "react-router"

function BackButton(): ReactElement {
  const history = useHistory();
  
  return (
    <Button maxSize={{height:30, width: 100}} style={"align-self: flex-start;"} text="Back" on={{clicked: ()=>history.goBack()}}/>
  )
}

export default BackButton
