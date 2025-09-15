import { useEffect } from "react"

const usuarios = [
    {
        "id": 1,
        "nome": "Felipe",
        "email": "espetinho@gmail.com",
    },
    {
        "id": 2,
        "nome": "Claudio",
        "email": "claudio@gmail.com"
    },
    {
        "id": 3,
        "nome": "Daniel",
        "email": "Daniel@gmail.com"
    }
]

export const Usuarios = () => {

    useEffect(() => {
        //requisição no backend
    }, [])
    return (
        <>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 15
                }}
            >
                <h2>Usuários</h2>
                <button className="btn btn-success" type="button">Add</button>

            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Email</th>
                        <th scope="col">Ações</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        usuarios.map((usuario, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">{usuario.id}</th>
                                    <td>{usuario.nome}</td>
                                    <td>{usuario.email}</td>
                                    <td>
                                        <button className="btn btn-primary" type="button" style={{ marginRight: 5 }}>
                                            Editar
                                        </button>
                                        <button className="btn btn-danger" type="button">
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }

                </tbody>

            </table>
        </>
    )
}