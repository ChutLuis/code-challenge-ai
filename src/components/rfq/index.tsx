import { useEffect } from "react"
import { useParams } from "react-router-dom"

const RFQ = ()=>{
    let {id}= useParams()

    useEffect(()=>{
        console.log(id)
    },[])
    return(
        <div>Pog</div>
    )
}

export default RFQ