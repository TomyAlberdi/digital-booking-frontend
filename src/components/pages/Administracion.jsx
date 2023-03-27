import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Administracion = ({dir}) => {

    // Llamada API: Obtener categorías
    const [Categorias,setCategorias] = useState([])
    const [LoadingCategorias, setLoadingCategorias] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            fetch(`http://${dir}:8080/categoria/listar`)
            .then(res => res.json())
            .then(data => {
                setCategorias(data)
                setLoadingCategorias(false)
            })
        }
        fetchData()
    },[LoadingCategorias])
    // Llamada API: Obtener ciudades
    const [Ciudades, setCiudades] = useState([])
    const [LoadingCiudades, setLoadingCiudades] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            fetch(`http://${dir}:8080/ciudad/listar`)
            .then(res => res.json())
            .then(data => {
                setCiudades(data)
                setLoadingCiudades(false)
            })
        }
        fetchData()
    }, [LoadingCiudades])

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div className='Administracion'>
            <section className="adminHeader">
                <h2>Aministración</h2>
                <Link to={"/"}><i className="fa-solid fa-angle-left"></i></Link>
            </section>
            <h1>Crear Propiedad</h1>
            <form onSubmit={handleSubmit}>
                <div className="basicData">
                    <section>
                        <label htmlFor="nombre">Nombre de la propiedad</label>
                        <input type="text" id='nombre' name='nombre'/>
                    </section>
                    <section>
                        <label htmlFor="categoria">Categoría</label>
                        <select name="categoria" id="categoria" defaultValue="">
                            <option value="" disabled>Seleccionar categoría</option>
                            {
                                Categorias.map((e,index) => {
                                    return <option key={index} value={e.titulo}>{e.titulo}</option>
                                })
                            }
                        </select>
                    </section>
                    <section>
                        <label htmlFor="direccion">Dirección</label>
                        <input type="text" id='direccion' name='direccion'/>
                    </section>
                    <section>
                        <label htmlFor="ciudad">Ciudad</label>
                        <select name="ciudad" id="ciudad" defaultValue="">
                            <option value="" disabled>Seleccionar ciudad</option>
                            {
                                Ciudades.map((e,index) => {
                                    return <option key={index} value={e.nombre}>{e.nombre}</option>
                                })
                            }
                        </select>
                    </section>
                    <section className='descripcion'>
                        <label htmlFor="descripcion">Descripción:</label>
                        <textarea name="descripcion" id="descripcion" cols="30" rows="8"></textarea>
                    </section>
                </div>
                <div className="atributos">
                    <h2>Agregar Atributos</h2>
                </div>
                <div className="politicas">
                    <h2>Políticas del producto</h2>
                </div>
                <div className="imagenes">
                    <h2>Cargar Imágenes</h2>
                </div>
                <button type='submit'>Crear</button>
            </form>
        </div>
    )
}

export default Administracion