import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = ({Usuario,setToken,setUsuario}) => {

    const navigate = useNavigate()

    const menuOpen = () => {
        let menu = document.querySelector('.mobileMenu')
        menu.classList.toggle('open')
        let body = document.querySelector('body')
        body.classList.toggle('open_menu')
    }

    let getLocation = () => {
        return useLocation().pathname
    }

    const cerrarSesion = () => {
        setToken(null)
        setUsuario(null)
        navigate("/IniciarSesion")
    }

    return (
        <>
            <header>
                <section className="logo">
                    <Link to={"/"}><img src="/logo1.png" alt="Logo Imagen" /></Link>
                    <Link to={"/"}><h3>Sentite como en tu lugar</h3></Link>
                </section>
                <section className="mobileMenuButton" onClick={menuOpen}>
                    <i className="fa-solid fa-bars"></i>
                </section>
                {
                    !!Usuario ? 
                        <section className="accountInfoContainer">
                            {
                                Usuario.rol.nombre === "Role_Administrador" ?
                                <section className="adminMenu">
                                    <Link to={"/Administracion"}>Administración</Link>
                                </section> :
                                ""
                            }
                            <section className="accountInfo">
                                <div className="userIcon">{Usuario.nombre.charAt(0)}{Usuario.apellido.charAt(0)}</div>
                                <div className='nombreUsuario'>
                                    Hola, <br />
                                    <h3>{Usuario.nombre}  {Usuario.apellido}</h3>
                                </div>           
                                <i className="fa-solid fa-xmark" onClick={cerrarSesion}></i>
                            </section>
                        </section> :
                    getLocation() === "/IniciarSesion" ?
                        <section className="account">
                            <Link to={"/CrearCuenta"}><button>Crear cuenta</button></Link>
                        </section> :
                    getLocation() === "/CrearCuenta" ?
                        <section className="account">
                            <Link to={"/IniciarSesion"}><button>Iniciar Sesion</button></Link>
                        </section> :
                        <section className="account">
                            <Link to={"/CrearCuenta"}><button>Crear cuenta</button></Link>
                            <Link to={"/IniciarSesion"}><button>Iniciar Sesion</button></Link>
                        </section>
                }
            </header>
            <div className="mobileMenu">
                <section className="menuHeader">
                    <div className="mobileMenuButton" onClick={menuOpen}>
                        <i className="fa-solid fa-xmark"></i>
                    </div>
                    {
                        !!Usuario ? 
                            <div className="mobileAccount">
                                <div className="userIcon">{Usuario.nombre.charAt(0)}{Usuario.apellido.charAt(0)}</div>
                                <h3>Hola,</h3>
                                <h3 className='name'>{Usuario.nombre}  {Usuario.apellido}</h3>
                            </div> :
                            <h2>MENÚ</h2>
                    }
                </section>
                {
                    !!Usuario ? 
                        Usuario.rol.nombre === "Role_Administrador" ?
                            <section className="mobileLogin">
                                <Link to={"/Administracion"} onClick={menuOpen}>Administración</Link>
                            </section>
                        : ""
                    :
                    getLocation() === "/IniciarSesion" ?
                        <section className="mobileLogin">
                            <Link to={"/CrearCuenta"} onClick={menuOpen}>Crear cuenta</Link>
                        </section> :
                    getLocation() === "/CrearCuenta" ?
                        <section className="mobileLogin">
                            <Link to={"/IniciarSesion"} onClick={menuOpen}>Iniciar Sesión</Link>
                        </section> :
                        <section className="mobileLogin">
                            <Link to={"/CrearCuenta"} onClick={menuOpen}>Crear cuenta</Link>
                            <Link to={"/IniciarSesion"} onClick={menuOpen}>Iniciar Sesión</Link>
                        </section>
                }
                <section className="menuFooter">
                    {!!Usuario ? <h3>¿Deseas <span onClick={() => {cerrarSesion();menuOpen()}}>cerrar sesión</span>?</h3> : ""}
                    <div className="socialMedia">
                        <i className="fa-brands fa-facebook"></i>
                        <i className="fa-brands fa-linkedin-in"></i>
                        <i className="fa-brands fa-twitter"></i>
                        <i className="fa-brands fa-instagram"></i>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Navbar