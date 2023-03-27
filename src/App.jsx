import './sass/App.css'
import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'

import ScrollToTop from './components/utils/ScrollToTop'
import Home from './components/pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import IniciarSesion from './components/pages/IniciarSesion'
import CrearCuenta from './components/pages/CrearCuenta'
import Producto from './components/pages/Producto'
import Reserva from './components/pages/Reserva'
import ReservaExitosa from './components/pages/ReservaExitosa'
import Administracion from './components/pages/Administracion'

function App() {

    const [Token, setToken] = useState(localStorage.getItem('token'))
    const [Usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuario')))
    useEffect(() => {
        if (Token !== null && Usuario !== null) {
            localStorage.setItem('token',Token)
            localStorage.setItem('usuario',JSON.stringify(Usuario))
        } else {
            localStorage.removeItem('token')
            localStorage.removeItem('usuario')
        }
    },[Token,Usuario])

    const dir = "18.119.141.23"
    // const dir = "localhost"

    return (
        <div className="App">
            <Navbar Usuario={Usuario} setUsuario={setUsuario} setToken={setToken} />
            <main>
                <ScrollToTop>
                    <Routes>
                        <Route path='/' element={<Home dir={dir} />} />
                        <Route path='/producto/:id' element={<Producto Token={Token} dir={dir} />} />
                        <Route path='/producto/reserva/:id' element={<Reserva Token={Token} Usuario={Usuario} dir={dir} />} />
                        <Route path='/reservaExitosa' element={<ReservaExitosa />} />
                        <Route path='/IniciarSesion' element={<IniciarSesion setUsuario={setUsuario} setToken={setToken} dir={dir} />} />
                        <Route path='/Administracion' element={<Administracion dir={dir} />} />
                        <Route path='/CrearCuenta' element={<CrearCuenta setUsuario={setUsuario} setToken={setToken} dir={dir} />} />
                    </Routes>
                </ScrollToTop>
            </main>
            <Footer />
        </div>
    )
}

export default App
