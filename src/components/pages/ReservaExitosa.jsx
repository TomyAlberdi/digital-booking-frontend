import React from 'react';
import {Link} from 'react-router-dom'

const ReservaExitosa = () => {
    return (
        <div className='ReservaExitosa'>
            <section className="cardReservaExitosa">
                <i className="fa-solid fa-circle-check"></i>
                <h2>¡Muchas Gracias!</h2>
                <h3>Su reserva se ha realizado con éxito</h3>
                <Link to="/">Inicio</Link>
            </section>
        </div>
    )
}

export default ReservaExitosa