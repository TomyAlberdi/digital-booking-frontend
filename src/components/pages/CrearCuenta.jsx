import React from 'react'
import {Link, useNavigate} from 'react-router-dom'

const CrearCuenta = ({setUsuario,setToken,dir}) => {

    const navigate = useNavigate()

    const errorText = (texto) => {
        let error = document.createElement('span')
        error.classList.add('error')
        error.innerText = texto
        return error
    }

    const crearCuenta = (e) => {
        e.preventDefault()
        // Elimina las alertas de errores creadas con anterioridad
        document.querySelectorAll('.error').forEach(e => {
            e.remove()
        })
        document.querySelectorAll('input').forEach(e => {
            e.classList.remove("errorInput")
        })
        // Inputs
        let emailInput = document.querySelector("#emailCrear")
        let passwordInput = document.querySelector("#passwordCrear")
        let nombreInput = document.querySelector("#nombreCrear")
        let apellidoInput = document.querySelector("#apellidoCrear")
        let passwordConfInput = document.querySelector("#confPasswordCrear")
        // Valores de los inputs
        let emailValue = emailInput.value
        let passwordValue = passwordInput.value
        let nombreValue = nombreInput.value
        let apellidoValue = apellidoInput.value
        let confirmPasswordValue = passwordConfInput.value
        // Valida los datos ingresados por el usuario
        const validaciones = () => {
            if ((nombreValue == "")||(nombreValue == null)||(apellidoValue == "")||(apellidoValue == null)) {
                let error = errorText("El nombre o el apellido no pueden estar vacíos.")
                document.querySelector('.nombreApellido').after(error)
                nombreInput.classList.add("errorInput")
                apellidoInput.classList.add("errorInput")
                return false
            }
            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(emailValue) === false) { 
                let error = errorText("El email no es válido, inténtelo de nuevo.")
                emailInput.classList.add("errorInput")
                emailInput.after(error)
                return false 
            }
            let passwordRegex = /^.{7,}$/
            if (passwordRegex.test(passwordValue) === false) {
                let error = errorText("La contraseña debe tener más de 6 carácteres.")
                passwordInput.classList.add("errorInput")
                passwordInput.after(error)
                return false
            } else if (passwordValue !== confirmPasswordValue) {
                let error = errorText("Las contraseñas no coinciden.")
                passwordConfInput.classList.add("errorInput")
                passwordConfInput.after(error)
                return false
            }
            return true;
        }
        const registro = async () => {
            let body = JSON.stringify({
                "nombre": nombreValue,
                "apellido": apellidoValue,
                "email": emailValue,
                "password": passwordValue,
                "rolId": 1,
                "id_Ciudad": 13
            })
            const url = `http://${dir}:8080/usuarios/agregar`
            const aux = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            }
            fetch(url,aux)
            .then(res => {
                if (res.ok) {
                    return true
                } else {
                    return false
                }
            })
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
            if ((await peticionLogin).ok) {
                peticionLogin
                .then(res => res.json())
                .then(data => {
                    setToken(data.token)
                })
                return true
            } else {
                return false
            }
        }
        if (validaciones()) {
            if (registro()) {
                navigate("/IniciarSesion")
                // if (APILogin()) {
                //     fetch(`http://${dir}:8080/usuarios/buscarEmail/${emailValue}`)
                //     .then(res => res.json())
                //     .then(data => {
                //         setUsuario(data)
                //     })
                //     navigate("/")
                // }
            } else {
                let error = errorText("Lamentablemente no ha podido registrarse. Por favor, intente más tarde.")
                document.querySelector('button[type="submit"]').before(error)
            }
        }
    }
    return (
        <div className='CrearCuenta'>
            <h1>Crear Cuenta</h1>
            <form onSubmit={crearCuenta}>
                <div className='nombreApellido'>
                    <section>
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" name="nombre" id='nombreCrear'/>
                    </section>
                    <section>
                        <label htmlFor="apellido">Apellido</label>
                        <input type="text" name='apellido' id='apellidoCrear'/>
                    </section>
                </div>
                <section>
                    <label htmlFor="email">Correo electrónico</label>
                    <input type="email" name="email" id='emailCrear'/>
                </section>
                <section>
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" name="password" id='passwordCrear'/>
                </section>
                <section>
                    <label htmlFor="confPassword">Confirmar contraseña</label>
                    <input type="password" name="confPassword" id='confPasswordCrear'/>
                </section>
                <button type='submit'>Crear Cuenta</button>
                <h3>¿Ya tienes una cuenta? <span><Link to={"/IniciarSesion"}>Iniciar Sesión</Link></span></h3>
            </form>
        </div>
    )
}

export default CrearCuenta