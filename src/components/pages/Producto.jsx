import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

/* Galería de imágenes (mobile) */
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import 'swiper/css/pagination';

/* Galería de imágenes (desktop) */
import FsLightbox from "fslightbox-react";

/* Calendario de disponibilidad */
import Calendar from 'reactjs-availability-calendar'

const Producto = ({Token,dir}) => {

    const params = useParams()
    const navigate = useNavigate()

    // Llamada API: Obtener productos
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

    // Toggler para abrir galería de imágenes
    const [toggler, setToggler] = useState(false);

    // Obtener fechas reservadas
    const [Fechas, setFechas] = useState()
    const fetchDataFechas = async (id) => {
        const aux = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        }
        fetch(`http://${dir}:8080/reservas/buscarProductoId/${id}`,aux)
        .then(res => res.json())
        .then(data => {
            let arrayFechas = data.map(e => ({
                from: e.fechaInicial,
                to: e.fechaFinal
            }))
            setFechas(arrayFechas)
        })
    }

    if (LoadingData) {
        return (
            <div>
                <h1 className='msgLoading'>Cargando...</h1>
            </div>
        )
    } else {
        return (
            <article className='Producto'>
                <section className="headerProducto">
                    <div>
                        <h2>{Data.categoria.titulo}</h2>
                        <h1>{Data.nombre}</h1>
                    </div>
                    <div>
                        <Link to={"/"}><i className="fa-solid fa-angle-left"></i></Link>
                    </div>
                </section>
                <section className="locationProducto">
                    <div>
                        <i className="fa-solid fa-location-dot"></i>
                        <h2>{Data.ciudad.nombre}</h2>
                    </div>
                    <div>
                    </div>
                </section>
                <section className="imagesProducto">
                    {
                        Data.imagenes.slice(0,5).map((e,index) => {
                            return <img src={e.url} alt="Imagen del producto" className={"div"+(index+1)} key={index} />
                        })
                    }
                    <FsLightbox
                        toggler={toggler}
                        sources={
                            Data.imagenes.map(e => e.url)
                        }
                    />
                    <button onClick={() => setToggler(!toggler)}>Ver más</button>
                </section>
                <Swiper className='mySwiper' pagination={{type:"fraction"}} modules={[Pagination]}>
                    {
                        Data.imagenes.map((e,index) => {
                            return <SwiperSlide key={index}><img src={e.url} alt={e.titulo} /></SwiperSlide>
                        })
                    }
                </Swiper>
                <section className="descriptionProducto">
                    <p>{Data.descripcion}</p>
                </section>
                <section className="caractProducto">
                    <h2 className='productTitle'>¿Qué ofrece este lugar?</h2>
                    <div className="iconsCaract">
                        {
                            Data.caracteristicas.map((e,index) => {
                                return <span key={index} className={"div"+(index+1)}><i className={e.icono}></i> {e.nombre}</span>
                            })
                        }
                    </div>
                </section>
                <section className="disponibilidad">
                    <h2>Fechas disponibles</h2>
                    <div className='container'>
                        <Calendar 
                            bookings={Fechas !== undefined ? Fechas : []}
                            showNumberOfMonths={2}
                            showCurrentYear={false}
                            showKey={false}
                        />
                        <Calendar 
                            bookings={Fechas !== undefined ? Fechas : []}
                            showNumberOfMonths={1}
                            showCurrentYear={false}
                            showKey={false}
                        />
                        <div className="reserva">
                            <h3>Agregá tus fechas de viaje para obtener precios exactos</h3>
                            <button onClick={() =>{!Token ? navigate(`/IniciarSesion`,{state:{log:false}}) : navigate(`/producto/reserva/${Data.id}`)}}>Iniciar Reserva</button>
                        </div>
                    </div>
                </section>
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
            </article>
        )
    }
}

export default Producto