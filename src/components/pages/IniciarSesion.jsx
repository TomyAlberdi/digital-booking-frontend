import React, { useEffect } from 'react'
import {Link, useNavigate, useLocation } from 'react-router-dom'

const IniciarSesion = ({setUsuario,setToken,dir}) => {

    const navigate = useNavigate()
    const location = useLocation()

    let log = location?.state?.log
    useEffect(() => {
        let prevError = document.querySelector('#error_reserva')
        if (log === false && !prevError) {
            let error = document.createElement('span')
            error.id = "error_reserva"
            error.style.color = "hsl(0, 100%, 66%)"
            error.style.marginBottom = "1.5vh"
            error.style.fontSize = "1.3rem"
            error.innerText = "Para realizar una reserva debes estar logueado!"
            document.querySelector('h1').before(error)
        }
    }, [])
    

    const login = (e) => {
        e.preventDefault()
        // Elimina las alertas de errores creadas con anterioridad
        document.querySelectorAll('input').forEach(e => {
            e.classList.remove("errorInput")
        })
        document.querySelectorAll('.error').forEach(e => {
            e.remove()
        })
        // Inputs
        let emailInput = document.querySelector("#emailLogin")
        let passwordInput = document.querySelector("#passwordLogin")
        // Valores de los inputs
        let emailValue = emailInput.value
        let passwordValue = passwordInput.value
        // Validación de los datos ingresados
        const validacion = () => {
            if ((emailValue == "")||(emailValue == null)||(passwordValue == "")||(passwordValue == null)) {
                let error = document.createElement('span')
                error.classList.add('error')
                error.innerText = "El correo electrónico o la contraseña no pueden estar vacíos"
                emailInput.classList.add("errorInput")
                passwordInput.classList.add("errorInput")
                passwordInput.after(error)
                return false
            } else {
                return true
            }
        }
        const APILogin = async () => {
            let body = JSON.stringify({
                "email": emailValue,
                "password": passwordValue
            })
            const url = `http://${dir}:8080/login`
            const aux = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body
            }
            let peticionLogin = fetch(url,aux)
            if ((await peticionLogin).status === 200) {
                peticionLogin
                .then(res => res.json())
                .then(data => {
                    setToken(data.token)
                    return true
                })
            } else {
                let error = document.createElement('span')
                error.classList.add('error')
                error.innerText = "Lamentablemente no ha podido iniciar sesión. Por favor, intente más tarde"
                passwordInput.after(error)
            }
        }
        if (validacion()) {
            if (APILogin()) {
                fetch(`http://${dir}:8080/usuarios/buscarEmail/${emailValue}`)
                .then(res => res.json())
                .then(data => {
                    setUsuario(data)
                    if (log === false) {
                        location.state.log = true
                        navigate(-1)
                    } else {
                        navigate("/")
                    }
                })
            }
        }
    }

    return (
        <div className='IniciarSesion'>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={login}>
                <section>
                    <label htmlFor="email">Correo electrónico</label>
                    <input type="email" name='email' id='emailLogin' />
                </section>
                <section>
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" name="password" id='passwordLogin' />
                </section>
                <button type="submit">Ingresar</button>
                <h3>¿Aún no tienes cuenta? <span><Link to={"/CrearCuenta"}>Registrarte</Link></span></h3>
            </form>
        </div>
    )
}

export default IniciarSesion