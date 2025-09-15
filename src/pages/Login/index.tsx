import { /*useNavigate,*/ useParams } from "react-router-dom"

export const Login = () => {

    const { parametro } = useParams()

    console.log(parametro)
    return (
        <>
            <h1>Pagina Login {parametro}</h1>
        </>
    )
}