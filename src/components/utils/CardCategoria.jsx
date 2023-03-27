import React from 'react'

const CardCategoria = ({data,filtCategorias}) => {
    return (
        <div className='CardCategoria' onClick={() => {filtCategorias(data.titulo)}}>
            <img src={data.url} alt="Imagen de la categoría" />
            <section className="info">
                <h2>{data.titulo}</h2>
                {
                    data.descripcion.length > 70 ? <h3>{data.descripcion.substring(0,70)}...</h3> : <h3>{data.descripcion}</h3>
                }
            </section>
        </div>
    )
}

export default CardCategoria