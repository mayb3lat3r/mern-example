import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { AuthContext } from '../context/AuthContext'

const AuthPage = () => {
    const auth = useContext(AuthContext)
    const { loading, request, error, clearError } = useHttp()
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const message = useMessage()

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', form)
            message(data.message)

        } catch (e) {

        }
    }

    const loginHandler = async () => {
        try {
            const data = await request('api/auth/login', 'POST', form)
            auth.login(data.token, data.userId)
        } catch (e) {

        }
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Shorten the link</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authorization</span>
                        <div>

                            <div className="input-field">
                                <input id="email"
                                    type="text"
                                    data-length="10"
                                    name="email"
                                    className="white-input"
                                    value={form.email}
                                    onChange={changeHandler}
                                    disabled={loading}
                                />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="input-field">
                                <input id="password"
                                    type="password"
                                    data-length="10"
                                    name="password"
                                    className="white-input"
                                    value={form.password}
                                    onChange={changeHandler}
                                    disabled={loading}
                                />
                                <label htmlFor="password">Password</label>
                            </div>

                        </div>
                        <div className="card-action">
                            <button className="btn yellow darken-4"
                                style={{ marginRight: 10, fontWeight: "bold" }}
                                onClick={loginHandler}
                            >Login</button>
                            <button className="btn grey lighten-1 black-text"
                                style={{ fontWeight: "bold" }}
                                onClick={registerHandler}
                            >Register</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthPage