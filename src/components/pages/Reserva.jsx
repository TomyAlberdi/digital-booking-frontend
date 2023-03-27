import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

const Reserva = ({Token,Usuario,dir}) => {

    const params = useParams()
    const navigate = useNavigate()
    // Llamada API: Obtener producto
    const [Data, setData] = useState({})
    const [LoadingData, setLoadingData] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            fetch(`http://${dir}:8080/productos/buscar/${params.id}`)
            .then(res => res.json())
            .then(data => {
                setData(data)
                fetchDataFechas(data.id)
                setLoadingData(false)
            })
        }
        fetchData()
    },[LoadingData])
    // Obtener fechas reservadas
    const [Fechas, setFechas] = useState()
    const fetchDataFechas = async (id) => {
        const aux = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`
            }
        }
        fetch(`http://${dir}:8080/reservas/buscarProductoId/${id}`,aux)
        .then(res => res.json())
        .then(data => {
            let arrayFechas = data.map(e => ({
                start: new Date(e.fechaInicial),
                end: new Date(e.fechaFinal)
            }))
            setFechas(arrayFechas)
        })
    }
    // Obtener fechas seleccionadas por el usuario
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const onChangeDates = (dates) => {
        const [start, end] = dates;
        const displayFechaCheckin = document.querySelector('.checkin h4')
        const displayFechaCheckout = document.querySelector('.checkout h4')
        if(start !== null) {
            let inicioYear = start.toLocaleString("default", {year: "numeric"})
            let inicioMonth = start.toLocaleString("default", {month: "2-digit"})
            let inicioDay = start.toLocaleString("default", {day: "2-digit"})
            let FechaCheckin = inicioYear + "-" + inicioMonth + "-" + inicioDay
            displayFechaCheckin.innerHTML = FechaCheckin
            setStartDate(start);
        }
        if(end !== null) {
            let finalYear = end.toLocaleString("default", {year: "numeric"})
            let finalMonth = end.toLocaleString("default", {month: "2-digit"})
            let finalDay = end.toLocaleString("default", {day: "2-digit"})
            let FechaCheckout = finalYear + "-" + finalMonth + "-" + finalDay
            displayFechaCheckout.innerHTML = FechaCheckout
            setEndDate(end);
        }
    };
    // Modificar ciudad ingresada en el perfil del usuario
    // NO UTILIZADO POR MALENTENDIDO CON LAS USER STORIES
    const manageCiudad = async (nombreCiudad) => {
        try {
            // Busca Ciudad Ingresada en la base de datos
            const obtenerCiudad = await fetch(`http://${dir}:8080/ciudad/buscarCiudad/${nombreCiudad}`);
            const ciudadData = await obtenerCiudad.json();

            // Si la ciudad existe, modifica al usuario
            const url = `http://${dir}:8080/usuarios/modificarCiudad/${Usuario.id}`;
            const body = JSON.stringify({
                "id_Ciudad": ciudadData.id
            });
            const aux = {
                method: "PATCH",
                headers: {
                'Content-Type': 'application/json'
                },
                body: body
            };

            const modificarCiudad = await fetch(url, aux);
            if (modificarCiudad.ok) {
                return true;
            } else {
                return false
            }
        } catch {
            // Si falla la búsqueda o la modificación, retorna falso
            return false
        }
    }
    // Submit Form Reservas
    const submitReserva = async (e) => {
        e.preventDefault()
        // Inputs
        const inputHora = document.querySelector('#hora')
        const displayFechaCheckin = document.querySelector('.checkin h4')
        const displayFechaCheckout = document.querySelector('.checkout h4')
        // const ciudadActualizada = await manageCiudad(valueCiudad);
        // if (!ciudadActualizada) {
        //     return;
        // }
        // Values de la reserva
        const valueHora = inputHora.value;
        const valueStart = displayFechaCheckin.innerHTML;
        const valueEnd = displayFechaCheckout.innerHTML;
        // Fetch para creación de la reserva
        const url = `http://${dir}:8080/reservas/agregar`;
        const aux = {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${Token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "hora_Comienzo": valueHora,
                "fecha_Inicial": valueStart,
                "fecha_Final": valueEnd,
                "id_Producto": Data.id,
                "id_Cliente": Usuario.id
            })
        };
        try {
            const res = await fetch(url,aux)
            if (res.ok) {
                navigate("/ReservaExitosa")
            } else {
                alert("Se produjo un error al crear la reserva. Inténtelo más tarde.")
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    if (LoadingData) {
        return (
            <div>
                <h1 className='msgLoading'>Cargando...</h1>
            </div>
        )
    } else {
        return(
            <div className='Reserva'>
            <section className="headerProducto">
                <div>
                    <h2>{Data.categoria.titulo}</h2>
                    <h1>{Data.nombre}</h1>
                </div>
                <div>
                    <Link to={`/producto/${Data.id}`}><i className="fa-solid fa-angle-left"></i></Link>
                </div>
            </section>
            <form className="dataReserva" onSubmit={submitReserva}>
                <section className="datosUsuario div1">
                    <h2 className="title">Completá tus datos</h2>
                    <div className='reservaContent inputs'>
                        <div><label htmlFor="nombre">Nombre</label><input type="text" name="nombre" id="nombre" disabled value={Usuario.nombre} placeholder={Usuario.nombre} /></div>
                        <div><label htmlFor="apellido">Apellido</label><input type="text" name="apellido" id="apellido" disabled value={Usuario.apellido} placeholder={Usuario.apellido} /></div>
                        <div><label htmlFor="correo">Correo Electrónico</label><input type="text" name="correo" id="correo" disabled value={Usuario.email} placeholder={Usuario.email} /></div>
                        <div><label htmlFor="ciudad">Ciudad</label><input type="text" name="ciudad" id="ciudad" disabled value={Usuario.ciudad.nombre} /></div>
                    </div>
                </section>
                <section className="fechaReserva div2">
                    <h2 className="title">Seleccioná tu fecha de reserva</h2>
                    <DatePicker
                        selected={startDate}
                        onChange={onChangeDates}
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        excludeDateIntervals={Fechas}
                        calendarClassName="calDesktop"
                        monthsShown={2}
                        selectsRange
                        inline
                    />
                    <DatePicker
                        selected={startDate}
                        onChange={onChangeDates}
                        startDate={startDate}
                        minDate={new Date()}
                        endDate={endDate}
                        excludeDateIntervals={Fechas}
                        calendarClassName="calMobile"
                        monthsShown={1}
                        selectsRange
                        inline
                    />
                </section>
                <section className="horario div3">
                    <h2 className="title">Tu horario de llegada</h2>
                    <div className="reservaContent">
                        <h3><i className="fa-regular fa-circle-check"></i> Tu habitación va a estar lista para el check-in entre las 10:00 AM y las 11:00 PM</h3>
                        <div className="inputs">
                            <label htmlFor="hora">Indicá tu horario estimado de llegada</label>
                            <select name="hora" id="hora" defaultValue="" required>
                                <option value="" disabled>Seleccionar horario de llegada</option>
                                <option value="01:00:00">01:00 AM</option>
                                <option value="02:00:00">02:00 AM</option>
                                <option value="03:00:00">03:00 AM</option>
                                <option value="04:00:00">04:00 AM</option>
                                <option value="05:00:00">05:00 AM</option>
                                <option value="06:00:00">06:00 AM</option>
                                <option value="07:00:00">07:00 AM</option>
                                <option value="08:00:00">08:00 AM</option>
                                <option value="09:00:00">09:00 AM</option>
                                <option value="10:00:00">10:00 AM</option>
                                <option value="11:00:00">11:00 AM</option>
                                <option value="12:00:00">12:00 PM</option>
                                <option value="13:00:00">01:00 PM</option>
                                <option value="14:00:00">02:00 PM</option>
                                <option value="15:00:00">03:00 PM</option>
                                <option value="16:00:00">04:00 PM</option>
                                <option value="17:00:00">05:00 PM</option>
                                <option value="18:00:00">06:00 PM</option>
                                <option value="19:00:00">07:00 PM</option>
                                <option value="20:00:00">08:00 PM</option>
                                <option value="21:00:00">09:00 PM</option>
                                <option value="22:00:00">10:00 PM</option>
                                <option value="23:00:00">11:00 PM</option>
                                <option value="24:00:00">12:00 AM</option>
                            </select>
                        </div>
                    </div>
                </section>
                <section className="reservaInfo div4">
                    <h1>Detalles de la reserva</h1>
                    <div className="imagen">
                        <img src={Data.imagenes[0].url} alt="Imagen del producto" />
                    </div>
                    <div className="productInfo">
                        <h3>{Data.categoria.titulo}</h3>
                        <h2>{Data.nombre}</h2>
                        <h3 className="ubicacion"><i className="fa-solid fa-location-dot"></i>{Data.ciudad.nombre}</h3>
                    </div>
                    <div className="fechasReserva">
                        <section className='checkin'>
                            <h3>Check in</h3>
                            <h4>-</h4>
                        </section>
                        <section className='checkout'>
                            <h3>Check out</h3>
                            <h4>-</h4>
                        </section>
                    </div>
                    <button type="submit">Confirmar reserva</button>
                </section>
            </form>
            <section className="politicProducto">
                    <h2 className="productTitle">Qué tenés que saber</h2>
                    <section>
                        {
                            Data.politicas.map((e,index) => {
                                return <div key={index} className={"div"+(index+1)}>
                                    <h3>{e.nombre}</h3>
                                    <ul>
                                        {
                                            e.descripcion.map((c,y) => {
                                                return <li key={y}>{c}</li>
                                            })
                                        }
                                    </ul>
                                </div>
                            })
                        }
                    </section>
            </section>
        </div>
        )
    }
}

export default Reserva