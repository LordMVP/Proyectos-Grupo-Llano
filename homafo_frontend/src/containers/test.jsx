import React, { Component } from 'react'
import axios from 'axios'


export default class test extends Component {
    handleChange = e => this.setState({ [e.target.name]: e.target.value })
    handleChangeF = e => this.setState({ [e.target.name]: e.target.files[0] })

    cl = () => {

        console.log("submit")
        let data = new FormData()
        data.append("nombre", this.state.nombre)
        data.append("file", this.state.file, this.state.file.filename)
        axios({
            url: "http://localhost:8000/upload/666",
            method: "POST",
            data

        }).then(x => {
            console.log("fine")
        })
            .catch(x => {
                console.log("Se mareo esto")
            })

    }
    render() {
        return (
            <div>

                <input onChange={this.handleChange} placeholder="name" name="nombre" />
                <input onChange={this.handleChangeF} type="file" name="file" />
                <button onClick={this.cl}>ok</button>
            </div>
        )
    }
}
