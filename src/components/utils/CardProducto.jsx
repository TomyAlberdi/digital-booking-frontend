import React from 'react'
import { Link } from 'react-router-dom'

const CardProducto = ({data}) => {
    return (
        <div className='CardProducto'>
            <section className="img">
                <img src={data.imagenes[0].url} alt="Imagen del producto" />
                <i className="fa-solid fa-heart"></i>
                <div className="bkgEffect"></div>
            </section>
            <section className="info">
                <section className="dataCardProducto">
                    <h2>{data.nombre}</h2>
                    <h3>{data.ciudad.nombre}</h3>
                    <h3>{data.categoria.titulo}</h3>
                    {
                        data.descripcion.length > 100 ? <p>{data.descripcion.substring(0,100)}...</p> : <p>{data.descripcion}</p>
                    }
                </section>
                <Link to={`/producto/${data.id}`}>Ver más</Link>
            </section>
        </div>
    )
}

export default CardProducto