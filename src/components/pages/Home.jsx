import React, { useState, useEffect } from 'react'
import CardProducto from '../utils/CardProducto'
// Calendario doble de búsqueda
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

import CardCategoria from '../utils/CardCategoria'
// Slides de categorías
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

const Home = ({dir}) => {

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
    // Llamada API: Obtener productos aleatorios
    const [Productos, setProductos] = useState([])
    const [LoadingProductos, setLoadingProductos] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            fetch(`http://${dir}:8080/productos/listarProductosRandom`)
            .then(res => res.json())
            .then(data => {
                setProductos(data)
                setLoadingProductos(false)
            })
        }
        fetchData()
    },[LoadingProductos])
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
    // Filtro de productos por categorías
    const filtCategorias = (cat) => {
        if (!LoadingProductos) {
            setProductos(Productos.filter(e => e.categoria.titulo === cat))
        }
    }
    // Seteo de las fechas seleccionadas para filtrar
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const onChangeDates = (dates) => {
        const [start, end] = dates;
        setStartDate(start)
        setEndDate(end);
    }
    // Filtro de productos por ciudades y/o fechas disponibles
    const filtro = (e) => {
        e.preventDefault()
        // Obtener valores de los inputs
        let ciudadValue = document.querySelector("#cities").value
        // Formatear las fechas seleccionadas a formatos aptos para la API
        // Fecha Inicio
        let fechaInicioValue
        let fechaFinalValue
        if (startDate) {
            let inicioYear = startDate.toLocaleString("default", {year: "numeric"})
            let inicioMonth = startDate.toLocaleString("default", {month: "2-digit"})
            let inicioDay = startDate.toLocaleString("default", {day: "2-digit"})
            fechaInicioValue = inicioYear + "-" + inicioMonth + "-" + inicioDay
        }
        // Fecha Final
        if (endDate) {
            let finalYear = endDate.toLocaleString("default", {year: "numeric"})
            let finalMonth = endDate.toLocaleString("default", {month: "2-digit"})
            let finalDay = endDate.toLocaleString("default", {day: "2-digit"})
            fechaFinalValue = finalYear + "-" + finalMonth + "-" + finalDay
        }
        let url
        if (LoadingProductos) {
            return false
        }
        if (!ciudadValue && (!startDate && !endDate)) {
            // Si ambos valores están vacíos, cancela la búsqueda
            alert("Por favor, seleccione una ciudad y/o una fecha deseada para buscar")
        } else if ((startDate && endDate) && !ciudadValue) {
            // Si no se seleccionó una ciudad, filtra sólo por fechas disponibles
            console.log("filtrando por fechas y no ciudades")
            url = `http://${dir}:8080/reservas/productos-fechas?fechaInicio=${fechaInicioValue}&fechaFin=${fechaFinalValue}`
            fetch(url)
            .then(res => res.json())
            .then(data => setProductos(data))
        } else if (ciudadValue && (!startDate && !endDate)) {
            // Si no se seleccionaron ambas fechas, pero sí una ciudad, filtra sólo por ciudad
            url =`http://${dir}:8080/productos/buscarCiudad/${ciudadValue}`
            fetch(url)
            .then(res => res.json())
            .then(data => setProductos(data))
        } else if ((startDate && endDate) && ciudadValue) {
            // Si se seleccionaron ambas fechas y una ciudad, filtra por ambas
            url = `http://${dir}:8080/reservas/productos-disponibles?nombreCiudad=${ciudadValue}&fechaInicio=${fechaInicioValue}&fechaFin=${fechaFinalValue}`
            fetch(url)
            .then(res => res.json())
            .then(data => setProductos(data))
        }
    }

    return (
        <div className='Home'>
            <section className="search">
                <h1>Busca ofertas en hoteles, casas y mucho más</h1>
                <form className="searchInputs" onSubmit={filtro}>
                    <select name="cities" id="cities" defaultValue="">
                        <option value="" disabled>¿A dónde vamos?</option>
                        {
                            Ciudades.map((e,index) => {
                                return <option key={index} value={e.nombre}>{e.nombre}</option>
                            })
                        }
                    </select>
                    <DatePicker
                        placeholderText='Check In - Check Out'
                        onChange={onChangeDates}
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        monthsShown={2}
                        selectsRange
                    />
                    <button type="submit">Buscar</button>
                </form>
            </section>
            <section className="buscarTipos">
                <h2>Buscar por tipo de alojamiento</h2>
                {
                    LoadingCategorias ? <h2 className='msgLoading'>Cargando categorías...</h2> :
                    <div>
                        <Swiper className='mySwiper desktop' slidesPerView={4} spaceBetween={10} navigation={true} modules={[Navigation]}>
                        {
                            Categorias.map((e,index) => {
                                return <SwiperSlide key={index}><CardCategoria key={index} data={e} filtCategorias={filtCategorias} /></SwiperSlide>
                            })
                        }
                        </Swiper>
                        <Swiper className='mySwiper mobile' slidesPerView={1} spaceBetween={10} navigation={true} modules={[Navigation]}>
                        {
                            Categorias.map((e,index) => {
                                return <SwiperSlide key={index}><CardCategoria key={index} data={e} filtCategorias={filtCategorias} /></SwiperSlide>
                            })
                        }
                        </Swiper>
                    </div>

                }
            </section>
            <section className="recomendados">
                <h2 className='title'>Recomendaciones</h2>
                <section className="cards">
                    {
                        LoadingProductos ? <h2 className='msgLoading'>Cargando productos...</h2> :
                        Productos.length > 0 ?
                            Productos.map((e,index) => {
                                return <CardProducto key={index} data={e} />
                            })
                        :
                        <h2 className="msgLoading">No hay productos disponibles</h2>
                    }
                </section>
            </section>
        </div>
    )
}

export default Home